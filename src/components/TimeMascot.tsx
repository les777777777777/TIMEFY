import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeMascotProps {
  streak: number;
  balance: number; // 0 to 100
}

export const TimeMascot: React.FC<TimeMascotProps> = ({ streak, balance }) => {
  // Evolution stages
  const getStage = (s: number) => {
    if (s >= 16) return 4;
    if (s >= 8) return 3;
    if (s >= 4) return 2;
    return 1;
  };

  const stage = getStage(streak);

  // Visual properties based on stage and balance
  const size = 100 + (stage * 30) + (balance / 5);
  const opacity = 0.4 + (balance / 200);
  const glow = balance > 70 ? '0 0 40px rgba(249, 115, 22, 0.6)' : '0 0 20px rgba(249, 115, 22, 0.2)';

  // Messages based on state
  const getMessages = () => {
    if (balance < 30) return [
      "Me siento un poco débil... ¿descansamos?",
      "Necesito un respiro, tú también.",
      "El equilibrio es la clave, vamos a recuperarlo."
    ];
    if (balance > 80) return [
      "¡Qué energía! Estamos en total equilibrio.",
      "Me encanta cómo brillas hoy.",
      "Siento una armonía perfecta en nuestro tiempo."
    ];
    if (streak > 15) return [
      "Nuestra conexión es inquebrantable.",
      "He evolucionado gracias a tu constancia.",
      "Somos uno con el tiempo ahora."
    ];
    return [
      "Estoy creciendo contigo.",
      "Cada minuto cuenta para nuestra evolución.",
      "Sigue así, me siento vivo."
    ];
  };

  const messages = getMessages();
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="relative flex flex-col items-center justify-center py-12 overflow-hidden">
      {/* Background Glow - Dynamic based on balance */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: balance > 70 ? [0.15, 0.25, 0.15] : [0.05, 0.1, 0.05],
          backgroundColor: balance > 70 ? ['#f97316', '#ec4899', '#f97316'] : ['#94a3b8', '#cbd5e1', '#94a3b8']
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-72 h-72 rounded-full blur-[100px]"
      />

      {/* Mascot Container */}
      <motion.div
        className="relative cursor-pointer z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            {/* Organic SVG Mascot */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              <defs>
                <linearGradient id="mascotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={opacity} />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity={opacity * 0.9} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={opacity * 0.7} />
                </linearGradient>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                </filter>
              </defs>

              <g filter="url(#goo)">
                {/* Core Blob with Pulse */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={35 + (stage * 6)}
                  fill="url(#mascotGradient)"
                  animate={{
                    r: [35 + (stage * 6), 42 + (stage * 6), 35 + (stage * 6)],
                    scaleX: [1, 1.05, 0.95, 1],
                    scaleY: [1, 0.95, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Evolution Blobs */}
                {stage >= 2 && (
                  <motion.circle
                    cx="145" cy="75" r="22"
                    fill="url(#mascotGradient)"
                    animate={{ cx: [145, 155, 145], cy: [75, 65, 75] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {stage >= 2 && (
                  <motion.circle
                    cx="55" cy="125" r="18"
                    fill="url(#mascotGradient)"
                    animate={{ cx: [55, 45, 55], cy: [125, 135, 125] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                )}
                {stage >= 3 && (
                  <motion.circle
                    cx="100" cy="35" r="20"
                    fill="url(#mascotGradient)"
                    animate={{ cy: [35, 25, 35], scale: [1, 1.15, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {stage >= 3 && (
                  <motion.circle
                    cx="155" cy="135" r="14"
                    fill="url(#mascotGradient)"
                    animate={{ cx: [155, 165, 155], scale: [1, 1.25, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                )}
                {stage >= 4 && (
                  <motion.circle
                    cx="45" cy="55" r="12"
                    fill="url(#mascotGradient)"
                    animate={{ cx: [45, 35, 45], cy: [55, 45, 55] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                )}
                {stage >= 4 && (
                  <motion.circle
                    cx="135" cy="165" r="16"
                    fill="url(#mascotGradient)"
                    animate={{ cy: [165, 175, 165], scale: [1, 1.4, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  />
                )}
              </g>

              {/* Character Face */}
              <g className="pointer-events-none">
                {/* Eyes */}
                <motion.g
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Left Eye */}
                  <motion.circle
                    cx="85" cy="95" r="4"
                    fill="white"
                    animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                  />
                  {/* Right Eye */}
                  <motion.circle
                    cx="115" cy="95" r="4"
                    fill="white"
                    animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                  />
                </motion.g>

                {/* Mouth */}
                <motion.path
                  d={balance > 50 ? "M90 110 Q100 120 110 110" : "M90 115 Q100 110 110 115"}
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  animate={{
                    d: balance > 50 
                      ? ["M90 110 Q100 120 110 110", "M90 112 Q100 122 110 112", "M90 110 Q100 120 110 110"]
                      : ["M90 115 Q100 110 110 115", "M90 117 Q100 112 110 117", "M90 115 Q100 110 110 115"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Blush (when happy) */}
                {balance > 70 && (
                  <>
                    <circle cx="75" cy="105" r="5" fill="#f472b6" opacity="0.4" />
                    <circle cx="125" cy="105" r="5" fill="#f472b6" opacity="0.4" />
                  </>
                )}
              </g>

              {/* Web/Network Connections */}
              <g stroke="white" strokeWidth="0.5" strokeOpacity="0.2" fill="none">
                {stage >= 2 && (
                  <motion.path
                    d="M100 100 Q120 90 145 75"
                    animate={{ d: ["M100 100 Q120 90 145 75", "M100 100 Q130 80 155 65", "M100 100 Q120 90 145 75"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                )}
                {stage >= 2 && (
                  <motion.path
                    d="M100 100 Q80 110 55 125"
                    animate={{ d: ["M100 100 Q80 110 55 125", "M100 100 Q70 130 45 135", "M100 100 Q80 110 55 125"] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  />
                )}
                {stage >= 3 && (
                  <motion.path
                    d="M145 75 Q120 55 100 35"
                    animate={{ strokeOpacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
                {stage >= 4 && (
                  <>
                    <motion.path
                      d="M100 35 Q70 45 45 55"
                      animate={{ strokeOpacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                    <motion.path
                      d="M155 135 Q145 150 135 165"
                      animate={{ strokeOpacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.path
                      d="M55 125 Q95 145 135 165"
                      animate={{ strokeOpacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                  </>
                )}
              </g>

              {/* High Energy Particles */}
              {stage >= 4 && balance > 60 && (
                <g>
                  {[...Array(6)].map((_, i) => (
                    <motion.circle
                      key={i}
                      r="1.5"
                      fill="white"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        cx: [100, 100 + Math.cos(i * 60) * 80],
                        cy: [100, 100 + Math.sin(i * 60) * 80],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </g>
              )}
            </svg>

            {/* Glassmorphic Core Highlight */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-1/3 h-1/3 rounded-full border border-white/30 bg-white/10 backdrop-blur-[2px]"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Message Bubble with Glassmorphism */}
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="mt-8 px-8 py-4 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] max-w-[280px] text-center"
      >
        <p className="text-sm font-bold text-slate-800 leading-relaxed">
          {messages[messageIndex]}
        </p>
      </motion.div>

      {/* Streak Indicator Refined */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {[...Array(Math.min(streak, 7))].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`w-2.5 h-2.5 rounded-full ${i < streak ? 'bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-200'}`}
            />
          ))}
          {streak > 7 && (
            <span className="text-[10px] font-black text-primary ml-1 self-center">+{streak - 7}</span>
          )}
        </div>
        <div className="px-3 py-1 bg-slate-100 rounded-full">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Racha de {streak} días</span>
        </div>
      </div>
    </div>
  );
};
