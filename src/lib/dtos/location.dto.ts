import { z } from "zod";

export const LocationSearchRequestDTOSchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters long").max(20, "Query must be at most 20 characters long"),
});
export type LocationSearchRequestDTO = z.infer<typeof LocationSearchRequestDTOSchema>;

// Backward compatibility helper
export const LocationSearchDTO = LocationSearchRequestDTOSchema;
export type LocationSearchDTO = LocationSearchRequestDTO;