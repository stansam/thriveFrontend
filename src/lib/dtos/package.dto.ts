import { z } from "zod";

export const PackageInclusionDTOSchema = z.object({
  description: z.string(),
  is_included: z.boolean(),
});
export type PackageInclusionDTO = z.infer<typeof PackageInclusionDTOSchema>;

export const PackageItineraryDTOSchema = z.object({
  day_number: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
});
export type PackageItineraryDTO = z.infer<typeof PackageItineraryDTOSchema>;

export const PackageMediaDTOSchema = z.object({
  display_order: z.number().int(),
  image_url: z.string().url(),
  is_featured: z.boolean(),
});
export type PackageMediaDTO = z.infer<typeof PackageMediaDTOSchema>;

export const PackageDTOSchema = z.object({
  title: z.string(),
  slug: z.string(),
  city: z.string(),
  country: z.string(),
  currency: z.string(),
  starting_price: z.number(),
  description: z.string(),
  duration_days: z.number().int().positive(),
  duration_nights: z.number().int().nonnegative(),
  inclusions: z.array(PackageInclusionDTOSchema),
  itineraries: z.array(PackageItineraryDTOSchema),
  media: z.array(PackageMediaDTOSchema),
  meta_title: z.string(),
  meta_description: z.string(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});
export type PackageDTO = z.infer<typeof PackageDTOSchema>;

export const PaginationDTOSchema = z.object({
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
  total_pages: z.number().int(),
  current_page: z.number().int(),
});
export type PaginationDTO = z.infer<typeof PaginationDTOSchema>;

export const GetPackagesResponseDTOSchema = z.object({
  packages: z.array(PackageDTOSchema),
  pagination: PaginationDTOSchema,
});
export type GetPackagesResponseDTO = z.infer<
  typeof GetPackagesResponseDTOSchema
>;

export const GetPackagesRequestDTOSchema = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  min_days: z.number().int().optional(),
  max_days: z.number().int().optional(),
  limit: z.number().int().optional(),
  offset: z.number().int().optional(),
});
export type GetPackagesRequestDTO = z.infer<typeof GetPackagesRequestDTOSchema>;

export const CreatePackageBookingRequestDTOSchema = z.object({
  slug: z.string(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  country: z.string().optional(),
  num_adults: z.number().int().min(1),
  num_children: z.number().int().nonnegative().optional(),
  num_infants: z.number().int().nonnegative().optional(),
  special_requests: z.string(),
});
export type CreatePackageBookingRequestDTO = z.infer<
  typeof CreatePackageBookingRequestDTOSchema
>;

export const CreatePackageBookingResponseDTOSchema = z.object({
  booking: z.object({ booking_reference: z.string() }),
});
export type CreatePackageBookingResponseDTO = z.infer<
  typeof CreatePackageBookingResponseDTOSchema
>;