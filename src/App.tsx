import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Heart, 
  BarChart3,
  Plus,
  Minus,
  Bell,
  User,
  Smartphone,
  Droplets,
  Coffee,
  Moon,
  Zap,
  Check,
  Trash2,
  Pill,
  Utensils,
  AlarmClock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Users,
  Search,
  LogOut,
  Sun,
  Smile,
  Settings,
  Wind,
  Edit2,
  ChevronRight,
  BarChart2,
  HelpCircle,
  FileText,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  AreaChart,
  Area,
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Task, AppUsage, LocationTime, RoutineItem, WellnessReminder, CalendarEvent, Alarm, Category } from './types';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from './lib/firebase';
import { SocialService, UserProfile } from './services/socialService';
import { FriendsView } from './components/FriendsView';

// Mock Data
const DEFAULT_TASK_CATEGORIES: Category[] = [
  { id: 'work', name: 'Trabajo', icon: 'briefcase', color: 'indigo' },
  { id: 'study', name: 'Estudio', icon: 'book', color: 'amber' },
  { id: 'personal', name: 'Personal', icon: 'user', color: 'emerald' },
  { id: 'wellness', name: 'Bienestar', icon: 'heart', color: 'rose' },
];

const DEFAULT_EVENT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Trabajo', icon: 'briefcase', color: 'indigo' },
  { id: 'study', name: 'Estudio', icon: 'book', color: 'amber' },
  { id: 'personal', name: 'Personal', icon: 'user', color: 'emerald' },
  { id: 'wellness', name: 'Bienestar', icon: 'heart', color: 'rose' },
];

const DEFAULT_ROUTINE_CATEGORIES: Category[] = [
  { id: 'work', name: 'Trabajo', icon: 'briefcase', color: 'indigo' },
  { id: 'study', name: 'Estudio', icon: 'book', color: 'amber' },
  { id: 'exercise', name: 'Ejercicio', icon: 'zap', color: 'emerald' },
  { id: 'rest', name: 'Descanso', icon: 'coffee', color: 'slate' },
];

const DEFAULT_LOCATION_CATEGORIES: Category[] = [
  { id: 'home', name: 'Hogar', icon: 'home', color: 'indigo' },
  { id: 'work', name: 'Trabajo', icon: 'briefcase', color: 'slate' },
  { id: 'study', name: 'Estudio', icon: 'book', color: 'amber' },
  { id: 'leisure', name: 'Ocio', icon: 'zap', color: 'emerald' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'meal', name: 'Comida', icon: 'utensils', color: 'orange' },
  { id: 'medicine', name: 'Medicina', icon: 'pill', color: 'blue' },
  { id: 'water', name: 'Agua', icon: 'droplets', color: 'cyan' },
  { id: 'rest', name: 'Descanso', icon: 'coffee', color: 'purple' },
  { id: 'other', name: 'Otro', icon: 'bell', color: 'slate' },
];

const MOCK_ALARMS: Alarm[] = [
  { id: '1', title: 'Desayuno', time: '08:00', category: 'meal', enabled: true, days: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'] },
  { id: '2', title: 'Vitamina C', time: '09:30', category: 'medicine', enabled: true, days: ['Todos'] },
  { id: '3', title: 'Almuerzo', time: '13:30', category: 'meal', enabled: true, days: ['Todos'] },
  { id: '4', title: 'Pausa Activa', time: '16:00', category: 'rest', enabled: false, days: ['Lun', 'Mie', 'Vie'] },
  { id: '5', title: 'Cena', time: '20:00', category: 'meal', enabled: true, days: ['Todos'] },
];

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Reunión de Equipo', startTime: '09:00', endTime: '10:00', location: 'Zoom', type: 'work', completed: false },
  { id: '2', title: 'Clase de Diseño', startTime: '11:00', endTime: '13:00', location: 'Aula 402', type: 'study', completed: true },
  { id: '3', title: 'Almuerzo con Amigos', startTime: '14:00', endTime: '15:30', location: 'Restaurante Central', type: 'personal', completed: false },
  { id: '4', title: 'Yoga Flow', startTime: '17:00', endTime: '18:00', location: 'Gimnasio', type: 'wellness', completed: false },
  { id: '5', title: 'Lectura Técnica', startTime: '20:00', endTime: '21:00', type: 'study', completed: false },
];

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Terminar proyecto de React', completed: false, category: 'work' },
  { id: '2', title: 'Estudiar para examen de cálculo', completed: true, category: 'study' },
  { id: '3', title: 'Comprar víveres', completed: false, category: 'personal' },
  { id: '4', title: 'Meditación 10 min', completed: false, category: 'wellness' },
];

const MOCK_STATS = [
  { day: 'Lun', value: 40 },
  { day: 'Mar', value: 65 },
  { day: 'Mié', value: 45 },
  { day: 'Jue', value: 80 },
  { day: 'Vie', value: 55 },
  { day: 'Sáb', value: 90 },
  { day: 'Dom', value: 70 },
];

const MOCK_APP_USAGE: AppUsage[] = [
  { name: 'Instagram', time: 45, icon: '📱' },
  { name: 'WhatsApp', time: 30, icon: '💬' },
  { name: 'YouTube', time: 60, icon: '📺' },
  { name: 'Kairos', time: 15, icon: '✨' },
];

const MOCK_LOCATION: LocationTime[] = [
  { id: '1', name: 'Casa', time: 12, category: 'home' },
  { id: '2', name: 'Universidad', time: 6, category: 'study' },
  { id: '3', name: 'Gimnasio', time: 1.5, category: 'leisure' },
  { id: '4', name: 'Trabajo', time: 4.5, category: 'work' },
];

const MOCK_ROUTINE: RoutineItem[] = [
  { id: '1', time: '07:00', activity: 'Despertar & Agua', type: 'rest', completed: true },
  { id: '2', time: '08:30', activity: 'Sesión de Estudio', type: 'study', completed: true },
  { id: '3', time: '12:00', activity: 'Almuerzo Saludable', type: 'rest', completed: false },
  { id: '4', time: '15:00', activity: 'Gimnasio', type: 'exercise', completed: false },
  { id: '5', time: '18:00', activity: 'Trabajo en Proyecto', type: 'work', completed: false },
];

const MOCK_WELLNESS: WellnessReminder[] = [
  { id: '1', type: 'water', label: 'Beber agua', time: '10:00', completed: true },
  { id: '2', type: 'rest', label: 'Descanso visual', time: '11:30', completed: false },
  { id: '3', type: 'food', label: 'Almuerzo saludable', time: '13:00', completed: false },
  { id: '4', type: 'sleep', label: 'Preparar sueño', time: '22:00', completed: false },
  { id: '5', type: 'medicine', label: 'Vitamina C', time: '09:00', completed: false },
  { id: '6', type: 'water', label: 'Hidratación tarde', time: '16:00', completed: false },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Recordatorio de Agua', message: 'Es hora de beber un vaso de agua.', time: 'Hace 5 min', read: false },
  { id: '2', title: 'Nueva Tarea', message: 'Has añadido "Terminar proyecto" a tu lista.', time: 'Hace 1 hora', read: true },
  { id: '3', title: 'Logro Desbloqueado', message: '¡Has completado todas tus tareas de hoy!', time: 'Hace 2 horas', read: true },
];

import { TimeMascot } from './components/TimeMascot';
import { AIService, UserSnapshot, AIQueryType } from './services/aiService';

