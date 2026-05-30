import { z } from "zod";
import { apiClient } from "../api-client";
import {
  PackageDTOSchema,
  type PackageDTO,
  type CreatePackageBookingRequestDTO,
  type CreatePackageBookingResponseDTO,
} from "../dtos/package.dto";
import { BookingDTOSchema, type BookingDTO } from "../types/booking.dto";
import { ClientProfileDTOSchema, type ClientProfileDTO } from "../types/client-profile.dto";

export const clientService = {
  getMyBookings: async (): Promise<BookingDTO[]> => {
    const raw = await apiClient.get("/api/client/bookings");
    const result = z.array(BookingDTOSchema).safeParse(raw);
    return result.success ? result.data : [];
  },

  getProfile: async (): Promise<ClientProfileDTO> => {
    const raw = await apiClient.get("/api/client/profile");
    return ClientProfileDTOSchema.parse(raw);
  },

  getSavedPackages: async (): Promise<PackageDTO[]> => {
    const raw = await apiClient.get("/api/client/wishlist");
    const result = z.array(PackageDTOSchema).safeParse(raw);
    return result.success ? result.data : [];
  },

  toggleSavedPackage: async (slug: string): Promise<{ saved: boolean }> => {
    const raw = await apiClient.post("/api/client/wishlist/toggle", { slug });
    return z.object({ saved: z.boolean() }).parse(raw);
  },

  createPackageBooking: async (
    bookingData: CreatePackageBookingRequestDTO
  ): Promise<CreatePackageBookingResponseDTO> => {
    return apiClient.post("/api/client/packages/booking", bookingData);
  },
};
export type ClientService = typeof clientService;
