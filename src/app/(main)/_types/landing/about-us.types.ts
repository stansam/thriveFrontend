import { z } from "zod";
import { ICON_MAP } from "@/lib/constants/icon-map.constants";

export type IconKey = keyof typeof ICON_MAP;

export const ServiceDataSchema = z.object({
  iconName: z.custom<IconKey>(),
  secondaryIconName: z.custom<IconKey>(),
  title: z.string(),
  description: z.string(),
  position: z.enum(["left", "right"]),
});
export type ServiceData = z.infer<typeof ServiceDataSchema>;

export const StatDataSchema = z.object({
  iconName: z.custom<IconKey>(),
  value: z.number(),
  label: z.string(),
  suffix: z.string(),
});
export type StatData = z.infer<typeof StatDataSchema>;