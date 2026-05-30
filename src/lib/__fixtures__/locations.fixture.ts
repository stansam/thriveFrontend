import type { LocationResult } from "@/app/(main)/_types/landing/search-flights.types";

export const MOCK_LOCATIONS: LocationResult[] = [
  {
    name: "London Heathrow",
    iataCode: "LHR",
    type: "AIRPORT",
    city: "London",
    country: "UK",
  },
  {
    name: "John F. Kennedy",
    iataCode: "JFK",
    type: "AIRPORT",
    city: "New York",
    country: "USA",
  },
  {
    name: "Dubai International",
    iataCode: "DXB",
    type: "AIRPORT",
    city: "Dubai",
    country: "UAE",
  },
  {
    name: "Singapore Changi",
    iataCode: "SIN",
    type: "AIRPORT",
    city: "Singapore",
    country: "Singapore",
  },
  {
    name: "Paris Charles de Gaulle",
    iataCode: "CDG",
    type: "AIRPORT",
    city: "Paris",
    country: "France",
  },
];
