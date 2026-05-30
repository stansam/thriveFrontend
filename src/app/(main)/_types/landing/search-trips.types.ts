import { z } from "zod";

export const SearchTripsFormSchema = z.object({
  q: z.string().optional(),
  travelStyle: z.enum(["all", "international", "domestic"]).default("all"),
  duration: z
    .object({
      min: z.number().int().positive().optional(),
      max: z.number().int().positive().optional(),
    })
    .optional(),
  budget: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
    })
    .optional(),
});
export type SearchTripsFormValues = z.infer<typeof SearchTripsFormSchema>;
