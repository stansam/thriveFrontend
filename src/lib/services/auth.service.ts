import { apiClient } from '../api-client';

/**
 * Auth Service
 * Example standalone frontend handler utilizing the strict apiClient.
 */

// Define explicit Data Transfer Objects (DTOs)
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequestDTO {
  email: string;
  password?: string;
}

export const authService = {
  /**
   * Retrieves the current authenticated user's profile.
   * This request will automatically include the secure HttpOnly session cookie
   * since it hits the Next.js API rewrite (e.g. /api/auth/me).
   */
  isAuthenticated: () => {
    return apiClient.get<boolean>('/api/auth/is-authenticated');
  },
  getMe: () => {
    return apiClient.get<UserDTO>('/api/auth/me');
  },

  /**
   * Logs a user in.
   */
  login: (credentials: LoginRequestDTO) => {
    return apiClient.post<UserDTO>('/api/auth/login', credentials);
  },

  /**
   * Logs the user out.
   */
  logout: () => {
    return apiClient.post<{ success: boolean }>('/api/auth/logout');
  }
};
