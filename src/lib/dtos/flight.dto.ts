export enum PassengerType {
    ADULT = "ADT", 
    SENIOR = "SNR",
    STUDENT = "STD",
    YOUTH = "YTH",
    CHILD = "CHD",
    TODDLER = "INS",
    INFANT = "INL", // sits on lap
}

export enum SortOptions {
    LOWEST_PRICE = "price_a",
    FASTEST = "duration_a",
    BEST_FLIGHT = "bestflight_a",
    EARLIEST_ARRIVAL = "arrival_a",
}

export enum CabinClass {
    ECONOMY = "e",
    PREMIUM_ECONOMY = "p",
    BUSINESS = "b",
    FIRST = "f",
}

export interface FlightSearchRequestDTO {
    origin: string;
    destination: string;
    departureDate: string;
    // OPTIONAL PARAMS
    returnDate?: string;
    filterParams?: {
        fs: {
            airlines: string | null; // CODE or -CODE(Excludes)
            airports: string | null; // CODE or -CODE(Excludes)
            stops: string | null; // 0, 1, 2, 3, 4
            price: string | null; // -MAX or MIN-MAX e.g, -500 (under 500) or 200-500
            legdur: string | null; // DURATION: legdur=-MAX (minutes) e.g legdur=-600 (under 10hours)
            layoverdur: string | null; // layoverdur=MIN- (minutes) e.g layoverdur=120- (min 2hours) 
            alliance: string | null; // NAME e.g. =STAR_ALLIANCE
            sameair: string | null; // sameair
            equipment: string | null; // TYPE i.e equipment=W (Wide-Body)
            wifi: string | null; // wifi
        }
    }
    searchMetadata: {
        pageNumber: number;
    }
    userSearchParams: {
        passengers: PassengerType[];
        sortMode: SortOptions;
    }
}


export interface FlightDetailsRequestDTO {
    flightNumber: string;
    airlineID: string;
    departureDate: string | null;
}

export interface BookFlightRequestDTO {
    flightNumber: string;
}