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
  TrendingUp
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
import { AIService, UserSnapshot, AIQueryType } from './services/aiService';

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
  { id: '5', type: 'water', label: 'Hidratación tarde', time: '16:00', completed: false },
  { id: '6', type: 'rest', label: 'Estiramiento activo', time: '15:00', completed: false },
  { id: '7', type: 'food', label: 'Snack de frutos secos', time: '17:30', completed: false },
  { id: '8', type: 'rest', label: 'Meditación breve', time: '09:00', completed: false },
  { id: '9', type: 'water', label: 'Agua pre-cena', time: '19:30', completed: false },
  { id: '10', type: 'sleep', label: 'Sin pantallas', time: '21:30', completed: false },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Recordatorio de Agua', message: 'Es hora de beber un vaso de agua.', time: 'Hace 5 min', read: false },
  { id: '2', title: 'Nueva Tarea', message: 'Has añadido "Terminar proyecto" a tu lista.', time: 'Hace 1 hora', read: true },
  { id: '3', title: 'Logro Desbloqueado', message: '¡Has completado todas tus tareas de hoy!', time: 'Hace 2 horas', read: true },
];

import { TimeMascot } from './components/TimeMascot';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [streak, setStreak] = useState(5);
  const [mascotName, setMascotName] = useState(localStorage.getItem('mascotName') || 'Kairo');
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(localStorage.getItem('lastCheckIn'));

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

    if (isAuthenticated && user) {
      // Subscribe to Tasks
      unsubscribeTasks = SocialService.subscribeToTasks((syncedTasks) => {
        if (syncedTasks.length > 0) {
          setTasks(syncedTasks as Task[]);
        } else {
          // If Firestore is empty, seed with mock but save to cloud
          MOCK_TASKS.forEach(t => SocialService.saveTask(t));
        }
      });

      // Subscribe to Wellness/Routine (Habits)
      unsubscribeHabits = SocialService.subscribeToHabits((syncedHabits) => {
        const wellnessItems = syncedHabits.filter(h => h.type === 'wellness');
        const routineItems = syncedHabits.filter(h => h.type === 'routine');
        
        if (wellnessItems.length > 0) setWellness(wellnessItems as WellnessReminder[]);
        else MOCK_WELLNESS.forEach(w => SocialService.saveHabit({...w, type: 'wellness'}));

        if (routineItems.length > 0) setRoutine(routineItems as RoutineItem[]);
        else MOCK_ROUTINE.forEach(r => SocialService.saveHabit({...r, type: 'routine'}));
      });
    }

    return () => {
      if (unsubscribeTasks) unsubscribeTasks();
      if (unsubscribeHabits) unsubscribeHabits();
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

  // Dynamic Background based on time
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

  const refreshAIThought = async () => {
    if (isAiThinking) return;
    setIsAiThinking(true);
    
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

    const thought = await AIService.getMascotThought(snapshot);
    setAiThought(thought);
    localStorage.setItem('kairos_ai_thought', thought);
    setIsAiThinking(false);
  };

  const consultAI = async (type: AIQueryType) => {
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
      SocialService.saveHabit({ ...item, completed: !item.completed, type: 'wellness' });
    }
    setTimeout(refreshAIThought, 1000);
  };

  const toggleRoutine = (id: string) => {
    const item = routine.find(r => r.id === id);
    if (item) {
      SocialService.saveHabit({ ...item, completed: !item.completed, type: 'routine' });
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
          <div className="space-y-8 pb-32">
            <header className="flex justify-between items-center px-8 pt-12">
              <div className="space-y-1">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 sunset-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-sunset-orange/20">
                    <Clock size={20} className="text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-sunset-wine uppercase">Kairos</span>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-5xl font-black tracking-tight ${isNight ? 'text-white' : 'text-sunset-wine'}`}
                >
                  Hola, <span className="text-sunset-orange">{userProfile.name.split(' ')[0]}</span>
                </motion.h1>
                <p className={`${isNight ? 'text-slate-300' : 'text-sunset-wine/60'} font-bold text-lg`}>Tu tiempo, tu esencia.</p>
              </div>
              <div className="flex gap-4 items-center">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotificationsOpen(true)}
                  className="p-4 rounded-[2rem] bg-white/40 backdrop-blur-3xl border border-white/40 shadow-xl relative"
                >
                  <Bell size={24} className="text-sunset-wine" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-3 right-3 w-3.5 h-3.5 bg-mint border-2 border-white rounded-full mint-glow" />
                  )}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsProfileOpen(true)}
                  className="w-14 h-14 rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl"
                >
                  <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.button>
              </div>
            </header>

            {/* Time Mascot - The Living Energy of Time */}
            <section className="px-8">
              <div className="flex justify-center mb-2">
                <button 
                  onClick={() => setIsMascotRenameOpen(true)}
                  className="px-4 py-1 bg-white/40 backdrop-blur-xl border border-white/40 rounded-full text-[10px] font-black text-sunset-wine/60 uppercase tracking-widest hover:bg-white/60 transition-all"
                >
                  {mascotName}
                </button>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card overflow-hidden relative border-none bg-gradient-to-b from-white/60 to-white/20 p-0"
              >
                <div className="absolute top-10 left-10 z-20 flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-xl px-4 py-2 rounded-full w-fit border border-white/40 shadow-sm">
                    <Zap size={16} className="text-sunset-orange" fill="currentColor" />
                    <span className="text-[10px] font-black text-sunset-wine uppercase tracking-[0.2em]">{streak} Días de Racha</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="h-2.5 w-40 bg-white/40 rounded-full overflow-hidden border border-white/20">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${balance}%` }}
                        className="h-full sunset-gradient"
                      />
                    </div>
                    <span className="text-xs font-black text-sunset-wine/40 uppercase tracking-widest">{balance}% Armonía</span>
                  </div>
                </div>
                
                <div 
                  className="cursor-pointer group relative"
                  onClick={() => setIsAiConsultationOpen(true)}
                >
                  <TimeMascot streak={streak} balance={balance} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 text-[9px] font-black uppercase tracking-widest text-sunset-wine shadow-xl">
                      Consultar
                    </div>
                  </div>
                </div>
                
                {/* AI Thought Bubble - Subtle & Meaningful */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={aiThought}
                  className="absolute bottom-10 left-10 right-10 flex flex-col items-center z-30 pointer-events-none"
                >
                  <div className="bg-white/80 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/60 shadow-xl shadow-sunset-orange/5 max-w-[80%] text-center">
                    <p className="text-[11px] font-black italic text-sunset-wine/60 leading-snug tracking-tight">
                      {isAiThinking ? '...' : `"${aiThought}"`}
                    </p>
                  </div>
                </motion.div>
                
                {/* Debug controls for the user to see evolution */}
                <div className="absolute bottom-8 right-10 flex gap-4 opacity-0 hover:opacity-100 transition-opacity z-30">
                  <button 
                    onClick={() => setStreak(Math.max(0, streak - 1))} 
                    className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-xl shadow-2xl rounded-[1.5rem] text-sunset-wine hover:bg-white transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <button 
                    onClick={() => setStreak(streak + 1)} 
                    className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-xl shadow-2xl rounded-[1.5rem] text-sunset-wine hover:bg-white transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Floating Quick Actions */}
            <section className="px-8 grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -8 }}
                className="glass-card p-8 flex flex-col gap-6 bg-gradient-to-br from-white/60 to-mint/10 border-none shadow-2xl"
              >
                <div className="w-14 h-14 bg-mint/20 rounded-[1.5rem] flex items-center justify-center text-mint shadow-inner">
                  <Heart size={28} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-sunset-wine tracking-tight">Bienestar</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Tu equilibrio vital</p>
                </div>
                <button 
                  onClick={() => setActiveTab('wellness')}
                  className="mt-2 text-[10px] font-black text-sunset-orange uppercase tracking-[0.3em] flex items-center gap-2 group"
                >
                  Explorar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.div 
                whileHover={{ y: -8 }}
                className="glass-card p-8 flex flex-col gap-6 bg-gradient-to-br from-white/60 to-sunset-orange/10 border-none shadow-2xl"
              >
                <div className="w-14 h-14 bg-sunset-orange/20 rounded-[1.5rem] flex items-center justify-center text-sunset-orange shadow-inner">
                  <Zap size={28} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-sunset-wine tracking-tight">Productividad</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Tus metas de hoy</p>
                </div>
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className="mt-2 text-[10px] font-black text-sunset-orange uppercase tracking-[0.3em] flex items-center gap-2 group"
                >
                  Gestionar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </section>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-8 pb-32 px-8 pt-12">
            <header className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-sunset-wine tracking-tight">Tareas</h2>
                <p className="text-sunset-wine/40 font-bold">Tus metas, tu ritmo.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsTaskModalOpen(true)}
                className="w-14 h-14 sunset-gradient text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-sunset-orange/30"
              >
                <Plus size={28} />
              </motion.button>
            </header>

            <div className="space-y-4">
              {tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6 flex items-center justify-between bg-white/60 backdrop-blur-xl border-none shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))}
                      className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-mint border-mint shadow-lg shadow-mint/20' : 'border-slate-200'}`}
                    >
                      {task.completed && <Check size={18} className="text-white" />}
                    </button>
                    <div className="space-y-0.5">
                      <span className={`text-lg font-bold transition-all ${task.completed ? 'text-slate-300 line-through' : 'text-sunset-wine'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-sunset-orange uppercase tracking-widest">{task.category}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => SocialService.deleteTask(task.id)}
                    className="p-2 text-slate-300 hover:text-sunset-red transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'wellness':
        return (
          <div className="space-y-8 pb-32 px-8 pt-12 overflow-y-auto">
            <header className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-sunset-wine tracking-tight">Vida</h2>
                <p className="text-sunset-wine/40 font-bold">Escucha a tu cuerpo.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsWellnessModalOpen(true)}
                className="w-14 h-14 sunset-gradient text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-sunset-orange/30"
              >
                <Plus size={28} />
              </motion.button>
            </header>

            <div className="grid grid-cols-1 gap-6">
              {wellness.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleWellness(item.id)}
                  className={`glass-card p-6 flex items-center gap-6 cursor-pointer bg-gradient-to-br border-none shadow-xl transition-all ${
                    item.completed ? 'from-slate-100 to-slate-200 opacity-60' : 'from-white/60 to-mint/5 hover:from-white/80'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-inner ${
                    item.completed ? 'bg-slate-300 text-white' : 
                    item.type === 'water' ? 'bg-sky-100 text-sky-500' :
                    item.type === 'food' ? 'bg-orange-100 text-orange-500' :
                    item.type === 'sleep' ? 'bg-indigo-100 text-indigo-500' :
                    'bg-mint/20 text-mint'
                  }`}>
                    {item.type === 'water' ? <Droplets size={24} /> :
                     item.type === 'food' ? <Coffee size={24} /> :
                     item.type === 'sleep' ? <Moon size={24} /> :
                     <Heart size={24} fill={item.completed ? 'white' : 'currentColor'} />}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className={`text-lg font-black ${item.completed ? 'text-slate-400 line-through' : 'text-sunset-wine'}`}>
                      {item.label}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</span>
                      <span className="text-[10px] font-black text-mint uppercase tracking-widest bg-mint/10 px-2 py-0.5 rounded-full">Sugerencia</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                    item.completed ? 'bg-mint border-mint text-white' : 'border-slate-100 text-transparent'
                  }`}>
                    <Check size={14} />
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
          <div className="space-y-8 pb-32 px-8 pt-12">
            <header className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-sunset-wine tracking-tight">Alarmas</h2>
                <p className="text-sunset-wine/40 font-bold">Despierta tu esencia.</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAlarmModalOpen(true)}
                className="w-14 h-14 sunset-gradient text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-sunset-orange/30"
              >
                <Plus size={28} />
              </motion.button>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {alarms.map((alarm) => (
                <motion.div 
                  key={alarm.id}
                  className="glass-card p-8 flex items-center justify-between bg-white/60 backdrop-blur-xl border-none shadow-lg"
                >
                  <div className="space-y-1">
                    <span className="text-4xl font-black text-sunset-wine tracking-tighter">{alarm.time}</span>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-500">{alarm.title}</h3>
                      <span className="text-[10px] font-black text-sunset-orange uppercase tracking-widest opacity-60">• {alarm.category}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAlarms(alarms.map(a => a.id === alarm.id ? {...a, enabled: !a.enabled} : a))}
                    className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${alarm.enabled ? 'bg-mint' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: alarm.enabled ? 24 : 0 }}
                      className="w-6 h-6 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-8 pb-32 px-8 pt-12">
            <header className="space-y-1">
              <h2 className="text-4xl font-black text-sunset-wine tracking-tight">Análisis</h2>
              <p className="text-sunset-wine/40 font-bold">Tu evolución consciente.</p>
            </header>

            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 flex flex-col gap-4 bg-white/60 backdrop-blur-xl border-none shadow-xl"
              >
                <div className="w-12 h-12 bg-sunset-orange/10 rounded-2xl flex items-center justify-center text-sunset-orange">
                  <Smartphone size={24} />
                </div>
                <div>
                  <span className="text-3xl font-black text-sunset-wine tracking-tighter">2.5h</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pantalla</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 flex flex-col gap-4 bg-white/60 backdrop-blur-xl border-none shadow-xl"
              >
                <div className="w-12 h-12 bg-mint/10 rounded-2xl flex items-center justify-center text-mint">
                  <Zap size={24} />
                </div>
                <div>
                  <span className="text-3xl font-black text-sunset-wine tracking-tighter">85%</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Enfoque</p>
                </div>
              </motion.div>
            </div>

            <div className="glass-card p-8 bg-white/60 backdrop-blur-xl border-none shadow-xl space-y-6">
              <h3 className="text-xl font-black text-sunset-wine tracking-tight">Ritmo Semanal</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_STATS}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF7E5F" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF7E5F" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ color: '#6B2D5C', fontWeight: 900 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#FF7E5F" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
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
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsProfileOpen(false);
                setIsEditingProfile(false);
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-primary to-indigo-600" />
              <div className="px-6 pb-8">
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden relative group">
                      <img 
                        src={userProfile.photo} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={24} className="text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                      </label>
                    </div>
                  </div>
                  <button 
                    className="absolute bottom-0 left-20 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-primary hover:scale-110 transition-transform"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => handlePhotoChange(e);
                      input.click();
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  {isEditingProfile ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                        <input 
                          type="text" 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        />
                      </div>
                      <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 mt-2"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-slate-900">{userProfile.name}</h2>
                      <p className="text-slate-500">{userProfile.email}</p>
                    </div>
                  )}
                </div>

                {!isEditingProfile && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="p-4 bg-slate-50 rounded-3xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nivel</p>
                        <p className="text-lg font-bold text-primary">Maestro</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-3xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Racha</p>
                        <p className="text-lg font-bold text-emerald-600">12 Días</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full p-4 flex items-center gap-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                      >
                        <User size={20} className="text-slate-400" />
                        Editar Perfil
                      </button>
                      <button 
                        onClick={() => setIsPreferencesOpen(true)}
                        className="w-full p-4 flex items-center gap-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                      >
                        <BarChart3 size={20} className="text-slate-400" />
                        Preferencias
                      </button>
                      <button 
                        onClick={() => {
                          signOut(auth).then(() => {
                            setIsAuthenticated(false);
                            setIsProfileOpen(false);
                          });
                        }}
                        className="w-full p-4 flex items-center gap-3 rounded-2xl hover:bg-rose-50 transition-colors text-rose-600 font-bold mt-4"
                      >
                        <Lock size={20} className="text-rose-400" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsEditingProfile(false);
                }}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <Plus size={20} className="rotate-45" />
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

      {/* Organic Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card p-3 flex justify-around items-center z-50 bg-white/40 backdrop-blur-3xl border-none shadow-2xl rounded-[2.5rem]">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={24} />} 
          label="Inicio" 
        />
        <NavButton 
          active={activeTab === 'tasks'} 
          onClick={() => setActiveTab('tasks')} 
          icon={<Zap size={24} />} 
          label="Metas" 
        />
        <NavButton 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
          icon={<CalendarIcon size={24} />} 
          label="Agenda" 
        />
        <NavButton 
          active={activeTab === 'wellness'} 
          onClick={() => setActiveTab('wellness')} 
          icon={<Heart size={24} />} 
          label="Vida" 
        />
        <NavButton 
          active={activeTab === 'alarms'} 
          onClick={() => setActiveTab('alarms')} 
          icon={<AlarmClock size={24} />} 
          label="Ritmo" 
        />
        <NavButton 
          active={activeTab === 'circles'} 
          onClick={() => setActiveTab('circles')} 
          icon={<Users size={24} />} 
          label="Comunidad" 
        />
        <NavButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart3 size={24} />} 
          label="Ser" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 relative group"
    >
      <motion.div
        animate={active ? { scale: 1.2, y: -4 } : { scale: 1, y: 0 }}
        className={`transition-colors duration-300 ${active ? 'text-sunset-orange' : 'text-sunset-wine/30 group-hover:text-sunset-wine/60'}`}
      >
        {icon}
      </motion.div>
      <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${active ? 'text-sunset-wine' : 'text-sunset-wine/20'}`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute -inset-2 bg-sunset-orange/10 blur-xl rounded-full -z-10" 
        />
      )}
    </button>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<'welcome' | 'login' | 'register' | 'recover'>('welcome');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAppleLogin = () => {
    alert("Soporte para Apple viene pronto. Actívalo en tu consola de Firebase Authentication.");
  };

  const handleEmailAuth = async () => {
    setError('');
    setLoading(true);
    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message);
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
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sunset-orange/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -80, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-mint/10 blur-[100px] rounded-full"
        />
      </div>
      
      <AnimatePresence mode="wait">
        {view === 'welcome' ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[4rem] p-12 shadow-[0_32px_64px_rgba(0,0,0,0.08)] relative z-10 text-center space-y-12 border border-white/40"
          >
            <div className="space-y-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-28 h-28 sunset-gradient rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl shadow-sunset-orange/30 relative"
              >
                <Clock size={56} className="text-white" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 sunset-gradient rounded-[3rem] blur-xl -z-10"
                />
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-6xl font-black tracking-tighter text-sunset-wine">Kairos</h1>
                <p className="text-sunset-wine/60 font-bold text-xl tracking-tight">Tiempo con sentido.</p>
              </div>
            </div>

            <div className="space-y-5">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('login')}
                className="w-full py-6 sunset-gradient text-white font-black rounded-[2rem] shadow-2xl shadow-sunset-orange/30 flex items-center justify-center gap-3 group text-xl"
              >
                Comenzar
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('register')}
                className="w-full py-6 bg-white/60 backdrop-blur-md text-sunset-wine border border-white/40 font-black rounded-[2rem] flex items-center justify-center gap-3 hover:bg-white/80 transition-all text-xl"
              >
                Crear cuenta
              </motion.button>

              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sunset-wine/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                  <span className="bg-white/0 px-6 text-sunset-wine/40 font-black">Conexión rápida</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 py-5 bg-white/40 border border-white/40 rounded-[2rem] hover:bg-white/60 transition-all group"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-black text-sunset-wine">Google</span>
                </button>
                <button 
                  onClick={handleAppleLogin}
                  className="flex items-center justify-center gap-3 py-5 bg-white/40 border border-white/40 rounded-[2rem] hover:bg-white/60 transition-all group"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.55-.67-2.85-.67-1.32 0-1.78.65-2.85.65-1.14 0-2.11-.6-3.1-1.59C3.01 18.27 1.5 14.96 1.5 11.8c0-4.94 3.19-7.55 6.27-7.55 1.65 0 2.97.58 3.84.58.84 0 2.37-.61 4.28-.61 1.6 0 3.7.63 5.08 2.57-3.16 1.85-2.65 5.89.44 7.15-1.12 2.76-2.58 5.44-4.36 6.34zM12.03 3.92C11.96 1.95 13.6 0 15.5 0c.1 2.12-1.92 4.14-3.47 3.92z"/>
                  </svg>
                  <span className="text-sm font-black text-sunset-wine">Apple</span>
                </button>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-[10px] text-sunset-wine/30 font-black uppercase tracking-[0.4em]">Experiencia de Conciencia</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md bg-white/60 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl relative z-10 flex flex-col border border-white/40"
          >
            <div className="mb-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sunset-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-sunset-orange/20">
                  <Clock size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-sunset-wine">Kairos</h1>
              </div>
              <button 
                onClick={() => setView('welcome')}
                className="w-10 h-10 flex items-center justify-center bg-white/40 rounded-full hover:bg-white/80 transition-colors"
              >
                <Plus size={24} className="rotate-45 text-sunset-wine/40" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>
              </div>
            )}

            {view === 'login' ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-sunset-wine mb-2 tracking-tight">Acceder</h2>
                  <p className="text-sunset-wine/60 font-medium">Bienvenido de nuevo a tu espacio vital.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sunset-wine/50 uppercase tracking-[0.2em] ml-2">Usuario o Correo</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-wine/30" size={20} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nombre@ejemplo.com" 
                        className="w-full pl-14 pr-5 py-5 bg-white/50 border border-white/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-sunset-orange/10 transition-all text-sunset-wine font-medium placeholder:text-sunset-wine/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sunset-wine/50 uppercase tracking-[0.2em] ml-2">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-wine/30" size={20} />
                      <input 
                        type={showPasswordLogin ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full pl-14 pr-14 py-5 bg-white/50 border border-white/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-sunset-orange/10 transition-all text-sunset-wine font-medium placeholder:text-sunset-wine/20"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-sunset-wine/30 hover:text-sunset-wine transition-colors"
                      >
                        {showPasswordLogin ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-sunset-orange border-sunset-orange shadow-lg shadow-sunset-orange/20' : 'border-slate-200 group-hover:border-sunset-orange/30'}`} 
                        onClick={() => setRememberMe(!rememberMe)}
                      >
                        {rememberMe && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm text-sunset-wine/60 font-bold">Recuérdame</span>
                    </label>
                    <button 
                      onClick={() => setView('recover')}
                      className="text-sm font-black text-sunset-orange hover:text-sunset-red transition-all"
                    >
                      ¿Perdiste la llave?
                    </button>
                  </div>

                  <button 
                    onClick={handleEmailAuth}
                    disabled={loading}
                    className="w-full py-5 sunset-gradient text-white font-black rounded-[2rem] shadow-2xl shadow-sunset-orange/30 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 text-lg disabled:opacity-50"
                  >
                    {loading ? 'Cargando...' : 'Entrar'}
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : view === 'register' ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-sunset-wine mb-2 tracking-tight">Registrarse</h2>
                  <p className="text-sunset-wine/60 font-medium">Comienza tu viaje hacia el equilibrio.</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sunset-wine/50 uppercase tracking-[0.2em] ml-2">Nombre de Usuario</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-wine/30" size={20} />
                      <input 
                        type="text" 
                        placeholder="Tu nombre" 
                        className="w-full pl-14 pr-5 py-5 bg-white/50 border border-white/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-sunset-orange/10 transition-all text-sunset-wine font-medium placeholder:text-sunset-wine/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sunset-wine/50 uppercase tracking-[0.2em] ml-2">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-wine/30" size={20} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com" 
                        className="w-full pl-14 pr-5 py-5 bg-white/50 border border-white/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-sunset-orange/10 transition-all text-sunset-wine font-medium placeholder:text-sunset-wine/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sunset-wine/50 uppercase tracking-[0.2em] ml-2">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-wine/30" size={20} />
                      <input 
                        type={showPasswordRegister ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres" 
                        className="w-full pl-14 pr-14 py-5 bg-white/50 border border-white/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-sunset-orange/10 transition-all text-sunset-wine font-medium placeholder:text-sunset-wine/20"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswordRegister(!showPasswordRegister)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-sunset-wine/30 hover:text-sunset-wine transition-colors"
                      >
                        {showPasswordRegister ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/40">
                    <p className="text-[11px] text-sunset-wine/60 leading-relaxed font-medium">
                      Al unirte, aceptas nuestra <span className="text-sunset-orange font-black cursor-pointer">Esencia de Privacidad</span>.
                    </p>
                  </div>

                  <button 
                    onClick={handleEmailAuth}
                    disabled={loading}
                    className="w-full py-5 sunset-gradient text-white font-black rounded-[2rem] shadow-2xl shadow-sunset-orange/30 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 text-lg disabled:opacity-50"
                  >
                    {loading ? 'Cargando...' : 'Unirse'}
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-sunset-wine mb-2 tracking-tight">Recuperar</h2>
                  <p className="text-slate-500 font-medium">Te enviaremos una nueva llave a tu correo.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-sunset-wine/30" size={20} />
                      <input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        className="w-full pl-14 pr-5 py-5 bg-white/50 border border-white/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-sunset-orange/10 transition-all text-sunset-wine font-medium"
                      />
                    </div>
                  </div>

                  <button 
                    className="w-full py-5 sunset-gradient text-white font-black rounded-[2rem] shadow-2xl shadow-sunset-orange/30 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 text-lg"
                  >
                    Enviar llave
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setView('login')}
                      className="text-sm font-black text-sunset-wine/40 hover:text-sunset-orange transition-colors"
                    >
                      Volver a la puerta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
