import { apiClient } from "../api-client";
import { LocationSearchResponseSchema } from "@/app/(main)/_types/landing/search-flights.types";
import type { LocationResult } from "@/app/(main)/_types/landing/search-flights.types";

export type { LocationResult };


export const flightService = {
  searchLocations: async (
    query: string
  ): Promise<{ success: boolean; data: LocationResult[] }> => {
    if (!query || query.length < 2) return { success: true, data: [] };

    return apiClient
      .post("/api/locations/search", { query })
      .then((r) => LocationSearchResponseSchema.parse(r));
  },
};
export type FlightService = typeof flightService;
