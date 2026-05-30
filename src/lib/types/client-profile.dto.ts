import { z } from "zod";

export const ClientProfileDTOSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().nullish(),
  country: z.string().nullish(),
});
export type ClientProfileDTO = z.infer<typeof ClientProfileDTOSchema>;
