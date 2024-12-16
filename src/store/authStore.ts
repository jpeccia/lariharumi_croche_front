import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
  updateToken: (token: string) => void;  // Nova função para atualizar o token
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAdmin: () => get().user?.role === 'ADMIN', // Verifica se o usuário é admin
      updateToken: (token) => set({ token }), // Função para atualizar o token
    }),
    {
      name: 'auth-storage', // Nome da chave no armazenamento local
      partialize: (state) => ({ token: state.token, user: state.user }) // Caso queira persistir apenas certas partes
    }
  )
);
