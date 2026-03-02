import { apiClient } from "../api-client";

export const clientService = {
  getMyBookings: async () => {
    return apiClient.get<any[]>("/api/client/bookings");
  },
  getProfile: async () => {
    return apiClient.get<any>("/api/client/profile");
  },
};
