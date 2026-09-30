import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';
import { storage } from './storage';

interface AuthState {
  isAuthed: boolean;
  user: User | null;
  checkAuth: () => Promise<void>;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthed: false,
  user: null,
  checkAuth: async () => {
    const user = await storage.auth.currentUser();
    set({ user, isAuthed: !!user });
  },
  login: (user: User) => set({ user, isAuthed: true }),
  logout: async () => {
    await storage.auth.logout();
    set({ user: null, isAuthed: false });
  },
}));

interface ConfigState {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    }),
    { name: 'rooted-ui-storage' }
  )
);
