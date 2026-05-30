import { z } from "zod";

export const BookingDTOSchema = z.object({
  id: z.string(),
  booking_reference: z.string(),
  status: z.string(),
  created_at: z.string(),
});
export type BookingDTO = z.infer<typeof BookingDTOSchema>;
