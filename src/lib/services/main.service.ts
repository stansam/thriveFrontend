import { apiClient } from "../api-client";
import { FlightDetailsRequestDTO, FlightSearchRequestDTO } from "../dtos/flight.dto";
import { PackageDTO } from "../dtos/package.dto";
import { PackageSearchRequestDTO } from "@/app/(main)/_schemas/package.schema";
import { LocationSearchDTO } from "../dtos/location.dto";

export const MainService = {
    getServices: async () => {
        return apiClient.get("/api/services");
    },

    searchPackages: async (request: PackageSearchRequestDTO) => {
        return apiClient.post("/api/packages/search", request);
    },
    getFeaturedPackages: async () => {
        return apiClient.get<{ packages: PackageDTO[] }>("/api/packages/featured");
    },
    getPackageDetails: async (slug: string) => {
        return apiClient.get(`/api/packages/${slug}`)
    },

    searchLocations: async (request: typeof LocationSearchDTO) => {
        return apiClient.post("/api/locations/search", request);
    },
    searchFlights: async (request: typeof FlightSearchRequestDTO) => {
        return apiClient.post("/api/flights/search", request);
    },
    getFlightDetails: async (request: FlightDetailsRequestDTO) => {
        return apiClient.post(`/api/flights/${request.flightNumber}`);
    },
}