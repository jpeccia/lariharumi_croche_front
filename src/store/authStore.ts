import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateToken: (token: string) => void;
  isTokenValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      setAuth: (user, token) => {
        set({ user, token, isAdmin: user.isAdmin });
      },
      logout: () => set({ user: null, token: null, isAdmin: false }),
      updateToken: (token) => set({ token }),
      isTokenValid: () => {
        const token = get().token;
        if (!token) return false;
        try {
          const [, payload] = token.split('.');
          const decodedPayload = JSON.parse(atob(payload));
          const currentTime = Math.floor(Date.now() / 1000);
          return decodedPayload.exp > currentTime;
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAdmin: state.isAdmin }),
    }
  )
);
