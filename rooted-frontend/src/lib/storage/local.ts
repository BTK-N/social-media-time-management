import { StorageAdapter } from './types';
import { AuthResult, Goal, HistoryEntry, User } from '../types';

// Helper to hash passwords securely
async function hashPassword(password: string, salt: string = 'rooted_salt'): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Internal LocalStorage Helpers
const getVal = <T>(key: string, def: T): T => {
  const v = localStorage.getItem(`rooted:${key}`);
  return v ? JSON.parse(v) : def;
};
const setVal = <T>(key: string, val: T) => localStorage.setItem(`rooted:${key}`, JSON.stringify(val));

export class LocalStorageAdapter implements StorageAdapter {
  auth = {
    register: async (username: string, password: string): Promise<AuthResult> => {
      const users = getVal<Record<string, string>>('users', {});
      if (users[username]) return { success: false, error: 'User exists' };
      users[username] = await hashPassword(password);
      setVal('users', users);
      return { success: true };
    },
    login: async (username: string, password: string): Promise<AuthResult> => {
      const users = getVal<Record<string, string>>('users', {});
      const hashed = await hashPassword(password);
      if (users[username] === hashed) {
        setVal('currentUser', { username });
        return { success: true, user: { username }, token: 'mock-jwt-token' };
      }
      return { success: false, error: 'Invalid credentials' };
    },
    logout: async (): Promise<void> => {
      localStorage.removeItem('rooted:currentUser');
    },
    currentUser: async (): Promise<User | null> => {
      return getVal<User | null>('currentUser', null);
    }
  };

  goals = {
    list: async (): Promise<Goal[]> => {
      const user = await this.auth.currentUser();
      if (!user) return [];
      const allGoals = getVal<Goal[]>('goals', []);
      return allGoals.filter(g => g.username === user.username);
    },
    create: async (text: string): Promise<Goal> => {
      const user = await this.auth.currentUser();
      if (!user) throw new Error('Not authed');
      const goal: Goal = {
        id: crypto.randomUUID(),
        username: user.username,
        text,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const goals = getVal<Goal[]>('goals', []);
      setVal('goals', [...goals, goal]);
      return goal;
    },
    toggle: async (id: string, completed: boolean): Promise<Goal> => {
      const goals = getVal<Goal[]>('goals', []);
      const idx = goals.findIndex(g => g.id === id);
      if (idx === -1) throw new Error('Goal not found');
      goals[idx].completed = completed;
      setVal('goals', goals);
      return goals[idx];
    },
    remove: async (id: string): Promise<void> => {
      const goals = getVal<Goal[]>('goals', []);
      setVal('goals', goals.filter(g => g.id !== id));
    }
  };

  history = {
    list: async (): Promise<HistoryEntry[]> => {
      const user = await this.auth.currentUser();
      if (!user) return [];
      const allHist = getVal<HistoryEntry[]>('history', []);
      return allHist.filter(h => h.username === user.username).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    append: async (entry: Omit<HistoryEntry, 'id' | 'date'>): Promise<HistoryEntry> => {
      const user = await this.auth.currentUser();
      if (!user) throw new Error('Not authed');
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      const hist = getVal<HistoryEntry[]>('history', []);
      setVal('history', [...hist, newEntry]);
      return newEntry;
    }
  };
}
