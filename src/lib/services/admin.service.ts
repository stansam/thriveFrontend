import type { AdminDashboardStats, AdminUser } from '../types/admin.types';
import { apiClient } from '../api-client';

export const adminService = {
  getDashboardStats: async () => {
    return apiClient.get<AdminDashboardStats>('/api/admin/stats');
  },
  getSystemUsers: async () => {
    return apiClient.get<AdminUser[]>('/api/admin/users');
  },
};