const SectionSummary = ({ 
  title, 
  stats, 
  delay = 0 
}: { 
  title: string, 
  stats: { label: string, count: number, color: string, icon: React.ReactNode }[],
  delay?: number
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 shadow-sm space-y-4"
  >
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-deep-teal/20" />
      <h3 className="text-[10px] font-black text-deep-teal/40 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className={`w-full py-3 rounded-2xl ${stat.color} flex flex-col items-center gap-0.5`}>
            <div className="opacity-60 scale-75">{stat.icon}</div>
            <span className="text-sm font-black tracking-tight">{stat.count}</span>
          </div>
          <p className="text-[7px] font-black text-deep-teal/30 uppercase text-center tracking-[0.2em]">{stat.label}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [streak, setStreak] = useState(0);
  const [mascotName, setMascotName] = useState('Kairo');
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

  const [enabledHabitTypes, setEnabledHabitTypes] = useState<WellnessReminder['type'][]>(['water', 'food', 'rest', 'medicine']);
  const [isHabitConfigOpen, setIsHabitConfigOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [wellness, setWellness] = useState<WellnessReminder[]>([]);
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('kairos_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  // Calculate Balance - Derived from real-time state
  const balance = useMemo(() => {
    const taskCompletion = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
    const wellnessCompletion = wellness.length > 0 ? (wellness.filter(w => w.completed).length / wellness.length) * 100 : 0;
    const routineCompletion = routine.length > 0 ? (routine.filter(r => r.completed).length / routine.length) * 100 : 0;
    const eventCompletion = events.length > 0 ? (events.filter(e => e.completed).length / events.length) * 100 : 0;
    
    return Math.round((taskCompletion * 0.3) + (wellnessCompletion * 0.25) + (routineCompletion * 0.25) + (eventCompletion * 0.2));
  }, [tasks, wellness, routine, events]);

  // Firestore Real-time Sync
  useEffect(() => {
    let unsubscribeTasks: () => void;
    let unsubscribeHabits: () => void;
    let unsubscribeProfile: () => void;

    if (isAuthenticated && user) {
      // Initialize profile if it doesn't exist
      SocialService.syncProfile({});

      // Subscribe to Profile
      unsubscribeProfile = SocialService.subscribeToProfile((profile) => {
        if (profile) {
          setStreak(profile.streak || 0);
          setMascotName(profile.mascotName || 'Kairo');
        }
      });

      // Subscribe to Tasks
      unsubscribeTasks = SocialService.subscribeToTasks((syncedTasks) => {
        if (syncedTasks.length > 0) {
          setTasks(syncedTasks as Task[]);
        }
      });

      // Subscribe to Wellness/Routine (Habits)
      unsubscribeHabits = SocialService.subscribeToHabits((syncedHabits) => {
        const wellnessItems = syncedHabits.filter(h => h.category === 'wellness');
        const routineItems = syncedHabits.filter(h => h.category === 'routine');
        
        if (wellnessItems.length > 0) setWellness(wellnessItems as WellnessReminder[]);
        if (routineItems.length > 0) setRoutine(routineItems as RoutineItem[]);
      });
    }

    return () => {
      if (unsubscribeTasks) unsubscribeTasks();
      if (unsubscribeHabits) unsubscribeHabits();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [isAuthenticated, user]);

  // Firebase Auth Lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setIsAuthenticated(true);
        setUserProfile({
          name: u.displayName || 'Usuario de Kairos',
          email: u.email || '',
          photo: u.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.uid
        });
        SocialService.syncProfile({
          name: u.displayName || undefined,
          photoURL: u.photoURL || undefined,
          streak,
          balance,
          mascotName
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Update profile in background when streak or balance changes
  useEffect(() => {
    if (isAuthenticated && user) {
      SocialService.syncProfile({ streak, balance, mascotName });
    }
  }, [streak, balance, mascotName, isAuthenticated, user]);

  // Update time every minute for dynamic background
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month'>('week');

  const MOCK_MONTH_STATS = [
    { day: 'Sem 1', value: 45 },
    { day: 'Sem 2', value: 75 },
    { day: 'Sem 3', value: 60 },
    { day: 'Sem 4', value: 95 },
  ];

  const statsData = statsPeriod === 'week' ? MOCK_STATS : MOCK_MONTH_STATS;

  // Toggle Alarm
  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(alarm => alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm));
  };
  const handleQuickHabitToggle = (type: WellnessReminder['type']) => {
    // Find the first uncompleted habit of this type
    const habit = wellness.find(w => w.type === type && !w.completed);
    
    if (habit) {
      toggleWellness(habit.id);
    } else {
      // If all are completed or none exist, toggle the last completed one to "uncomplete" 
      // or just create a new one? Toggling is better for the prompt's "marcar acciones rápidas".
      const lastHabit = [...wellness].reverse().find(w => w.type === type);
      if (lastHabit) {
        toggleWellness(lastHabit.id);
      } else {
        // Create a new one if none exists
        const newH: WellnessReminder = {
          id: 'temp_' + Math.random().toString(36).substr(2, 9),
          type,
          label: type === 'water' ? 'Beber agua' : type === 'food' ? 'Nutrición' : type === 'medicine' ? 'Medicación' : 'Descanso',
          time: currentTime.getHours() + ':' + currentTime.getMinutes().toString().padStart(2, '0'),
          completed: true
        };
        SocialService.saveHabit({ ...newH, category: 'wellness' });
      }
    }
    setTimeout(refreshAIThought, 500);
  };

  const backgroundStyle = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'from-amber-50 via-orange-50 to-sky-100'; // Morning
    if (hour >= 12 && hour < 17) return 'from-sky-100 via-blue-50 to-white'; // Afternoon
    if (hour >= 17 && hour < 20) return 'from-orange-100 via-rose-100 to-sunset-wine/20'; // Sunset
    return 'from-slate-900 via-sunset-wine/40 to-slate-900'; // Night
  }, [currentTime]);

  const isNight = currentTime.getHours() >= 20 || currentTime.getHours() < 5;

  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('kairos_alarms');
    return saved ? JSON.parse(saved) : MOCK_ALARMS;
  });
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [taskCategories, setTaskCategories] = useState<Category[]>(DEFAULT_TASK_CATEGORIES);
  const [eventCategories, setEventCategories] = useState<Category[]>(DEFAULT_EVENT_CATEGORIES);
  const [routineCategories, setRoutineCategories] = useState<Category[]>(DEFAULT_ROUTINE_CATEGORIES);
  const [locationCategories, setLocationCategories] = useState<Category[]>(DEFAULT_LOCATION_CATEGORIES);
  
  const [locations, setLocations] = useState<LocationTime[]>(MOCK_LOCATION);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Modal States
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isWellnessModalOpen, setIsWellnessModalOpen] = useState(false);
  
  const [isTaskCategoryModalOpen, setIsTaskCategoryModalOpen] = useState(false);
  const [isEventCategoryModalOpen, setIsEventCategoryModalOpen] = useState(false);
  const [isLocationCategoryModalOpen, setIsLocationCategoryModalOpen] = useState(false);
  const [isRoutineCategoryModalOpen, setIsRoutineCategoryModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('kairos_preferences');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      pushNotifications: true,
      alarmSound: 'Zen'
    };
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('kairos_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Lesly Jhoana',
      email: 'leslyjhoanav2@gmail.com',
      photo: 'https://picsum.photos/seed/lesly/200'
    };
  });

  // AI Insights State
  const [aiThought, setAiThought] = useState<string>(() => {
    return localStorage.getItem('kairos_ai_thought') || 'Sintonizando con tu esencia...';
  });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiConsultationOpen, setIsAiConsultationOpen] = useState(false);
  const [consultationResponse, setConsultationResponse] = useState('');
  const [activeQueryType, setActiveQueryType] = useState<AIQueryType | null>(null);
  const [userQuestion, setUserQuestion] = useState('');

  const lastAIRequestTime = React.useRef<number>(0);
  const aiCooldownMs = 8000; // 8 second cooldown for random thoughts

  const refreshAIThought = async (force: boolean = false) => {
    const now = Date.now();
    if (!force && (isAiThinking || now - lastAIRequestTime.current < aiCooldownMs)) return;
    
    setIsAiThinking(true);
    lastAIRequestTime.current = now;
    
    const snapshot: UserSnapshot = {
      tasksCompleted: tasks.filter(t => t.completed).length,
      tasksTotal: tasks.length || 1,
      routineCompleted: routine.filter(r => r.completed).length,
      routineTotal: routine.length || 1,
      wellnessCompleted: wellness.filter(w => w.completed).length,
      wellnessTotal: wellness.length || 1,
      streak,
      balance,
      mascotName,
      state: balance > 70 ? 'constant' : balance < 30 ? 'inactive' : 'active'
    };

    try {
      const thought = await AIService.getMascotThought(snapshot);
      setAiThought(thought);
      localStorage.setItem('kairos_ai_thought', thought);
    } catch (e) {
      console.error("AI Thought error", e);
    } finally {
      setIsAiThinking(false);
    }
  };

  const consultAI = async (type: AIQueryType) => {
    if (isAiThinking) return;
    setIsAiThinking(true);
    setActiveQueryType(type);
    
    // Smooth transition: clear previous response if switching types
    if (type !== activeQueryType) {
      setConsultationResponse('');
    }
    
    const snapshot: UserSnapshot = {
      tasksCompleted: tasks.filter(t => t.completed).length,
      tasksTotal: tasks.length || 1,
      routineCompleted: routine.filter(r => r.completed).length,
      routineTotal: routine.length || 1,
      wellnessCompleted: wellness.filter(w => w.completed).length,
      wellnessTotal: wellness.length || 1,
      streak,
      balance,
      mascotName,
      state: balance > 70 ? 'constant' : balance < 30 ? 'inactive' : 'active'
    };

    try {
      const response = await AIService.getMascotThought(snapshot, type, type === 'open' ? userQuestion : undefined);
      setConsultationResponse(response);
    } catch (error) {
      setConsultationResponse("Hubo un error al sintonizar con Kairo. Inténtalo de nuevo.");
    } finally {
      setIsAiThinking(false);
      lastAIRequestTime.current = Date.now(); // Reset cooldown after manual consultation
      if (type === 'open') setUserQuestion('');
    }
  };

  // Refresh AI thought on load and tab change back to dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      refreshAIThought();
    }
  }, [activeTab]);

  // Auto-hide AI thought after 10 seconds
  useEffect(() => {
    if (aiThought && aiThought !== 'Sintonizando con tu esencia...') {
      const timer = setTimeout(() => {
        setAiThought('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [aiThought]);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('kairos_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('kairos_wellness', JSON.stringify(wellness)); }, [wellness]);
  useEffect(() => { localStorage.setItem('kairos_alarms', JSON.stringify(alarms)); }, [alarms]);
  useEffect(() => { localStorage.setItem('kairos_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('kairos_routine', JSON.stringify(routine)); }, [routine]);
  useEffect(() => { localStorage.setItem('kairos_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('kairos_preferences', JSON.stringify(preferences)); }, [preferences]);

  const [isMascotRenameOpen, setIsMascotRenameOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastCheckIn !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastCheckIn === yesterdayStr) {
        setStreak(prev => prev + 1);
      } else if (lastCheckIn !== null) {
        setStreak(1);
      }
      
      setLastCheckIn(today);
      localStorage.setItem('lastCheckIn', today);
    }
  }, [lastCheckIn]);

  // Form States
  const [newAlarm, setNewAlarm] = useState({ title: '', time: '08:00', category: 'meal' });
  const [newCategory, setNewCategory] = useState({ name: '', color: 'indigo' });
  const [newTask, setNewTask] = useState({ title: '', category: 'work' });
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '09:00', endTime: '10:00', location: '', type: 'work' });
  const [newLocation, setNewLocation] = useState({ name: '', time: 0, category: 'home' });
  const [newRoutine, setNewRoutine] = useState({ time: '07:00', activity: '', type: 'rest' });
  const [newWellness, setNewWellness] = useState({ type: 'water' as const, label: '', time: '10:00' });

  // Generate next 7 days for the horizontal picker
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      SocialService.saveTask({ ...task, completed: !task.completed });
    }
    setTimeout(refreshAIThought, 1000); 
  };

  const toggleWellness = (id: string) => {
    const item = wellness.find(w => w.id === id);
    if (item) {
      SocialService.saveHabit({ ...item, completed: !item.completed, category: 'wellness' });
    }
    setTimeout(refreshAIThought, 1000);
  };

  const toggleRoutine = (id: string) => {
    const item = routine.find(r => r.id === id);
    if (item) {
      SocialService.saveHabit({ ...item, completed: !item.completed, category: 'routine' });
    }
    setTimeout(refreshAIThought, 1000);
  };

  const toggleEvent = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-40">
            {/* Immersive Header Card */}
            <section className="px-6 pt-12">
              <header className="mb-8 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sunset-orange animate-pulse" />
                  <p className="text-[10px] font-black text-sunset-orange uppercase tracking-[0.3em] italic">Resumen</p>
                </div>
                <h2 className="text-4xl font-black text-deep-teal tracking-tight leading-none italic">Mi Centro</h2>
              </header>

              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-sunset-pink rounded-[3.5rem] p-8 text-white relative overflow-hidden h-[240px]"
              >
                {/* Abstract shapes behind */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-12 -translate-x-12 blur-2xl" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-white/80 font-bold text-sm">Hola, {userProfile.name.split(' ')[0]} 👋</p>
                      <h1 className="text-2xl font-black">{currentTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-black/90 px-5 py-2.5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                      >
                        <Zap size={14} className="text-sunset-orange" fill="currentColor" />
                        Demo
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsProfileOpen(true)}
                        className="w-12 h-12 rounded-[1.5rem] border-2 border-white/40 overflow-hidden"
                      >
                        <img src={userProfile.photo} alt="P" className="w-full h-full object-cover" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/20">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 italic">Nivel 22</p>
                          <h2 className="text-xl font-black leading-none">Mi Esencia Kairos</h2>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full border border-white/10">
                            <Zap size={14} className="text-sunset-orange" />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">Activo</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full border border-white/10">
                            <TrendingUp size={14} className="text-white" />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">#{streak}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Bento Grid Content */}
            <section className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Mascot Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[3.5rem] p-4 shadow-xl shadow-black/[0.02] border border-slate-100 flex flex-col justify-between h-[420px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <div className="w-32 h-32 bg-deep-teal rounded-full" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Mascot and Progress Ring */}
                   <div className="relative flex-1 flex items-center justify-center scale-90">
                      <TimeMascot streak={streak} balance={balance} />
                   </div>
                   
                   <div className="bg-deep-teal rounded-[3rem] p-8 text-white flex justify-between items-center">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase italic">Sincronía</p>
                         <h3 className="text-2xl font-black leading-none">{balance}%</h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10"
                      >
                         <ArrowRight size={20} />
                      </motion.button>
                   </div>
                </div>
              </motion.div>

              {/* Stats and Learning cards column */}
              <div className="flex flex-col gap-6">
                {/* Secondary Stat Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-bento-bg rounded-[3.5rem] p-8 shadow-xl shadow-black/[0.02] border border-slate-100 flex flex-col gap-8"
                >
                  <div className="flex justify-between items-start">
                     <h3 className="text-xl font-black text-deep-teal tracking-tighter">Plan de Armonía</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {[
                       { 
                         label: 'Total', 
                         count: tasks.length + routine.length + wellness.length, 
                         color: 'bg-mint/10 text-mint', 
                         icon: <Clock size={16} /> 
                       },
                       { 
                         label: 'Hecho', 
                         count: tasks.filter(t => t.completed).length + routine.filter(r => r.completed).length + wellness.filter(w => w.completed).length, 
                         color: 'bg-sunset-pink/10 text-sunset-pink', 
                         icon: <Check size={16} /> 
                       },
                       { 
                         label: 'Próximo', 
                         count: tasks.filter(t => !t.completed).length + routine.filter(r => !r.completed).length + wellness.filter(w => !w.completed).length, 
                         color: 'bg-sunset-orange/10 text-sunset-orange', 
                         icon: <Zap size={16} /> 
                       }
                     ].map((stat, i) => (
                         <div key={i} className="flex flex-col gap-3">
                            <div className={`w-full py-4 rounded-3xl ${stat.color} flex flex-col items-center gap-1`}>
                               <div className="opacity-70">{stat.icon}</div>
                               <span className="text-lg font-black">{stat.count}</span>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-widest">{stat.label}</p>
                         </div>
                      ))}
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-6 shadow-inner relative">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-sm font-black text-deep-teal tracking-tight">Evolución de Energía</h4>
                       <span className="text-[10px] font-black text-sunset-orange uppercase tracking-widest">{balance}% prom.</span>
                    </div>
                    {/* Simplified Graph Visual */}
                    <div className="h-20 w-full flex items-end gap-2 px-2">
                       {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className={`flex-1 rounded-full ${i === 3 ? 'bg-sunset-pink shadow-[0_0_15px_rgba(255,117,151,0.4)]' : 'bg-slate-200'}`}
                          />
                       ))}
                    </div>
                  </div>
                </motion.div>

                {/* State Interpretation Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-deep-teal rounded-[3.5rem] p-8 text-white relative overflow-hidden"
                >
                   <div className="relative z-10 flex justify-between items-center">
                      <div className="space-y-4 max-w-[70%]">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-mint uppercase tracking-[0.3em]">IA KAIROS</p>
                            <h3 className="text-lg font-black leading-tight italic opacity-90">
                              {balance > 60 ? 'Toda tu esencia hoy fluye como un río tranquilo.' : 'Es tiempo de reconectar y fluir más lento.'}
                            </h3>
                         </div>
                         <motion.button 
                           whileHover={{ x: 5 }}
                           onClick={() => setIsAiConsultationOpen(true)}
                           className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white/50 hover:text-mint transition-colors"
                         >
                           Explorar Más <ArrowRight size={14} />
                         </motion.button>
                      </div>
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center p-3 border border-white/10">
                         <div className="w-full h-full rounded-full border-4 border-mint/40 border-t-mint animate-spin-slow rotate-[45deg]" />
                      </div>
                   </div>
                </motion.div>
              </div>
            </section>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-8 pb-40 px-6 pt-12 overflow-y-auto max-h-[85vh] no-scrollbar">
            <header className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sunset-pink animate-pulse" />
                  <p className="text-[10px] font-black text-sunset-pink uppercase tracking-[0.3em] italic">Proceso</p>
                </div>
                <h2 className="text-4xl font-black text-deep-teal tracking-tight leading-none italic">Metas</h2>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsTaskModalOpen(true)}
                className="w-16 h-16 bg-deep-teal text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-deep-teal/20"
              >
                <Plus size={32} />
              </motion.button>
            </header>

            {/* Harmony Summary for Tasks */}
            <SectionSummary 
              title="Plan de Armonía: Metas"
              stats={[
                { label: 'Total', count: tasks.length, color: 'bg-mint/10 text-mint', icon: <Clock size={14} /> },
                { label: 'Hecho', count: tasks.filter(t => t.completed).length, color: 'bg-sunset-pink/10 text-sunset-pink', icon: <Check size={14} /> },
                { label: 'Próximo', count: tasks.filter(t => !t.completed).length, color: 'bg-sunset-orange/10 text-sunset-orange', icon: <Zap size={14} /> }
              ]}
            />

            {/* Featured Course Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#d5e8e1] rounded-[3.5rem] p-8 relative overflow-hidden group min-h-[220px] flex flex-col justify-between"
            >
               <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110 duration-500">
                  <FileText size={140} className="rotate-12 text-deep-teal" />
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full w-fit border border-white/20">
                     <span className="text-[10px] font-black uppercase tracking-widest text-deep-teal">Objetivo Semanal</span>
                  </div>
                  <h3 className="text-3xl font-black text-deep-teal tracking-tight leading-tight max-w-[200px]">Sincronía de Hábitos</h3>
               </div>
               <div className="flex gap-4 relative z-10 pt-4">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-deep-teal/40 uppercase tracking-widest leading-none">Lecciones</span>
                     <span className="text-xl font-black text-deep-teal">#{tasks.length}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-deep-teal/40 uppercase tracking-widest leading-none">Minutos</span>
                     <span className="text-xl font-black text-deep-teal">120m</span>
                  </div>
               </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => toggleTask(task.id)}
                  className={`bento-card flex items-center justify-between cursor-pointer border border-slate-100 ${task.completed ? 'bg-slate-50 opacity-60' : 'bg-white shadow-xl shadow-black/[0.02]'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center shadow-inner transition-colors ${
                      task.completed ? 'bg-slate-200 text-slate-400' : 'bg-sunset-pink/10 text-sunset-pink'
                    }`}>
                      {task.completed ? <Check size={24} /> : <Zap size={24} />}
                    </div>
                    <div className="space-y-0.5">
                      <span className={`text-lg font-black transition-all leading-tight block ${task.completed ? 'text-slate-400 line-through' : 'text-deep-teal'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-sunset-orange uppercase tracking-widest bg-sunset-orange/5 px-2 py-0.5 rounded-full">{task.category}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); SocialService.deleteTask(task.id); }}
                    className="p-3 text-slate-300 hover:text-sunset-red transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'wellness':
        return (
          <div className="space-y-8 pb-40 px-6 pt-12 overflow-y-auto max-h-[85vh] no-scrollbar">
            <header className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                <p className="text-[10px] font-black text-mint uppercase tracking-[0.3em] italic">Esencia</p>
              </div>
              <h2 className="text-4xl font-black text-deep-teal tracking-tight leading-none italic">Mi Vida</h2>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {wellness.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -4 }}
                  onClick={() => toggleWellness(item.id)}
                  className={`bento-card flex flex-col gap-6 cursor-pointer border border-slate-100 ${
                    item.completed ? 'bg-slate-50 opacity-60' : 'bg-white shadow-xl shadow-black/[0.02]'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center shadow-inner ${
                    item.completed ? 'bg-slate-200 text-white' : 
                    item.type === 'water' ? 'bg-sky-100 text-sky-500' :
                    item.type === 'food' ? 'bg-orange-100 text-orange-500' :
                    item.type === 'medicine' ? 'bg-indigo-100 text-indigo-500' :
                    item.type === 'rest' ? 'bg-purple-100 text-purple-500' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {item.type === 'water' ? <Droplets size={24} /> :
                     item.type === 'food' ? <Utensils size={24} /> :
                     item.type === 'medicine' ? <Pill size={24} /> :
                     item.type === 'rest' || item.type === 'sleep' ? <Moon size={24} /> :
                     <Sparkles size={24} />}
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-base font-black leading-tight ${item.completed ? 'text-slate-400 line-through' : 'text-deep-teal'}`}>
                      {item.label}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-8 pb-32 px-8 pt-12">
            <header className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-sunset-wine tracking-tight">Agenda</h2>
                <p className="text-sunset-wine/40 font-bold">Tu flujo del tiempo.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEventModalOpen(true)}
                className="w-14 h-14 sunset-gradient text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-sunset-orange/30"
              >
                <Plus size={28} />
              </motion.button>
            </header>

            <div className="space-y-6">
              {events.map((event) => (
                <motion.div 
                  key={event.id}
                  className={`glass-card p-0 overflow-hidden bg-white/60 backdrop-blur-xl border-none shadow-lg flex transition-all ${event.completed ? 'opacity-50 grayscale-[0.5]' : ''}`}
                >
                  <div className={`w-2 ${event.completed ? 'bg-slate-300' : 'sunset-gradient'}`} />
                  <div className="p-6 flex-1 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className={`text-xl font-black ${event.completed ? 'text-sunset-wine/40 line-through' : 'text-sunset-wine'}`}>{event.title}</h3>
                      <div className="flex items-center gap-3 text-sunset-wine/60 font-bold text-xs">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-1.5 bg-sunset-orange/10 rounded-full">
                        <span className="text-[10px] font-black text-sunset-orange uppercase tracking-widest">{event.category}</span>
                      </div>
                      <button 
                        onClick={() => toggleEvent(event.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${event.completed ? 'bg-mint text-white' : 'bg-white border-2 border-slate-100 text-transparent hover:border-mint'}`}
                      >
                        <Check size={16} className={event.completed ? 'opacity-100' : 'opacity-0'} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'alarms':
        return (
          <div className="space-y-8 pb-40 px-6 pt-12 overflow-y-auto max-h-[85vh] no-scrollbar">
            <header className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sunset-orange animate-pulse" />
                  <p className="text-[10px] font-black text-sunset-orange uppercase tracking-[0.3em] italic">Ritmo Vital</p>
                </div>
                <h2 className="text-4xl font-black text-deep-teal tracking-tight leading-none italic">Alarmas</h2>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAlarmModalOpen(true)}
                className="w-16 h-16 bg-deep-teal text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-deep-teal/20"
              >
                <Plus size={32} />
              </motion.button>
            </header>

            {/* Harmony Summary for Alarms */}
            <SectionSummary 
              title="Plan de Armonía: Ritmo"
              stats={[
                { label: 'Total', count: routine.length + wellness.length, color: 'bg-mint/10 text-mint', icon: <Clock size={14} /> },
                { label: 'Hecho', count: routine.filter(it => it.completed).length + wellness.filter(it => it.completed).length, color: 'bg-sunset-pink/10 text-sunset-pink', icon: <Check size={14} /> },
                { label: 'Próximo', count: routine.filter(it => !it.completed).length + wellness.filter(it => !it.completed).length, color: 'bg-sunset-orange/10 text-sunset-orange', icon: <Zap size={14} /> }
              ]}
            />

            <div className="space-y-4">
              {alarms.map((alarm) => (
                <motion.div 
                  key={alarm.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[2.5rem] p-6 flex justify-between items-center shadow-xl shadow-black/[0.01] border border-slate-50"
                >
                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white ${
                        alarm.category === 'meal' ? 'bg-orange-400' : 
                        alarm.category === 'medicine' ? 'bg-sky-400' : 'bg-indigo-400'
                      }`}>
                         <AlarmClock size={24} />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-deep-teal tracking-tight">{alarm.time}</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{alarm.title} • {alarm.days.join(', ')}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => toggleAlarm(alarm.id)}
                     className={`w-12 h-6 rounded-full p-1 transition-colors relative ${alarm.enabled ? 'bg-mint' : 'bg-slate-200'}`}
                   >
                      <motion.div 
                        animate={{ x: alarm.enabled ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                   </button>
                </motion.div>
              ))}
              
              {alarms.length === 0 && (
                <div className="bg-slate-50 rounded-[3rem] p-12 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest font-mono">No hay alarmas activas</p>
                </div>
              )}
            </div>

            {/* Quick Habits Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3.5rem] p-8 shadow-xl shadow-black/[0.02] border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                 <div className="space-y-0.5">
                    <h3 className="text-xl font-black text-deep-teal tracking-tighter">Hábitos Rápidos</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Acción Inmediata</p>
                 </div>
                 <motion.button 
                   whileHover={{ rotate: 90 }}
                   onClick={() => setIsHabitConfigOpen(true)}
                   className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-deep-teal transition-colors"
                 >
                   <Settings size={20} />
                 </motion.button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {[
                  { type: 'water' as const, icon: <Droplets size={24} />, color: 'bg-sky-50 text-sky-500', activeColor: 'bg-sky-500 text-white' },
                  { type: 'food' as const, icon: <Utensils size={24} />, color: 'bg-orange-50 text-orange-500', activeColor: 'bg-orange-500 text-white' },
                  { type: 'rest' as const, icon: <Moon size={24} />, color: 'bg-purple-50 text-purple-500', activeColor: 'bg-purple-500 text-white' },
                  { type: 'medicine' as const, icon: <Pill size={24} />, color: 'bg-indigo-50 text-indigo-500', activeColor: 'bg-indigo-500 text-white' },
                ].filter(h => enabledHabitTypes.includes(h.type)).map((habit) => {
                  const isDone = wellness.some(w => w.type === habit.type && w.completed);
                  return (
                    <div key={habit.type} className="flex flex-col items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: [0, -10, 10, 0] }}
                        onClick={() => handleQuickHabitToggle(habit.type)}
                        className={`w-14 h-14 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 shadow-sm relative ${
                          isDone ? habit.activeColor : habit.color + ' border border-transparent'
                        }`}
                      >
                        {habit.icon}
                        {isDone && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-mint rounded-full flex items-center justify-center border-2 border-white"
                          >
                            <Check size={10} className="text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </motion.button>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {habit.type === 'water' ? 'Agua' : habit.type === 'food' ? 'Comida' : habit.type === 'rest' ? 'Relax' : 'Zen'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-8 pb-40 px-6 pt-12 overflow-y-auto max-h-[85vh] no-scrollbar">
            <header className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sunset-orange animate-pulse" />
                <p className="text-[10px] font-black text-sunset-orange uppercase tracking-[0.3em] italic">Análisis</p>
              </div>
              <h2 className="text-4xl font-black text-deep-teal tracking-tight leading-none italic">Logros</h2>
            </header>

            {/* Harmony Summary for stats */}
            <SectionSummary 
              title="Plan de Armonía: Global"
              stats={[
                { label: 'Total', count: tasks.length + routine.length + wellness.length, color: 'bg-mint/10 text-mint', icon: <Clock size={14} /> },
                { label: 'Hecho', count: tasks.filter(it => it.completed).length + routine.filter(it => it.completed).length + wellness.filter(it => it.completed).length, color: 'bg-sunset-pink/10 text-sunset-pink', icon: <Check size={14} /> },
                { label: 'Próximo', count: tasks.filter(it => !it.completed).length + routine.filter(it => !it.completed).length + wellness.filter(it => !it.completed).length, color: 'bg-sunset-orange/10 text-sunset-orange', icon: <Zap size={14} /> }
              ]}
            />

            {/* Performance Overview Bento */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-deep-teal rounded-[3.5rem] p-8 flex flex-col gap-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap size={60} />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Rendimiento</p>
                   <span className="text-4xl font-black tracking-tighter italic">85%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: `${balance}%` }} 
                     className="h-full bg-mint" 
                   />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-sunset-pink rounded-[3.5rem] p-8 flex flex-col gap-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Clock size={60} />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">En Sintonía</p>
                   <span className="text-4xl font-black tracking-tighter italic">{streak}d</span>
                </div>
                <div className="flex items-center gap-1">
                   <TrendingUp size={12} />
                   <span className="text-[9px] font-bold uppercase">Racha Actual</span>
                </div>
              </motion.div>
            </div>

            {/* Main Graph Card with Toggle */}
            <div className="bg-white rounded-[3.5rem] p-8 shadow-xl shadow-black/[0.02] border border-slate-100 space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-deep-teal tracking-tight italic">Ritmo Vital</h3>
                 <div className="bg-slate-50 p-1.5 rounded-full flex gap-1">
                    <button 
                      onClick={() => setStatsPeriod('week')}
                      className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest transition-all ${
                        statsPeriod === 'week' ? 'bg-deep-teal text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Semana
                    </button>
                    <button 
                      onClick={() => setStatsPeriod('month')}
                      className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest transition-all ${
                        statsPeriod === 'month' ? 'bg-deep-teal text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Mes
                    </button>
                 </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={statsPeriod === 'week' ? '#41b8a2' : '#ff7597'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={statsPeriod === 'week' ? '#41b8a2' : '#ff7597'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#1d4d4f', fontWeight: 900, fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={statsPeriod === 'week' ? '#41b8a2' : '#ff7597'} 
                      strokeWidth={5} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      strokeLinecap="round" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ranking Preview Card */}
            <div className="bg-soft-peach rounded-[3.5rem] p-8 flex justify-between items-center">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-soft-peach overflow-hidden bg-white">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="U" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-2xl border-4 border-soft-peach bg-deep-teal flex items-center justify-center text-white text-xs font-black">+12</div>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-[9px] font-black text-deep-teal/40 uppercase tracking-[0.2em] leading-none italic">Alumni</p>
                  <p className="text-sm font-black text-deep-teal">Top 10 Global</p>
               </div>
            </div>
          </div>
        );
      case 'circles':
        return <FriendsView />;
      default:
        return null;
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="relative">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 sunset-gradient rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-sunset-orange/20"
            >
              <Clock size={40} className="text-white" />
            </motion.div>
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-sunset-orange blur-3xl opacity-20 -z-10" 
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-sunset-wine tracking-tighter uppercase">Kairos</h1>
            <p className="text-[10px] font-black text-sunset-wine/30 uppercase tracking-[0.3em]">Sincronizando con tu tiempo</p>
          </div>
          <div className="flex justify-center gap-1.5">
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-sunset-orange" />
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-sunset-orange" />
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-sunset-orange" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-wellness/5 rounded-full blur-3xl" />

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Nueva Tarea</h2>
                <button 
                  onClick={() => setIsTaskCategoryModalOpen(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Título</label>
                  <input type="text" placeholder="Ej: Estudiar React" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto no-scrollbar">
                    {taskCategories.map((cat) => (
                      <button key={cat.id} onClick={() => setNewTask({...newTask, category: cat.id})} className={`p-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${newTask.category === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-100'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsTaskModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newTask.title) return;
                    SocialService.saveTask({ title: newTask.title, completed: false, category: newTask.category });
                    setIsTaskModalOpen(false);
                    setNewTask({ title: '', category: taskCategories[0]?.id || 'work' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Guardar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEventModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Nuevo Evento</h2>
                <button 
                  onClick={() => setIsEventCategoryModalOpen(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Título</label>
                  <input type="text" placeholder="Ej: Reunión" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-sunset-wine/40 uppercase tracking-widest">Inicio</label>
                    <input type="time" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newEvent.startTime} onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-sunset-wine/40 uppercase tracking-widest">Fin</label>
                    <input type="time" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newEvent.endTime} onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ubicación</label>
                  <input type="text" placeholder="Ej: Zoom o Oficina" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto no-scrollbar">
                    {eventCategories.map((cat) => (
                      <button key={cat.id} onClick={() => setNewEvent({...newEvent, type: cat.id})} className={`p-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${newEvent.type === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-100'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsEventModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newEvent.title) return;
                    setEvents([...events, { id: Date.now().toString(), ...newEvent }]);
                    setIsEventModalOpen(false);
                    setNewEvent({ title: '', startTime: '09:00', endTime: '10:00', location: '', type: eventCategories[0]?.id || 'work' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Guardar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLocationModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Nueva Ubicación</h2>
                <button 
                  onClick={() => setIsLocationCategoryModalOpen(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input type="text" placeholder="Ej: Biblioteca" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newLocation.name} onChange={(e) => setNewLocation({...newLocation, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horas estimadas</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newLocation.time} onChange={(e) => setNewLocation({...newLocation, time: Number(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto no-scrollbar">
                    {locationCategories.map((cat) => (
                      <button key={cat.id} onClick={() => setNewLocation({...newLocation, category: cat.id})} className={`p-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${newLocation.category === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-100'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsLocationModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newLocation.name) return;
                    setLocations([...locations, { id: Date.now().toString(), ...newLocation }]);
                    setIsLocationModalOpen(false);
                    setNewLocation({ name: '', time: 0, category: locationCategories[0]?.id || 'home' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Guardar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Routine Modal */}
      <AnimatePresence>
        {isRoutineModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRoutineModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Nueva Rutina</h2>
                <button 
                  onClick={() => setIsRoutineCategoryModalOpen(true)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actividad</label>
                  <input type="text" placeholder="Ej: Meditación" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newRoutine.activity} onChange={(e) => setNewRoutine({...newRoutine, activity: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hora</label>
                  <input type="time" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newRoutine.time} onChange={(e) => setNewRoutine({...newRoutine, time: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto no-scrollbar">
                    {routineCategories.map((cat) => (
                      <button key={cat.id} onClick={() => setNewRoutine({...newRoutine, type: cat.id})} className={`p-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${newRoutine.type === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-100'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsRoutineModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newRoutine.activity) return;
                    SocialService.saveHabit({ ...newRoutine, completed: false, type: 'routine' });
                    setIsRoutineModalOpen(false);
                    setNewRoutine({ time: '07:00', activity: '', type: routineCategories[0]?.id || 'rest' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Guardar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alarm Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Nueva Categoría de Alarma</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input type="text" placeholder="Ej: Ejercicio" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['indigo', 'emerald', 'rose', 'amber', 'cyan', 'purple', 'orange', 'slate'].map((color) => (
                      <button key={color} onClick={() => setNewCategory({...newCategory, color})} className={`w-8 h-8 rounded-full border-2 transition-all ${newCategory.color === color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: color === 'indigo' ? '#4F46E5' : color === 'emerald' ? '#10B981' : color === 'rose' ? '#F43F5E' : color === 'amber' ? '#F59E0B' : color === 'cyan' ? '#06B6D4' : color === 'purple' ? '#8B5CF6' : color === 'orange' ? '#F97316' : '#64748B' }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsCategoryModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newCategory.name) return;
                    setCategories([...categories, { id: Date.now().toString(), name: newCategory.name, icon: 'zap', color: newCategory.color }]);
                    setIsCategoryModalOpen(false);
                    setNewCategory({ name: '', color: 'indigo' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Crear</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Category Modal */}
      <AnimatePresence>
        {isTaskCategoryModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Nueva Categoría de Tarea</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input type="text" placeholder="Ej: Trabajo" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['indigo', 'emerald', 'rose', 'amber', 'cyan', 'purple', 'orange', 'slate'].map((color) => (
                      <button key={color} onClick={() => setNewCategory({...newCategory, color})} className={`w-8 h-8 rounded-full border-2 transition-all ${newCategory.color === color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: color === 'indigo' ? '#4F46E5' : color === 'emerald' ? '#10B981' : color === 'rose' ? '#F43F5E' : color === 'amber' ? '#F59E0B' : color === 'cyan' ? '#06B6D4' : color === 'purple' ? '#8B5CF6' : color === 'orange' ? '#F97316' : '#64748B' }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsTaskCategoryModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newCategory.name) return;
                    setTaskCategories([...taskCategories, { id: Date.now().toString(), name: newCategory.name, icon: 'zap', color: newCategory.color }]);
                    setIsTaskCategoryModalOpen(false);
                    setNewCategory({ name: '', color: 'indigo' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Crear</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Category Modal */}
      <AnimatePresence>
        {isEventCategoryModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEventCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Nueva Categoría de Evento</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input type="text" placeholder="Ej: Reunión" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['indigo', 'emerald', 'rose', 'amber', 'cyan', 'purple', 'orange', 'slate'].map((color) => (
                      <button key={color} onClick={() => setNewCategory({...newCategory, color})} className={`w-8 h-8 rounded-full border-2 transition-all ${newCategory.color === color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: color === 'indigo' ? '#4F46E5' : color === 'emerald' ? '#10B981' : color === 'rose' ? '#F43F5E' : color === 'amber' ? '#F59E0B' : color === 'cyan' ? '#06B6D4' : color === 'purple' ? '#8B5CF6' : color === 'orange' ? '#F97316' : '#64748B' }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsEventCategoryModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newCategory.name) return;
                    setEventCategories([...eventCategories, { id: Date.now().toString(), name: newCategory.name, icon: 'zap', color: newCategory.color }]);
                    setIsEventCategoryModalOpen(false);
                    setNewCategory({ name: '', color: 'indigo' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Crear</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Category Modal */}
      <AnimatePresence>
        {isLocationCategoryModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLocationCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Nueva Categoría de Ubicación</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input type="text" placeholder="Ej: Trabajo" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['indigo', 'emerald', 'rose', 'amber', 'cyan', 'purple', 'orange', 'slate'].map((color) => (
                      <button key={color} onClick={() => setNewCategory({...newCategory, color})} className={`w-8 h-8 rounded-full border-2 transition-all ${newCategory.color === color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: color === 'indigo' ? '#4F46E5' : color === 'emerald' ? '#10B981' : color === 'rose' ? '#F43F5E' : color === 'amber' ? '#F59E0B' : color === 'cyan' ? '#06B6D4' : color === 'purple' ? '#8B5CF6' : color === 'orange' ? '#F97316' : '#64748B' }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsLocationCategoryModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newCategory.name) return;
                    setLocationCategories([...locationCategories, { id: Date.now().toString(), name: newCategory.name, icon: 'zap', color: newCategory.color }]);
                    setIsLocationCategoryModalOpen(false);
                    setNewCategory({ name: '', color: 'indigo' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Crear</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Routine Category Modal */}
      <AnimatePresence>
        {isRoutineCategoryModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRoutineCategoryModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Nueva Categoría de Rutina</h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input type="text" placeholder="Ej: Ejercicio" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {['indigo', 'emerald', 'rose', 'amber', 'cyan', 'purple', 'orange', 'slate'].map((color) => (
                      <button key={color} onClick={() => setNewCategory({...newCategory, color})} className={`w-8 h-8 rounded-full border-2 transition-all ${newCategory.color === color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: color === 'indigo' ? '#4F46E5' : color === 'emerald' ? '#10B981' : color === 'rose' ? '#F43F5E' : color === 'amber' ? '#F59E0B' : color === 'cyan' ? '#06B6D4' : color === 'purple' ? '#8B5CF6' : color === 'orange' ? '#F97316' : '#64748B' }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsRoutineCategoryModalOpen(false)} className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancelar</button>
                  <button onClick={() => {
                    if (!newCategory.name) return;
                    setRoutineCategories([...routineCategories, { id: Date.now().toString(), name: newCategory.name, icon: 'zap', color: newCategory.color }]);
                    setIsRoutineCategoryModalOpen(false);
                    setNewCategory({ name: '', color: 'indigo' });
                  }} className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Crear</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main AI Interaction Button - Refined Glass Style */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAiConsultationOpen(true)}
          className="w-14 h-14 rounded-[1.8rem] bg-white/50 backdrop-blur-xl border border-white/80 text-sunset-wine shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-center group relative"
        >
          <Sparkles size={26} className="opacity-70 transition-transform group-hover:rotate-12 group-hover:opacity-100" />
          
          {/* Subtle slow pulse animation */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0, 0.15],
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 bg-sunset-orange rounded-[1.8rem] -z-10"
          />
          
          <div className="absolute right-full mr-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/50 shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-2 group-hover:translate-x-0">
            <span className="text-[9px] font-black text-sunset-wine uppercase tracking-[0.2em]">Consultar IA</span>
          </div>
        </motion.button>
      </div>

      {/* Notifications Modal */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold">Notificaciones</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const updated = notifications.map(n => ({ ...n, read: true }));
                      setNotifications(updated);
                    }}
                    className="text-xs font-bold text-primary uppercase tracking-wider hover:text-primary/80 transition-colors"
                  >
                    Leer todas
                  </button>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs font-bold text-rose-500 uppercase tracking-wider hover:text-rose-600 transition-colors"
                  >
                    Borrar
                  </button>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b border-slate-50 flex gap-3 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-800">{n.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase">{n.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">No tienes notificaciones</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="w-full p-4 text-center text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="bg-sunset-pink p-12 text-white flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl relative overflow-hidden">
                    <img 
                      src={userProfile.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-[2rem]"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer shadow-xl border-4 border-sunset-pink hover:scale-110 transition-transform">
                    <Edit2 size={16} className="text-white" />
                    <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                  </label>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tight">{userProfile.name}</h2>
                  <p className="text-white/60 font-medium">{userProfile.email}</p>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-6 rounded-[2rem] flex flex-col items-center gap-2">
                      <Zap size={24} className="text-sunset-orange" fill="currentColor" />
                      <div className="text-center">
                         <p className="text-xl font-black text-slate-800">{streak}</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Racha</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-[2rem] flex flex-col items-center gap-2">
                      <Clock size={24} className="text-deep-teal" fill="currentColor" />
                      <div className="text-center">
                         <p className="text-xl font-black text-slate-800">{balance}%</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Esencia</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-colors">Configuración</button>
                  <button 
                    onClick={() => signOut(auth)}
                    className="w-full bg-slate-100 text-slate-400 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 transition-colors"
                   >
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-white/50 hover:bg-black/20"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {isPreferencesOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreferencesOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Preferencias</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Modo Oscuro</p>
                      <p className="text-xs text-slate-400">{preferences.darkMode ? 'Activado' : 'Desactivado'}</p>
                    </div>
                    <button 
                      onClick={() => setPreferences({...preferences, darkMode: !preferences.darkMode})}
                      className={`w-12 h-6 rounded-full relative transition-colors ${preferences.darkMode ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: preferences.darkMode ? 24 : 2 }}
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Notificaciones Push</p>
                      <p className="text-xs text-slate-400">{preferences.pushNotifications ? 'Activado' : 'Desactivado'}</p>
                    </div>
                    <button 
                      onClick={() => setPreferences({...preferences, pushNotifications: !preferences.pushNotifications})}
                      className={`w-12 h-6 rounded-full relative transition-colors ${preferences.pushNotifications ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: preferences.pushNotifications ? 24 : 2 }}
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Sonido de Alarma</p>
                      <p className="text-xs text-slate-400">{preferences.alarmSound}</p>
                    </div>
                    <select 
                      value={preferences.alarmSound}
                      onChange={(e) => setPreferences({...preferences, alarmSound: e.target.value})}
                      className="text-xs font-bold text-primary bg-transparent focus:outline-none"
                    >
                      <option value="Zen">Zen</option>
                      <option value="Energía">Energía</option>
                      <option value="Suave">Suave</option>
                      <option value="Clásico">Clásico</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPreferencesOpen(false)}
                  className="w-full p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 sunset-gradient" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 sunset-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-sunset-orange/20">
                  <Clock size={32} className="text-white" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-sunset-wine tracking-tight uppercase">Kairos</h2>
                  <p className="text-xs font-black text-sunset-orange tracking-[0.2em] uppercase">Tiempo con sentido</p>
                </div>
                
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p className="text-sm font-medium">
                    Kairos no es solo una agenda, es una filosofía de vida. En la antigua Grecia, "Kairos" representaba el tiempo oportuno, el momento perfecto donde las cosas suceden.
                  </p>
                  <p className="text-sm">
                    Nuestra misión es ayudarte a encontrar ese equilibrio entre productividad y bienestar. Con la ayuda de tu guardián del tiempo y nuestra IA, buscamos que cada minuto cuente no por su cantidad, sino por su propósito.
                  </p>
                  <div className="pt-4 border-t border-slate-100 w-full">
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Creado para ti por</p>
                    <p className="text-sm font-black text-sunset-wine">Equipo Kairos</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsAboutOpen(false)}
                  className="w-full py-4 sunset-gradient text-white font-bold rounded-2xl shadow-xl shadow-sunset-orange/20 transition-transform active:scale-95"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Consultation Modal */}
      <AnimatePresence>
        {isAiConsultationOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAiConsultationOpen(false);
                setConsultationResponse('');
                setActiveQueryType(null);
              }}
              className="absolute inset-0 bg-sunset-wine/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-sm glass-card pt-16 pb-10 px-8 bg-white shadow-2xl border-none space-y-8 rounded-[4rem] overflow-visible"
            >
              {/* Mascot Bubble - Floating prominently at top */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 sunset-gradient p-1.5 rounded-[3.5rem] shadow-2xl shadow-sunset-orange/20"
                >
                  <div className="w-full h-full bg-white rounded-[3.2rem] flex items-center justify-center overflow-hidden">
                    <div className="scale-[0.55]">
                      <TimeMascot streak={streak} balance={balance} />
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="text-center space-y-1 pt-4">
                <h3 className="text-2xl font-black text-sunset-wine tracking-tight">
                  Consulta {mascotName}
                </h3>
                <p className="text-[10px] font-black text-sunset-wine/20 uppercase tracking-[0.2em]">Sintonizando con tu tiempo</p>
              </div>

              <div className="bg-rose-50/50 rounded-[3rem] p-8 min-h-[160px] flex items-center justify-center text-center relative overflow-hidden transition-all duration-500">
                {/* Decorative background element for the response box */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sunset-orange/5 rounded-full blur-3xl" />
                <AnimatePresence mode="wait">
                  {isAiThinking ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="flex gap-2">
                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-sunset-orange" />
                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-sunset-orange" />
                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-sunset-orange" />
                      </div>
                      <p className="text-[10px] font-black text-sunset-wine/30 uppercase tracking-[0.2em]">Analizando tu día...</p>
                    </motion.div>
                  ) : consultationResponse ? (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10"
                    >
                      <p className="text-[13px] font-black italic text-sunset-wine/70 leading-[1.6] tracking-tight">
                        "{consultationResponse}"
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative z-10 w-full"
                    >
                      {activeQueryType === 'open' ? (
                        <div className="space-y-4">
                          <input 
                            type="text"
                            placeholder="Pregúntame lo que quieras..."
                            className="w-full bg-white border-2 border-rose-100 p-5 rounded-[2rem] text-sm font-black text-sunset-wine placeholder:text-sunset-wine/10 focus:ring-4 focus:ring-sunset-orange/5 focus:border-sunset-orange/20 transition-all outline-none"
                            value={userQuestion}
                            onChange={(e) => setUserQuestion(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && consultAI('open')}
                            autoFocus
                          />
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => consultAI('open')}
                            className="w-full sunset-gradient text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-[1.5rem] shadow-xl shadow-sunset-orange/20"
                          >
                            Consultar Ahora
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <Users size={24} className="text-sunset-wine/5 mb-2" />
                          <p className="text-[10px] font-black text-sunset-wine/20 uppercase tracking-[0.3em] max-w-[150px]">
                            Selecciona un enfoque arriba
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => consultAI('why')}
                    className={`py-5 rounded-[2.2rem] flex flex-col items-center gap-2 transition-all group ${
                      activeQueryType === 'why' 
                        ? 'sunset-gradient text-white shadow-xl shadow-sunset-orange/20' 
                        : 'bg-rose-50 text-sunset-wine hover:bg-rose-100'
                    }`}
                  >
                    <HelpCircle size={16} className={activeQueryType === 'why' ? 'text-white' : 'text-sunset-orange'} />
                    <span className="text-[9px] font-black uppercase tracking-widest">¿Por qué?</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveQueryType('open')}
                    className={`py-5 rounded-[2.2rem] flex flex-col items-center gap-2 transition-all group ${
                      activeQueryType === 'open' 
                        ? 'sunset-gradient text-white shadow-xl shadow-sunset-orange/20' 
                        : 'bg-rose-50 text-sunset-wine hover:bg-rose-100'
                    }`}
                  >
                    <Search size={16} className={activeQueryType === 'open' ? 'text-white' : 'text-sunset-orange'} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Preguntar</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'improve', label: 'Mejorar', icon: <TrendingUp size={16} /> },
                    { id: 'summary', label: 'Resumen', icon: <FileText size={16} /> }
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => consultAI(option.id as any)}
                      className={`flex flex-col items-center gap-2 py-5 rounded-[2.2rem] transition-all group ${
                        activeQueryType === option.id 
                          ? 'sunset-gradient text-white shadow-xl' 
                          : 'bg-rose-50 text-sunset-wine hover:bg-rose-100'
                      }`}
                    >
                      <div className={activeQueryType === option.id ? 'text-white' : 'text-sunset-orange'}>
                        {option.icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsAiConsultationOpen(false);
                  setConsultationResponse('');
                  setActiveQueryType(null);
                }}
                className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-sunset-wine/20 py-2 hover:text-sunset-wine/40 transition-colors"
              >
                Cerrar Volver
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Habit Config Modal */}
      <AnimatePresence>
        {isHabitConfigOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHabitConfigOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-deep-teal tracking-tighter">Configurar Hábitos</h2>
                <button onClick={() => setIsHabitConfigOpen(false)} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { type: 'water' as const, label: 'Agua', icon: <Droplets size={20} /> },
                  { type: 'food' as const, label: 'Comida', icon: <Utensils size={20} /> },
                  { type: 'rest' as const, label: 'Relax', icon: <Moon size={20} /> },
                  { type: 'medicine' as const, label: 'Zen', icon: <Pill size={20} /> },
                ].map((habit) => {
                  const isActive = enabledHabitTypes.includes(habit.type);
                  return (
                    <button
                      key={habit.type}
                      onClick={() => {
                        if (isActive) {
                          setEnabledHabitTypes(enabledHabitTypes.filter(t => t !== habit.type));
                        } else {
                          setEnabledHabitTypes([...enabledHabitTypes, habit.type]);
                        }
                      }}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                        isActive 
                          ? 'bg-deep-teal/5 border-deep-teal text-deep-teal' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={isActive ? 'text-deep-teal' : 'text-slate-300'}>
                          {habit.icon}
                        </div>
                        <span className="font-black uppercase text-[10px] tracking-widest">{habit.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isActive ? 'bg-deep-teal text-white' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {isActive ? <Check size={14} strokeWidth={4} /> : <Plus size={14} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setIsHabitConfigOpen(false)}
                className="w-full mt-8 p-4 bg-deep-teal text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-deep-teal/20"
              >
                Hecho
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Wellness Modal */}
      <AnimatePresence>
        {isWellnessModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWellnessModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Nuevo Recordatorio</h2>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actividad</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Beber 2 vasos de agua"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-wellness/20 transition-all"
                    value={newWellness.label}
                    onChange={(e) => setNewWellness({...newWellness, label: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'water', label: 'Agua', icon: <Droplets size={18} /> },
                      { id: 'food', label: 'Comida', icon: <Coffee size={18} /> },
                      { id: 'sleep', label: 'Sueño', icon: <Moon size={18} /> },
                      { id: 'rest', label: 'Descanso', icon: <Heart size={18} /> }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setNewWellness({...newWellness, type: t.id as any})}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                          newWellness.type === t.id 
                            ? 'bg-wellness text-white border-wellness shadow-md' 
                            : 'bg-white text-slate-500 border-slate-100'
                        }`}
                      >
                        {t.icon}
                        <span className="text-xs font-bold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hora</label>
                  <input 
                    type="time" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-wellness/20 transition-all"
                    value={newWellness.time}
                    onChange={(e) => setNewWellness({...newWellness, time: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsWellnessModalOpen(false)}
                    className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      if (!newWellness.label) return;
                      SocialService.saveHabit({ ...newWellness, completed: false, type: 'wellness' });
                      setIsWellnessModalOpen(false);
                      setNewWellness({ type: 'water', label: '', time: '10:00' });
                    }}
                    className="flex-1 p-4 bg-wellness text-white font-bold rounded-2xl shadow-lg shadow-wellness/20"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alarm Modal */}
      <AnimatePresence>
        {isAlarmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAlarmModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Nueva Alarma</h2>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Tomar Vitamina"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newAlarm.title}
                    onChange={(e) => setNewAlarm({...newAlarm, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hora</label>
                  <input 
                    type="time" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newAlarm.time}
                    onChange={(e) => setNewAlarm({...newAlarm, time: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</label>
                    <button 
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-xs font-bold text-primary flex items-center gap-1"
                    >
                      <Plus size={12} /> Añadir
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto no-scrollbar p-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewAlarm({...newAlarm, category: cat.id})}
                        className={`p-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${
                          newAlarm.category === cat.id 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-white text-slate-400 border-slate-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAlarmModalOpen(false)}
                    className="flex-1 p-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      if (!newAlarm.title) return;
                      const alarm: Alarm = {
                        id: Date.now().toString(),
                        title: newAlarm.title,
                        time: newAlarm.time,
                        category: newAlarm.category,
                        enabled: true,
                        days: ['Todos']
                      };
                      setAlarms([...alarms, alarm]);
                      setIsAlarmModalOpen(false);
                      setNewAlarm({ title: '', time: '08:00', category: 'meal' });
                    }}
                    className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Integrated Bottom Navigation - Dynamic and Organic */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
        <nav className="bg-deep-teal/90 backdrop-blur-2xl p-2.5 rounded-[3.5rem] flex items-center justify-around gap-1 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden">
          {/* Subtle glow behind the whole nav */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-mint/5 blur-3xl pointer-events-none" />
          
          {[
            { id: 'tasks', icon: <CheckSquare size={22} />, label: 'Metas' },
            { id: 'dashboard', icon: <LayoutDashboard size={22} />, label: 'Centro' },
            { id: 'alarms', icon: <AlarmClock size={22} />, label: 'Alarmas' },
            { id: 'stats', icon: <BarChart2 size={22} />, label: 'Logros' },
            { id: 'circles', icon: <Users size={22} />, label: 'Social' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                layout
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center justify-center gap-2 h-14 rounded-full transition-all duration-500 overflow-hidden ${
                  isActive 
                    ? 'bg-white text-deep-teal px-6 flex-grow shadow-lg z-10' 
                    : 'text-white/30 hover:text-white/60 px-4'
                }`}
              >
                <div className="relative z-10">
                  {item.icon}
                </div>
                
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      className="text-[11px] font-black uppercase tracking-widest leading-none mt-0.5 whitespace-nowrap relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Internal active swell effect */}
                {isActive && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-white"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err: any) {
      console.error("Login Error", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('El inicio de sesión fue cancelado.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana de inicio de sesión.');
      } else {
        setError('Error al conectar con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sunset-orange/10 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-mint/10 blur-[100px] rounded-full"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[4rem] p-12 shadow-[0_32px_64px_rgba(0,0,0,0.08)] relative z-10 text-center flex flex-col items-center gap-12 border border-white/40"
      >
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="w-24 h-24 sunset-gradient rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2rem shadow-sunset-orange/30 relative overflow-hidden"
          >
            <Clock size={48} className="text-white relative z-10" />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-white/20 blur-xl"
            />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-deep-teal italic">Kairos</h1>
            <p className="text-deep-teal/40 font-bold text-lg tracking-tight">Tiempo con sentido.</p>
          </div>
        </div>

        <div className="w-full space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-2xl"
            >
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-6 bg-white shadow-xl shadow-black/[0.03] rounded-[2.5rem] flex items-center justify-center gap-4 group transition-all border border-slate-100 disabled:opacity-50"
          >
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="text-base font-black text-deep-teal uppercase tracking-widest">
              {loading ? 'Sincronizando...' : 'Entrar con Google'}
            </span>
            <ArrowRight size={20} className="text-deep-teal/20 group-hover:text-deep-teal group-hover:translate-x-1 transition-all" />
          </motion.button>
        </div>

        <div className="pt-6 border-t border-deep-teal/5 w-full">
          <p className="text-[10px] text-deep-teal/20 font-black uppercase tracking-[0.4em]">Experiencia Vital</p>
        </div>
      </motion.div>
    </div>
  );
}
