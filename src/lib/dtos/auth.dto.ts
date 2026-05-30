import { z } from "zod";

export const UserDTOSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  is_admin: z.boolean(),
  profile_picture_url: z.string().url().nullish(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const LoginRequestDTOSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
export type LoginRequestDTO = z.infer<typeof LoginRequestDTOSchema>;

export const RegisterRequestDTOSchema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    password: z.string().min(8, "Min 8 characters"),
    confirm_password: z.string().min(8),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type RegisterRequestDTO = z.infer<typeof RegisterRequestDTOSchema>;
