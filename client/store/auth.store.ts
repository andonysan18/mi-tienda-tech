import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      // Acción para Loguearse
      login: (token, user) => {
        set({ token, user });
      },

      // Acción para Salir
      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
    }
  )
);