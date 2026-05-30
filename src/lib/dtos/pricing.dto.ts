import { z } from "zod";

export const PricingPlanDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  highlight: z.boolean().optional(),
  button_variant: z.enum(["outline", "default"]),
  group: z.enum(["corporate", "transactional"]),
});
export type PricingPlanDTO = z.infer<typeof PricingPlanDTOSchema>;
