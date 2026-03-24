import { apiClient } from "../api-client";

export const adminService = {
  getDashboardStats: async () => {
    return apiClient.get<any>("/api/admin/stats");
  },
  getSystemUsers: async () => {
    return apiClient.get<any[]>("/api/admin/users");
  },
};
