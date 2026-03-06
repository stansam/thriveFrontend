export interface PackageInclusionDTO {
  description: string;
  is_included: boolean;
}

export interface PackageItineraryDTO {
  day_number: number;
  title: string;
  description: string;
  location: string;
}

export interface PackageMediaDTO {
  display_order: number;
  image_url: string;
  is_featured: boolean;
}

export interface PackageDTO {
  title: string;
  slug: string;
  city: string;
  country: string;
  currency: string;
  description: string;
  duration_days: number;
  duration_nights: number;
  inclusions: PackageInclusionDTO[];
  itineraries: PackageItineraryDTO[];
  media: PackageMediaDTO[];
  meta_title: string;
  meta_description: string;
  is_active: boolean;
  is_featured: boolean;
}