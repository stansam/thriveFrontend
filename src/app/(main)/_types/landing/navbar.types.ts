import { z } from "zod";

export const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const UserMenuUserSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  profile_picture_url: z.string().url().nullish(),
});
export type UserMenuUser = z.infer<typeof UserMenuUserSchema>;