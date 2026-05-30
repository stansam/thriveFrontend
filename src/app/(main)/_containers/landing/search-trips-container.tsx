"use client";

import { usePackageSearch } from "@/lib/hooks/features/use-package-search";
import { SearchTripsFormView } from "../../_components/landing/_forms/search-trips-form-view";

interface SearchTripsContainerProps {
  className?: string;
}

export function SearchTripsContainer({ className }: SearchTripsContainerProps) {
  const { navigateToResults } = usePackageSearch();

  return (
    <SearchTripsFormView className={className} onSearch={navigateToResults} />
  );
}

export default SearchTripsContainer;
