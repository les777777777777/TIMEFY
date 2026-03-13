import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Heart, 
  BarChart3,
  Plus,
  Bell,
  User,
  Smartphone,
  Droplets,
  Coffee,
  Moon,
  Zap,
  Pill,
  Utensils,
  AlarmClock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock
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
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Task, AppUsage, LocationTime, RoutineItem, WellnessReminder, CalendarEvent, Alarm, Category } from './types';

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
  { id: '1', title: 'Reunión de Equipo', startTime: '09:00', endTime: '10:00', location: 'Zoom', type: 'work' },
  { id: '2', title: 'Clase de Diseño', startTime: '11:00', endTime: '13:00', location: 'Aula 402', type: 'study' },
  { id: '3', title: 'Almuerzo con Amigos', startTime: '14:00', endTime: '15:30', location: 'Restaurante Central', type: 'personal' },
  { id: '4', title: 'Yoga Flow', startTime: '17:00', endTime: '18:00', location: 'Gimnasio', type: 'wellness' },
  { id: '5', title: 'Lectura Técnica', startTime: '20:00', endTime: '21:00', type: 'study' },
];

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Terminar proyecto de React', completed: false, category: 'work' },
  { id: '2', title: 'Estudiar para examen de cálculo', completed: true, category: 'study' },
  { id: '3', title: 'Comprar víveres', completed: false, category: 'personal' },
  { id: '4', title: 'Meditación 10 min', completed: false, category: 'wellness' },
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
  { id: '1', time: '07:00', activity: 'Despertar & Agua', type: 'rest' },
  { id: '2', time: '08:30', activity: 'Sesión de Estudio', type: 'study' },
  { id: '3', time: '12:00', activity: 'Almuerzo Saludable', type: 'rest' },
  { id: '4', time: '15:00', activity: 'Gimnasio', type: 'exercise' },
  { id: '5', time: '18:00', activity: 'Trabajo en Proyecto', type: 'work' },
];

