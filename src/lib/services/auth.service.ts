import { apiClient } from '../api-client';
import { UserDTO, LoginRequestDTO, RegisterRequestDTO } from '../dtos/auth.dto';

export type { UserDTO, LoginRequestDTO, RegisterRequestDTO };

export const authService = {
  isAuthenticated: () => {
    return apiClient.get<boolean>('/api/auth/is-authenticated');
  },
  getMe: () => {
    return apiClient.get<UserDTO>('/api/auth/me');
  },
  register: (credentials: RegisterRequestDTO) => {
    return apiClient.post<UserDTO>('/api/auth/register', credentials);
  },
  login: (credentials: LoginRequestDTO) => {
    return apiClient.post<UserDTO>('/api/auth/login', credentials);
  },
  logout: () => {
    return apiClient.post<{ success: boolean }>('/api/auth/logout');
  }
};
