import { create } from "zustand";
import { authService } from "../services/auth.service";
import type { UserDTO, LoginRequestDTO, RegisterRequestDTO } from "../dtos/auth.dto";

interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (credentials: LoginRequestDTO) => Promise<UserDTO>;
  register: (credentials: RegisterRequestDTO) => Promise<UserDTO>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    set({ loading: true });
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const userData = await authService.getMe();
        set({ user: userData, isAuthenticated: true, loading: false });
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  login: async (credentials: LoginRequestDTO) => {
    set({ loading: true });
    try {
      const userData = await authService.login(credentials);
      set({ user: userData, isAuthenticated: true, loading: false });
      return userData;
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      throw error;
    }
  },

  register: async (credentials: RegisterRequestDTO) => {
    set({ loading: true });
    try {
      const userData = await authService.register(credentials);
      set({ user: userData, isAuthenticated: true, loading: false });
      return userData;
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      set({ user: null, isAuthenticated: false, loading: false });
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },
}));
