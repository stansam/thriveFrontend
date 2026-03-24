// Shared location result type — used by consumers (e.g. AdvancedFlightSearch)
export interface LocationResult {
    iataCode: string;
    name: string;
    city: string;
    country: string;
    type: 'CITY' | 'AIRPORT';
}

export const flightService = {
    searchLocations: async (query: string): Promise<{ success: boolean; data: LocationResult[] }> => {
        // Return mock data so the dropdown works locally for now without throw errors
        if (!query || query.length < 2) return { success: true, data: [] };

        const allLocations = [
            { name: 'London Heathrow', iataCode: 'LHR', type: 'AIRPORT' as const, city: 'London', country: 'UK' },
            { name: 'John F. Kennedy', iataCode: 'JFK', type: 'AIRPORT' as const, city: 'New York', country: 'USA' },
            { name: 'Dubai International', iataCode: 'DXB', type: 'AIRPORT' as const, city: 'Dubai', country: 'UAE' },
            { name: 'Singapore Changi', iataCode: 'SIN', type: 'AIRPORT' as const, city: 'Singapore', country: 'Singapore' },
            { name: 'Paris Charles de Gaulle', iataCode: 'CDG', type: 'AIRPORT' as const, city: 'Paris', country: 'France' },
        ] satisfies LocationResult[];

        const mockData = allLocations.filter(loc =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            loc.city.toLowerCase().includes(query.toLowerCase()) ||
            loc.iataCode.toLowerCase().includes(query.toLowerCase())
        );

        return { success: true, data: mockData };
    },
};
