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

export const SocialService = {
  // --- User Profile ---
  async syncProfile(profile: Partial<UserProfile>) {
    const user = auth.currentUser;
    if (!user) return;

    const path = `users/${user.uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      let kairosId = snap.exists() ? snap.data().kairosId : null;
      
      if (!kairosId) {
        // Generate a simple ID if not exists: @kairos_XXXX
        kairosId = `@kairos_${Math.floor(1000 + Math.random() * 9000)}`;
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        kairosId,
        name: user.displayName || profile.name || 'Usuario',
        photoURL: user.photoURL || profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        mascotName: profile.mascotName || 'Kairo',
        streak: profile.streak || 0,
        balance: profile.balance || 0,
        lastActive: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
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

  subscribeToHabits(callback: (habits: any[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};
    const q = query(collection(db, 'habits'), where('userId', '==', user.uid));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }
};
