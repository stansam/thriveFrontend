import { apiClient } from "../api-client";
import { FlightDetailsRequestDTO, FlightSearchRequestDTO } from "../dtos/flight.dto";
import { PackageDTO, GetPackagesRequestDTO } from "../dtos/package.dto";
import { LocationSearchDTO } from "../dtos/location.dto";

export const MainService = {
    getServices: async () => {
        return apiClient.get("/api/services");
    },

    searchPackages: async (request: GetPackagesRequestDTO) => {
        return apiClient.get("/api/packages", { params: { ...request } });
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