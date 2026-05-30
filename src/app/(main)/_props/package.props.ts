import type { SearchTripsFormValues } from "@/app/(main)/_types/landing/search-trips.types";

export interface SearchTripsFormProps {
  className?: string;
  onSearch: (data: SearchTripsFormValues) => void;
}
