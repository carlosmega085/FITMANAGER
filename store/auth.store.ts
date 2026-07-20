import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as authService from '../services/auth';
import type { User } from '../services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (payload) => {
    const data = await authService.login(payload);
    await SecureStore.setItemAsync('userToken', data.token);
    set({
      token: data.token,
      user: data.user,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignorar error de red si el token ya no sirve
    }
    await SecureStore.deleteItemAsync('userToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  getProfile: async () => {
    const user = await authService.getProfile();
    set({ user });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const user = await authService.getProfile();
        set({ 
          token, 
          user,
          isAuthenticated: true 
        });
      } else {
        set({ isAuthenticated: false, user: null, token: null });
      }
    } catch {
      await SecureStore.deleteItemAsync('userToken');
      set({ isAuthenticated: false, user: null, token: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
