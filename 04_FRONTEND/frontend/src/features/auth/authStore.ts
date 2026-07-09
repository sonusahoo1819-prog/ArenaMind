import { create } from 'zustand';
import { User, LoginDto, RegisterDto } from './types';
import { authService } from './authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  login: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(dto);
      set({ user: data.user, token: data.accessToken, isLoading: false });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.accessToken);
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(dto);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  clearError: () => set({ error: null }),

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode token to set user (simple payload parsing)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          set({
            token,
            user: {
              id: payload.sub,
              email: payload.email,
              name: payload.name || '',
              role: payload.role,
            },
          });
        } catch (e) {
          localStorage.removeItem('token');
        }
      }
    }
  },
}));
