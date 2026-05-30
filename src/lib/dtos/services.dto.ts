import { z } from "zod";

export const ServiceDTOSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});
export type ServiceDTO = z.infer<typeof ServiceDTOSchema>;