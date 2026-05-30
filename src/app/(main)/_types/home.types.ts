import { z } from "zod";

export const ActiveFormSchema = z.enum(["none", "book", "quote"]);
export type ActiveForm = z.infer<typeof ActiveFormSchema>;
