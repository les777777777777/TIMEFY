import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface UserSnapshot {
  tasksCompleted: number;
  tasksTotal: number;
  routineCompleted: number;
  routineTotal: number;
  wellnessCompleted: number;
  wellnessTotal: number;
  streak: number;
  balance: number;
  mascotName: string;
  usageHours?: number;
  state?: 'active' | 'inactive' | 'saturated' | 'constant';
}

export type AIQueryType = 'why' | 'improve' | 'summary' | 'status' | 'open';

// Cache for AI responses to save quota
const thoughtCache: Record<string, { thought: string, timestamp: number }> = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const AIService = {
  async getMascotThought(snapshot: UserSnapshot, queryType: AIQueryType = 'status', userQuestion?: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return "Para una guía real, configura tu llave de API. Mientras tanto, sigue buscando el equilibrio.";
    }

    // Generate a cache key based on basic state data
    const cacheKey = `${queryType}-${snapshot.tasksCompleted}-${snapshot.wellnessCompleted}-${snapshot.balance}-${userQuestion || ''}`;
    const now = Date.now();
    
    if (thoughtCache[cacheKey] && (now - thoughtCache[cacheKey].timestamp < CACHE_TTL) && queryType !== 'open') {
      return thoughtCache[cacheKey].thought;
    }

    const contextStr = `
      DATOS REALES DEL USUARIO:
      - Tareas: ${snapshot.tasksCompleted}/${snapshot.tasksTotal} (${Math.round((snapshot.tasksCompleted/snapshot.tasksTotal)*100 || 0)}%)
      - Rutinas: ${snapshot.routineCompleted}/${snapshot.routineTotal}
      - Bienestar: ${snapshot.wellnessCompleted}/${snapshot.wellnessTotal}
      - Racha: ${snapshot.streak} días consecuentes
      - Balance Energético: ${snapshot.balance}/100
      - Estado sugerido: ${snapshot.state || 'activo'}
    `;

    const instructions = {
      status: "Escribe un pensamiento MUY breve basado en sus datos actuales. Sé poético pero basado en su balance energético.",
      why: `Analiza por qué el usuario tiene un balance de ${snapshot.balance}/100. Relaciónalo con que ha completado ${snapshot.tasksCompleted} de ${snapshot.tasksTotal} tareas y ${snapshot.wellnessCompleted} actividades de bienestar. Sé directo y analítico.`,
      improve: `Basado en que lleva ${snapshot.streak} días de racha y hoy tiene ${snapshot.balance}% de energía, sugiere UNA acción física o mental concreta para subir su balance ahora mismo.`,
      summary: `Actúa como un cronista del tiempo. Resume que hoy se han logrado ${snapshot.tasksCompleted} metas y ${snapshot.routineCompleted} rutinas. Comenta sobre la consistencia de su racha de ${snapshot.streak} días.`,
      open: `El usuario pregunta: "${userQuestion}". Responde usando sus datos reales (Tareas: ${snapshot.tasksCompleted}/${snapshot.tasksTotal}, Balance: ${snapshot.balance}%, Racha: ${snapshot.streak}) para dar una respuesta fundamentada y no genérica.`
    };

    const maxRetries = 3;
    let attempt = 0;

    const executeWithRetry = async (): Promise<string> => {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview", // Updated to the recommended model
          contents: [
            {
              role: "user",
              parts: [{
                text: `Eres ${snapshot.mascotName}, el guardián de tiempo de Kairos. No eres un bot genérico, eres un analista de bienestar que conoce perfectamente al usuario.
                
                ${contextStr}
                
                INSTRUCCIÓN: ${instructions[queryType]}
                
                REGLAS CRÍTICAS:
                - PROHIBIDO usar frases como "Vas bien" o "Sigue así" sin justificar con datos.
                - DEBES mencionar al menos un dato numérico del contexto en tu respuesta.
                - Máximo 2 líneas de texto.
                - Tono humano y sabio.
                - Idioma: Español. Sin emojis.`
              }]
            }
          ],
          config: {
            temperature: 0.8,
            maxOutputTokens: 120,
          }
        });

        const result = response.text?.trim() || "La respuesta está en tu ritmo de hoy.";
        
        // Update cache
        thoughtCache[cacheKey] = { thought: result, timestamp: Date.now() };
        
        return result;
      } catch (error: any) {
        // If it's a 429 error, wait and retry
        const isRateLimit = error?.message?.includes("429") || error?.status === 429 || JSON.stringify(error).includes("429");
        
        if (isRateLimit && attempt < maxRetries) {
          attempt++;
          const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          console.warn(`AI Rate limited. Retrying in ${Math.round(waitTime)}ms (Attempt ${attempt}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return executeWithRetry();
        }
        
        console.error("AI Error after retries:", error);
        return "Mi conexión con la esencia se está ajustando, pero sigue adelante.";
      }
    };

    return executeWithRetry();
  },

  async getChatResponse(
    snapshot: UserSnapshot,
    chatHistory: { sender: 'user' | 'bot'; text: string }[]
  ): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return "Para una guía real, configura tu llave de API. Mientras tanto, sigue buscando el equilibrio con Kairo.";
    }

    const systemPrompt = `Eres Kairo, el asistente IA personal de esta app de productividad. El usuario tiene: ${snapshot.streak} días de racha, ${snapshot.balance}% de esencia/balance, ${snapshot.tasksTotal} tareas (${snapshot.tasksCompleted} completadas), ${snapshot.wellnessTotal} hábitos de bienestar (${snapshot.wellnessCompleted} completados), ${snapshot.routineTotal} rutinas. Responde siempre en español, de forma motivadora, concisa y personalizada. Puedes ayudar con: organización del tiempo, motivación, consejos de productividad, bienestar, y cualquier pregunta general.`;

    // Map history to the format expected by GoogleGenAI generateContent (role: user or model)
    const contents = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        }
      });
      return response.text?.trim() || "He sentido una perturbación en el flujo temporal, ¿podrías repetirme la pregunta?";
    } catch (error) {
      console.error("Error in getChatResponse:", error);
      return "Mi sintonía con la esencia del tiempo ha fallado temporalmente, pero sigo aquí para ayudarte.";
    }
  }
};
