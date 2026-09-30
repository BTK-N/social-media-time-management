import { AuthResult, Goal, HistoryEntry, User } from '../types';

export interface StorageAdapter {
  auth: {
    register(username: string, password: string): Promise<AuthResult>;
    login(username: string, password: string): Promise<AuthResult>;
    logout(): Promise<void>;
    currentUser(): Promise<User | null>;
  };
  goals: {
    list(): Promise<Goal[]>;
    create(text: string): Promise<Goal>;
    toggle(id: string, completed: boolean): Promise<Goal>;
    remove(id: string): Promise<void>;
  };
  history: {
    list(): Promise<HistoryEntry[]>;
    append(entry: Omit<HistoryEntry, 'id' | 'date'>): Promise<HistoryEntry>;
  };
}
