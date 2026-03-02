import {z} from "zod";

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

export const FlightSearchRequestDTO = z.object({
    tripType: z.enum(["round-trip", "one-way"]),
    origin: z.string().min(2, "Origin is required"),
    destination: z.string().min(2, "Destination is required"),
    departureDate: z.date({
        message: "Departure date is required"
    }),
    // OPTIONAL PARAMS
    returnDate: z.date().optional(),
    filterParams: z.object({
        fs: z.object({
            airlines: z.string().optional(), // CODE or -CODE(Excludes)
            airports: z.string().optional(), // CODE or -CODE(Excludes)
            stops: z.string().optional(), // 0, 1, 2, 3, 4
            price: z.string().optional(), // -MAX or MIN-MAX e.g, -500 (under 500) or 200-500
            legdur: z.string().optional(), // DURATION: legdur=-MAX (minutes) e.g legdur=-600 (under 10hours)
            layoverdur: z.string().optional(), // layoverdur=MIN- (minutes) e.g layoverdur=120- (min 2hours) 
            alliance: z.string().optional(), // NAME e.g. =STAR_ALLIANCE
            sameair: z.string().optional(), // sameair
            equipment: z.string().optional(), // TYPE i.e equipment=W (Wide-Body)
            wifi: z.string().optional(), // wifi
        }).optional(),
    }).optional(),
    searchMetadata: z.object({
        pageNumber: z.number().default(1),
    }).default({ pageNumber: 1 }),
    userSearchParams: z.object({
        passengers: z.array(z.enum(PassengerType)).min(1, "At least one passenger is required").default([PassengerType.ADULT]),
        sortMode: z.enum(SortOptions).default(SortOptions.LOWEST_PRICE),
    }).default({ passengers: [PassengerType.ADULT], sortMode: SortOptions.LOWEST_PRICE })
})


export interface FlightDetailsRequestDTO {
    flightNumber: string;
    airlineID: string;
    departureDate: string | null;
}

export interface BookFlightRequestDTO {
    flightNumber: string;
}