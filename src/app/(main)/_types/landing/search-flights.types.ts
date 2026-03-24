import { z } from 'zod'

export const LocationResultSchema = z.object({
  iataCode: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  type: z.enum(['CITY', 'AIRPORT']),
})

export type LocationResult = z.infer<typeof LocationResultSchema>


export const SearchFlightsFormSchema = z.object({
  tripType: z.enum(['round-trip', 'one-way']),
  from: z.string().min(1, 'Origin is required'),
  to: z.string().min(1, 'Destination is required'),
  departureDate: z.date({ message: 'Departure date is required' }),
  returnDate: z.date().optional(),
  adults: z.number().min(1, 'At least 1 adult is required'),
  children: z.number().min(0),
  cabinClass: z.string(),
})

export type SearchFlightsFormValues = z.infer<typeof SearchFlightsFormSchema>

export interface UseLocationSearchOptions {
    field: 'from' | 'to'
    setValue: (field: 'from' | 'to', value: string) => void
}