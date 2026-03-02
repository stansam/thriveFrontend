import { z } from "zod";

export const LocationSearchDTO = z.object(
    {
        query: z.string().min(2, "Query must be at least 2 characters long").max(20, "Query must be at most 20 characters long"),
    }
)