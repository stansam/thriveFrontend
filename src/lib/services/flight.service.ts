import { apiClient } from "../api-client";
import { BookFlightRequestDTO, FlightDetailsRequestDTO, FlightSearchRequestDTO } from "../dtos/flight.dto";

export const FlightService = {
    searchFlights: async (request: FlightSearchRequestDTO) => {
        return apiClient.post("/flights/search", request);
    },
    getFlightDetails: async (request: FlightDetailsRequestDTO) => {
        return apiClient.post(`/flights/${request.flightNumber}`);
    },
}