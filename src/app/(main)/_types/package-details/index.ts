import { z } from "zod";

export const PackageBookingSchema = z.object({
    firstName: z.string().min(2, "Name required"),
    lastName: z.string().min(2, "Last name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone required"),
    country: z.string().min(2, "Country required"),

    startDate: z.date(),
    numAdults: z.string().refine((v) => parseInt(v) >= 1, { message: "At least 1 adult" }),
    numChildren: z.string(),
    numInfants: z.string(),
    specialRequests: z.string(),
    addFlights: z.boolean()
});

export type PackageBookingSchemaType = z.infer<typeof PackageBookingSchema>;