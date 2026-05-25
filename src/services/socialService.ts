import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  orderBy,
  limit,
  Timestamp,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface UserProfile {
  uid: string;
  kairosId: string;
  name: string;
  photoURL: string;
  mascotName: string;
  streak: number;
  balance: number;
  lastActive: any;
}

export interface Interaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'well_done' | 'keep_going' | 'rest';
  timestamp: any;
}

// Variable matching safety gate for double initialization in a single session
let isInitializingDefaults = false;

export const SocialService = {
  // --- User Profile ---
  async syncProfile(profile: Partial<UserProfile>) {
    const user = auth.currentUser;
    if (!user) return;

    const path = `users/${user.uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      const existingData = snap.exists() ? snap.data() : {};
      
      let kairosId = existingData.kairosId || null;
      
      if (!kairosId) {
        kairosId = `@kairos_${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const isNewUser = !snap.exists();

      const newData = {
        uid: user.uid,
        kairosId,
        name: existingData.name || user.displayName || profile.name || 'Usuario',
        photoURL: existingData.photoURL || user.photoURL || profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        mascotName: existingData.mascotName || profile.mascotName || 'Kairo',
        streak: existingData.streak ?? profile.streak ?? 0,
        balance: existingData.balance ?? profile.balance ?? 0,
        lastActive: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), newData, { merge: true });

      if (isNewUser && !isInitializingDefaults) {
        isInitializingDefaults = true;

        // Tareas predeterminadas
        const defaultTasks = [
          { title: "Terminar proyecto pendiente", category: "work", completed: false },
          { title: "Hacer ejercicio 30 min", category: "wellness", completed: false },
          { title: "Leer 20 minutos", category: "personal", completed: false }
        ];
        for (const t of defaultTasks) {
          await addDoc(collection(db, 'tasks'), { ...t, userId: user.uid, createdAt: serverTimestamp() });
        }

        // Hábitos de bienestar predeterminados
        const defaultWellness = [
          { label: "Beber agua", type: "water", time: "08:00", completed: false, group: "wellness" },
          { label: "Almuerzo saludable", type: "food", time: "13:00", completed: false, group: "wellness" },
          { label: "Descanso visual", type: "rest", time: "16:00", completed: false, group: "wellness" }
        ];
        for (const w of defaultWellness) {
          await addDoc(collection(db, 'habits'), { ...w, userId: user.uid, createdAt: serverTimestamp() });
        }

        // Rutinas predeterminadas
        const defaultRoutines = [
          { activity: "Despertar y estirar", type: "rest", time: "07:00", completed: false, group: "routine" },
          { activity: "Revisar pendientes", type: "work", time: "09:00", completed: false, group: "routine" }
        ];
        for (const r of defaultRoutines) {
          await addDoc(collection(db, 'habits'), { ...r, userId: user.uid, createdAt: serverTimestamp() });
        }

        // Alarmas predeterminadas
        const defaultAlarms = [
          { title: "Desayuno", category: "meal", time: "08:00", days: ["Todos"], enabled: true },
          { title: "Vitaminas", category: "medicine", time: "09:30", days: ["Todos"], enabled: true }
        ];
        for (const a of defaultAlarms) {
          await addDoc(collection(db, 'alarms'), { ...a, userId: user.uid, createdAt: serverTimestamp() });
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  subscribeToProfile(callback: (profile: UserProfile | null) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};

    const path = `users/${user.uid}`;
    return onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      } else {
        callback(null);
      }
    }, (e) => {
      handleFirestoreError(e, OperationType.LIST, path);
    });
  },

  async getUser(uid: string): Promise<UserProfile | null> {
    const path = `users/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? (snap.data() as UserProfile) : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return null;
    }
  },

  async getUserByKairosId(kairosId: string): Promise<UserProfile | null> {
    const q = query(collection(db, 'users'), where('kairosId', '==', kairosId), limit(1));
    try {
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as UserProfile;
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'users');
      return null;
    }
  },

  // --- Friendships ---
  async addFriend(friendUid: string) {
    const user = auth.currentUser;
    if (!user || user.uid === friendUid) return;

    const path = 'friendships';
    try {
      // Check if already friends
      const q = query(collection(db, 'friendships'), where('userIds', 'array-contains', user.uid));
      const snap = await getDocs(q);
      const existing = snap.docs.find(d => d.data().userIds.includes(friendUid));
      if (existing) return;

      await addDoc(collection(db, 'friendships'), {
        userIds: [user.uid, friendUid].sort(),
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  subscribeToFriends(callback: (friends: UserProfile[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(collection(db, 'friendships'), where('userIds', 'array-contains', user.uid));
    return onSnapshot(q, async (snap) => {
      const friendUids = snap.docs.map(d => d.data().userIds.find((id: string) => id !== user.uid));
      const profiles: UserProfile[] = [];
      for (const uid of friendUids) {
        const p = await this.getUser(uid);
        if (p) profiles.push(p);
      }
      callback(profiles);
    }, (e) => {
      handleFirestoreError(e, OperationType.LIST, 'friendships');
    });
  },

  // --- Interactions ---
  async sendInteraction(toUserId: string, type: Interaction['type']) {
    const user = auth.currentUser;
    if (!user) return;

    const path = 'interactions';
    try {
      await addDoc(collection(db, 'interactions'), {
        fromUserId: user.uid,
        toUserId,
        type,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  subscribeToInteractions(callback: (interactions: Interaction[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, 'interactions'),
      where('toUserId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Interaction)));
    }, (e) => {
      handleFirestoreError(e, OperationType.LIST, 'interactions');
    });
  },

  // --- Data Sync ---
  async saveTask(task: any) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (task.id && !task.id.startsWith('temp_')) {
        await setDoc(doc(db, 'tasks', task.id), { ...task, userId: user.uid, updatedAt: serverTimestamp() });
      } else {
        const { id, ...rest } = task;
        await addDoc(collection(db, 'tasks'), { ...rest, userId: user.uid, createdAt: serverTimestamp() });
      }
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, 'tasks'); }
  },

  async deleteTask(taskId: string) {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'tasks'); }
  },

  subscribeToTasks(callback: (tasks: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  async saveHabit(habit: any) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (habit.id && !habit.id.startsWith('temp_')) {
        await setDoc(doc(db, 'habits', habit.id), { ...habit, userId: user.uid, updatedAt: serverTimestamp() });
      } else {
        const { id, ...rest } = habit;
        await addDoc(collection(db, 'habits'), { ...rest, userId: user.uid, createdAt: serverTimestamp() });
      }
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, 'habits'); }
  },

  async deleteHabit(habitId: string) {
    try {
      await deleteDoc(doc(db, 'habits', habitId));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'habits'); }
  },

  subscribeToHabits(callback: (habits: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(collection(db, 'habits'), where('userId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  async saveAlarm(alarm: any) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (alarm.id && !alarm.id.startsWith('temp_')) {
        await setDoc(doc(db, 'alarms', alarm.id), { ...alarm, userId: user.uid, updatedAt: serverTimestamp() });
      } else {
        const { id, ...rest } = alarm;
        await addDoc(collection(db, 'alarms'), { ...rest, userId: user.uid, createdAt: serverTimestamp() });
      }
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, 'alarms'); }
  },

  async deleteAlarm(alarmId: string) {
    try {
      await deleteDoc(doc(db, 'alarms', alarmId));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'alarms'); }
  },

  subscribeToAlarms(callback: (alarms: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(collection(db, 'alarms'), where('userId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  async saveEvent(event: any) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (event.id && !event.id.startsWith('temp_')) {
        await setDoc(doc(db, 'events', event.id), { ...event, userId: user.uid, updatedAt: serverTimestamp() });
      } else {
        const { id, ...rest } = event;
        await addDoc(collection(db, 'events'), { ...rest, userId: user.uid, createdAt: serverTimestamp() });
      }
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, 'events'); }
  },

  async deleteEvent(eventId: string) {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'events'); }
  },

  subscribeToEvents(callback: (events: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(collection(db, 'events'), where('userId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  async unlockAchievement(achievement: any) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(collection(db, 'achievements'), where('userId', '==', user.uid), where('title', '==', achievement.title));
      const snap = await getDocs(q);
      if (!snap.empty) return; // Already unlocked

      await addDoc(collection(db, 'achievements'), { ...achievement, userId: user.uid, unlockedAt: serverTimestamp() });
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, 'achievements'); }
  },

  subscribeToAchievements(callback: (achievements: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(collection(db, 'achievements'), where('userId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  async saveProgressHistory(date: string, value: number) {
    const user = auth.currentUser;
    if (!user) return;
    const docId = `${user.uid}_${date}`;
    try {
      await setDoc(doc(db, 'progressHistory', docId), {
        userId: user.uid,
        date,
        value
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `progressHistory/${docId}`);
    }
  },

  subscribeToProgressHistory(callback: (history: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(
      collection(db, 'progressHistory'), 
      where('userId', '==', user.uid),
      orderBy('date', 'asc')
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data()));
    }, (e) => {
      handleFirestoreError(e, OperationType.LIST, 'progressHistory');
    });
  },

  async deleteAccount() {
    const user = auth.currentUser;
    if (!user) return;

    const collectionsToDelete = ['tasks', 'habits', 'alarms', 'events', 'achievements', 'progressHistory'];
    
    for (const colName of collectionsToDelete) {
      const q = query(collection(db, colName), where('userId', '==', user.uid));
      try {
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, colName, docSnap.id));
        }
      } catch (e) {
        console.error(`Error deleting from ${colName}:`, e);
      }
    }

    // Delete user profile doc
    try {
      await deleteDoc(doc(db, 'users', user.uid));
    } catch (e) {
      console.error('Error deleting user profile:', e);
    }

    // Delete auth user
    await user.delete();
  }
};