const MOCK_WELLNESS: WellnessReminder[] = [
  { id: '1', type: 'water', label: 'Beber agua', time: '10:00', completed: true },
  { id: '2', type: 'rest', label: 'Descanso visual', time: '11:30', completed: false },
  { id: '3', type: 'food', label: 'Almuerzo', time: '13:00', completed: false },
  { id: '4', type: 'sleep', label: 'Preparar sueño', time: '22:00', completed: false },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Recordatorio de Agua', message: 'Es hora de beber un vaso de agua.', time: 'Hace 5 min', read: false },
  { id: '2', title: 'Nueva Tarea', message: 'Has añadido "Terminar proyecto" a tu lista.', time: 'Hace 1 hora', read: true },
  { id: '3', title: 'Logro Desbloqueado', message: '¡Has completado todas tus tareas de hoy!', time: 'Hace 2 horas', read: true },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [wellness, setWellness] = useState<WellnessReminder[]>(MOCK_WELLNESS);
  const [alarms, setAlarms] = useState<Alarm[]>(MOCK_ALARMS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [taskCategories, setTaskCategories] = useState<Category[]>(DEFAULT_TASK_CATEGORIES);
  const [eventCategories, setEventCategories] = useState<Category[]>(DEFAULT_EVENT_CATEGORIES);
  const [routineCategories, setRoutineCategories] = useState<Category[]>(DEFAULT_ROUTINE_CATEGORIES);
  const [locationCategories, setLocationCategories] = useState<Category[]>(DEFAULT_LOCATION_CATEGORIES);
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [locations, setLocations] = useState<LocationTime[]>(MOCK_LOCATION);
  const [routine, setRoutine] = useState<RoutineItem[]>(MOCK_ROUTINE);
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
  const [userProfile, setUserProfile] = useState({
    name: 'Lesly Jhoana',
    email: 'leslyjhoanav2@gmail.com',
    photo: 'https://picsum.photos/seed/lesly/200'
  });
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [preferences, setPreferences] = useState({
    darkMode: false,
    pushNotifications: true,
    alarmSound: 'Zen'
  });

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
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleWellness = (id: string) => {
    setWellness(wellness.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
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
          <div className="space-y-6 pb-24">
            <header className="flex justify-between items-center px-4 pt-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <Clock size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-black tracking-tight text-primary uppercase">Timefy</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hola, {userProfile.name.split(' ')[0]}</h1>
                <p className="text-slate-500">¿Cómo va tu día hoy?</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="p-2 rounded-full bg-white shadow-sm border border-slate-100 relative"
                >
                  <Bell size={20} className="text-slate-600" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
                  )}
                </button>
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="p-2 rounded-full bg-primary text-white shadow-md"
                >
                  <User size={20} />
                </button>
              </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 px-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4 flex flex-col gap-2"
              >
                <div className="p-2 bg-indigo-50 w-fit rounded-lg">
                  <Smartphone size={20} className="text-indigo-600" />
                </div>
                <span className="text-2xl font-bold">2h 30m</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Uso de Pantalla</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4 flex flex-col gap-2"
              >
                <div className="p-2 bg-emerald-50 w-fit rounded-lg">
                  <Zap size={20} className="text-emerald-600" />
                </div>
                <span className="text-2xl font-bold">75%</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Productividad</span>
              </motion.div>
            </div>

            {/* Wellness Reminders Horizontal Scroll */}
            <section className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <h2 className="text-lg font-semibold">Bienestar</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('wellness')}
                    className="text-sm text-primary font-medium"
                  >
                    Ver todos
                  </button>
                  <button 
                    onClick={() => setIsWellnessModalOpen(true)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
                {wellness.map((item) => (
                  <motion.div 
                    key={item.id}
                    onClick={() => toggleWellness(item.id)}
                    className={`flex-shrink-0 w-32 p-4 rounded-2xl border transition-all cursor-pointer ${
                      item.completed 
                        ? 'bg-wellness/10 border-wellness/20' 
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className={`p-2 rounded-xl w-fit mb-3 ${
                      item.completed ? 'bg-wellness text-white' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {item.type === 'water' && <Droplets size={18} />}
                      {item.type === 'food' && <Coffee size={18} />}
                      {item.type === 'sleep' && <Moon size={18} />}
                      {item.type === 'rest' && <Heart size={18} />}
                    </div>
                    <p className={`text-sm font-medium ${item.completed ? 'text-wellness' : 'text-slate-700'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Tasks Preview */}
            <section className="px-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Tareas de Hoy</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="text-sm text-primary font-medium"
                  >
                    Ver todos
                  </button>
                  <button 
                    onClick={() => setIsTaskModalOpen(true)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-3 p-4 glass-card cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                    }`}>
                      {task.completed && <CheckSquare size={14} className="text-white" />}
                    </div>
                    <span className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Tracking Preview */}
            <section className="px-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Tiempo por Ubicación</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('stats')}
                    className="text-sm text-primary font-medium"
                  >
                    Ver todos
                  </button>
                  <button 
                    onClick={() => setIsLocationModalOpen(true)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div className="glass-card p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locations}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="time" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        );
      case 'wellness':
        return (
          <div className="p-4 space-y-6 pb-24">
            <header className="pt-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold">Bienestar</h1>
                <p className="text-slate-500">Tus recordatorios de salud</p>
              </div>
              <button 
                onClick={() => setIsWellnessModalOpen(true)}
                className="p-3 bg-wellness text-white rounded-2xl shadow-lg shadow-wellness/20 hover:scale-105 active:scale-95 transition-transform"
              >
                <Plus size={24} />
              </button>
            </header>
            <div className="grid grid-cols-1 gap-4">
              {wellness.map((item) => (
                <motion.div 
                  layout
                  key={item.id} 
                  onClick={() => toggleWellness(item.id)}
                  className={`flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${
                    item.completed 
                      ? 'bg-wellness/10 border-wellness/20' 
                      : 'bg-white border-slate-100 shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-2xl ${
                    item.completed ? 'bg-wellness text-white' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {item.type === 'water' && <Droplets size={24} />}
                    {item.type === 'food' && <Coffee size={24} />}
                    {item.type === 'sleep' && <Moon size={24} />}
                    {item.type === 'rest' && <Heart size={24} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg font-bold ${item.completed ? 'text-wellness' : 'text-slate-700'}`}>
                      {item.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-400 font-medium">{item.time}</span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.completed ? 'bg-wellness border-wellness' : 'border-slate-200 bg-white'
                  }`}>
                    {item.completed && <CheckSquare size={16} className="text-white" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="p-4 space-y-6 pb-24">
            <header className="pt-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold">Mis Tareas</h1>
                <p className="text-slate-500">Organiza tus pendientes</p>
              </div>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
              >
                <Plus size={24} />
              </button>
            </header>
            <div className="space-y-3">
              {tasks.map((task) => (
                <motion.div 
                  layout
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 p-4 glass-card cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                  }`}>
                    {task.completed && <CheckSquare size={16} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.title}
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      {task.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="p-4 space-y-8 pb-24">
            <header className="pt-8">
              <h1 className="text-3xl font-bold">Estadísticas</h1>
              <p className="text-slate-500">Análisis de tu tiempo</p>
            </header>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Smartphone size={20} className="text-indigo-500" />
                Uso de Aplicaciones
              </h2>
              <div className="glass-card p-6 flex flex-col items-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_APP_USAGE}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="time"
                      >
                        {MOCK_APP_USAGE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  {MOCK_APP_USAGE.map((app, i) => (
                    <div key={app.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm text-slate-600">{app.name}</span>
                      <span className="text-xs font-bold ml-auto">{app.time}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Tiempo por Ubicación
                </h2>
                <button 
                  onClick={() => setIsLocationModalOpen(true)}
                  className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="glass-card p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locations}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="time" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock size={20} className="text-emerald-500" />
                  Rutina Diaria
                </h2>
                <button 
                  onClick={() => setIsRoutineModalOpen(true)}
                  className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {routine.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-12 text-sm font-bold text-slate-400 pt-1">{item.time}</div>
                    <div className="flex-1 glass-card p-4 flex items-center justify-between">
                      <span className="font-medium">{item.activity}</span>
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
                        item.type === 'work' ? 'bg-indigo-100 text-indigo-600' :
                        item.type === 'study' ? 'bg-amber-100 text-amber-600' :
                        item.type === 'exercise' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6 pb-24">
            <header className="px-4 pt-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold">Agenda</h1>
                <p className="text-slate-500">Tu cronograma semanal</p>
              </div>
              <button 
                onClick={() => setIsEventModalOpen(true)}
                className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
              >
                <Plus size={24} />
              </button>
            </header>

            {/* Horizontal Date Picker */}
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
              {days.map((date, i) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                      isSelected 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'bg-white text-slate-400 border border-slate-100'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                    </span>
                    <span className="text-xl font-bold">{date.getDate()}</span>
                    {isSelected && <motion.div layoutId="active-day" className="w-1 h-1 bg-white rounded-full" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Timeline View */}
            <div className="px-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Eventos</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hoy</span>
              </div>
              
              <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {events.map((event) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={event.id} 
                    className="flex gap-6 relative"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full border-4 border-slate-50 flex items-center justify-center z-10 ${
                        event.type === 'work' ? 'bg-indigo-500' :
                        event.type === 'study' ? 'bg-amber-500' :
                        event.type === 'wellness' ? 'bg-pink-500' :
                        'bg-emerald-500'
                      }`}>
                        <Clock size={16} className="text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 glass-card p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800">{event.title}</h3>
                        <span className="text-xs font-bold text-slate-400">{event.startTime}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          event.type === 'work' ? 'bg-indigo-100 text-indigo-600' :
                          event.type === 'study' ? 'bg-amber-100 text-amber-600' :
                          event.type === 'wellness' ? 'bg-pink-100 text-pink-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-[10px] text-slate-400">{event.startTime} - {event.endTime}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'alarms':
        return (
          <div className="p-4 space-y-6 pb-24">
            <header className="pt-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold">Alarmas</h1>
                <p className="text-slate-500">Gestión de recordatorios</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="p-3 bg-white text-slate-600 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
                  title="Añadir Categoría"
                >
                  <LayoutDashboard size={20} />
                </button>
                <button 
                  onClick={() => setIsAlarmModalOpen(true)}
                  className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Plus size={24} />
                </button>
              </div>
            </header>

            <div className="space-y-4">
              {alarms.map((alarm) => {
                const category = categories.find(c => c.id === alarm.category) || categories[categories.length - 1];
                return (
                  <motion.div 
                    key={alarm.id}
                    className={`glass-card p-5 flex items-center justify-between transition-all ${
                      !alarm.enabled ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl bg-${category.color}-100 text-${category.color}-600`}>
                        {category.icon === 'utensils' && <Utensils size={20} />}
                        {category.icon === 'pill' && <Pill size={20} />}
                        {category.icon === 'droplets' && <Droplets size={20} />}
                        {category.icon === 'coffee' && <Coffee size={20} />}
                        {category.icon === 'bell' && <Bell size={20} />}
                        {!['utensils', 'pill', 'droplets', 'coffee', 'bell'].includes(category.icon) && <Zap size={20} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{alarm.time}</h3>
                        <p className="text-sm font-medium text-slate-600">{alarm.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-primary uppercase">{category.name}</span>
                          <div className="flex gap-1">
                            {alarm.days.map(day => (
                              <span key={day} className="text-[9px] font-bold text-slate-400 uppercase">{day}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setAlarms(alarms.map(a => a.id === alarm.id ? { ...a, enabled: !a.enabled } : a))}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        alarm.enabled ? 'bg-primary' : 'bg-slate-200'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: alarm.enabled ? 24 : 2 }}
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
                    setTasks([...tasks, { id: Date.now().toString(), title: newTask.title, completed: false, category: newTask.category }]);
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inicio</label>
                    <input type="time" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none" value={newEvent.startTime} onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fin</label>
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
                    setRoutine([...routine, { id: Date.now().toString(), ...newRoutine }]);
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
                          setIsAuthenticated(false);
                          setIsProfileOpen(false);
                        }}
                        className="w-full p-4 flex items-center gap-3 rounded-2xl hover:bg-rose-50 transition-colors text-rose-600 font-bold mt-4"
                      >
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
                      const reminder: WellnessReminder = {
                        id: Date.now().toString(),
                        ...newWellness,
                        completed: false
                      };
                      setWellness([...wellness, reminder]);
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

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card p-2 flex justify-around items-center z-50">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={20} />} 
          label="Inicio" 
        />
        <NavButton 
          active={activeTab === 'tasks'} 
          onClick={() => setActiveTab('tasks')} 
          icon={<CheckSquare size={20} />} 
          label="Tareas" 
        />
        <NavButton 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
          icon={<CalendarIcon size={20} />} 
          label="Agenda" 
        />
        <NavButton 
          active={activeTab === 'wellness'} 
          onClick={() => setActiveTab('wellness')} 
          icon={<Heart size={20} />} 
          label="Salud" 
        />
        <NavButton 
          active={activeTab === 'alarms'} 
          onClick={() => setActiveTab('alarms')} 
          icon={<AlarmClock size={20} />} 
          label="Alarmas" 
        />
        <NavButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart3 size={20} />} 
          label="Stats" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
        active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <motion.div
        animate={active ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
      >
        {icon}
      </motion.div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-primary rounded-full" 
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      
      <AnimatePresence mode="wait">
        {view === 'welcome' ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 relative z-10 text-center space-y-10"
          >
            <div className="space-y-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 bg-primary rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-primary/20"
              >
                <Clock size={48} className="text-white" />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter text-slate-900">Timefy</h1>
                <p className="text-slate-500 font-medium text-lg">Tu tiempo, bajo control.</p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setView('login')}
                className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
              >
                Acceder
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView('register')}
                className="w-full py-5 bg-white text-slate-900 border-2 border-slate-100 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] transition-all text-lg"
              >
                Registrarse
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">o continúa con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onLogin}
                  className="flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-bold text-slate-700">Gmail</span>
                </button>
                <button 
                  onClick={onLogin}
                  className="flex items-center justify-center gap-3 py-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.55-.67-2.85-.67-1.32 0-1.78.65-2.85.65-1.14 0-2.11-.6-3.1-1.59C3.01 18.27 1.5 14.96 1.5 11.8c0-4.94 3.19-7.55 6.27-7.55 1.65 0 2.97.58 3.84.58.84 0 2.37-.61 4.28-.61 1.6 0 3.7.63 5.08 2.57-3.16 1.85-2.65 5.89.44 7.15-1.12 2.76-2.58 5.44-4.36 6.34zM12.03 3.92C11.96 1.95 13.6 0 15.5 0c.1 2.12-1.92 4.14-3.47 3.92z"/>
                  </svg>
                  <span className="text-sm font-bold text-slate-700">iCloud</span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Productividad & Bienestar</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 relative z-10 flex flex-col border border-slate-50"
          >
            <div className="mb-8 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Clock size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">Timefy</h1>
              </div>
              <button 
                onClick={() => setView('welcome')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Plus size={24} className="rotate-45 text-slate-400" />
              </button>
            </div>

            {view === 'login' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Acceder</h2>
                  <p className="text-slate-500 text-sm">Bienvenido de nuevo a tu espacio productivo.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Usuario o Correo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="nombre@ejemplo.com" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type={showPasswordLogin ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswordLogin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div 
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-slate-300'}`} 
                        onClick={() => setRememberMe(!rememberMe)}
                      >
                        {rememberMe && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm text-slate-500 font-medium">Recuérdame</span>
                    </label>
                    <button 
                      onClick={() => setView('recover')}
                      className="text-sm font-bold text-primary hover:underline transition-all"
                    >
                      ¿Olvidaste la contraseña?
                    </button>
                  </div>

                  <button 
                    onClick={onLogin}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                  >
                    Acceder
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : view === 'register' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Registrarse</h2>
                  <p className="text-slate-500 text-sm">Únete a miles de personas optimizando su vida.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre de Usuario</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Tu nombre" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type={showPasswordRegister ? "text" : "password"} 
                        placeholder="Mínimo 8 caracteres" 
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswordRegister(!showPasswordRegister)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswordRegister ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Al registrarte, confirmas que has leído y aceptas nuestra <span className="text-primary font-bold cursor-pointer">Política de Privacidad</span>.
                    </p>
                  </div>

                  <button 
                    onClick={onLogin}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200/50 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                  >
                    Registrarse
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Recuperar contraseña</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                  >
                    Enviar enlace
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setView('login')}
                      className="text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                    >
                      Volver a iniciar sesión
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
