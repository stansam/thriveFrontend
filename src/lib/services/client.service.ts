import { apiClient } from "../api-client";
import { PackageDTO } from "../dtos/package.dto";

export const clientService = {
  getMyBookings: async () => {
    return apiClient.get<unknown[]>("/api/client/bookings");
  },
  getProfile: async () => {
    return apiClient.get<unknown>("/api/client/profile");
  },
  getSavedPackages: async () => {
    return apiClient.get<PackageDTO[]>("/api/client/wishlist");
  },
  toggleSavedPackage: async (slug: string) => {
    return apiClient.post<unknown>("/api/client/wishlist/toggle", { slug });
  }
};
