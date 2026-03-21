/**
 * book-flight.constants.ts
 * Static data for the BookFlightForm — extracted per ARCHITECTURE.md (no inline data in form files).
 */

export const CABIN_CLASS_MAP: Record<string, string> = {
    PREMIUM_ECONOMY: 'p',
    BUSINESS: 'b',
    FIRST: 'f',
}

export const CABIN_OPTIONS = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First Class' },
] as const
