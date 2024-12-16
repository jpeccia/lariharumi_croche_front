import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  updateToken: (token: string) => void;
  isTokenValid: () => boolean; // Nova função para verificar validade do token
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAdmin: () => get().user?.role === 'ADMIN',
      updateToken: (token) => set({ token }),
      isTokenValid: () => {
        const token = get().token;
        if (!token) return false;

        try {
          // Decodificar o token JWT para verificar validade
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
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
