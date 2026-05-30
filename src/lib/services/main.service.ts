import { z } from "zod";
import { apiClient } from "../api-client";
import type { FlightDetailsRequestDTO } from "../dtos/flight.dto";
import { FlightSearchRequestDTO } from "../dtos/flight.dto";
import type {
  PackageDTO,
  GetPackagesRequestDTO,
  GetPackagesResponseDTO,
} from "../dtos/package.dto";
import {
  PackageDTOSchema,
  GetPackagesResponseDTOSchema,
} from "../dtos/package.dto";
import type { LocationSearchRequestDTO } from "../dtos/location.dto";
import type { ServiceDTO } from "../dtos/services.dto";
import { ServiceDTOSchema } from "../dtos/services.dto";
import type { PricingPlanDTO } from "../dtos/pricing.dto";
import { PricingPlanDTOSchema } from "../dtos/pricing.dto";

export const MainService = {
  getServices: async (): Promise<ServiceDTO[]> => {
    const raw = await apiClient.get("/api/services");
    const result = z.array(ServiceDTOSchema).safeParse(raw);
    return result.success ? result.data : [];
  },

  getPricing: async (): Promise<PricingPlanDTO[]> => {
    const raw = await apiClient.get("/api/pricing");
    const result = z.array(PricingPlanDTOSchema).safeParse(raw);
    return result.success ? result.data : [];
  },

  searchPackages: async (
    request: GetPackagesRequestDTO
  ): Promise<GetPackagesResponseDTO> => {
    const raw = await apiClient.get("/api/packages", {
      params: { ...request },
    });
    return GetPackagesResponseDTOSchema.parse(raw);
  },

  getFeaturedPackages: async (): Promise<{ packages: PackageDTO[] }> => {
    const raw = await apiClient.get("/api/packages/featured");
    const result = z
      .object({ packages: z.array(PackageDTOSchema) })
      .safeParse(raw);
    if (!result.success) return { packages: [] };
    return result.data;
  },

  getPackageDetails: async (slug: string): Promise<PackageDTO> => {
    const raw = await apiClient.get(`/api/packages/${slug}`);
    return PackageDTOSchema.parse(raw);
  },

  searchLocations: async (
    request: LocationSearchRequestDTO
  ): Promise<unknown> => {
    return apiClient.post("/api/locations/search", request);
  },

  searchFlights: async (
    request: z.infer<typeof FlightSearchRequestDTO>
  ): Promise<unknown> => {
    return apiClient.post("/api/flights/search", request);
  },

  getFlightDetails: async (
    request: FlightDetailsRequestDTO
  ): Promise<unknown> => {
    return apiClient.post(`/api/flights/${request.flightNumber}`, {
      airlineID: request.airlineID,
      departureDate: request.departureDate,
    });
  },
};
export type MainService = typeof MainService;