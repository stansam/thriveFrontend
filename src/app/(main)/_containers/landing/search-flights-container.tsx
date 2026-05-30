"use client";

import { useFlightSearch } from "@/lib/hooks/features/use-flight-search";
import { SearchFlightsForm } from "../../_components/landing/_forms/search-flights-form";

interface SearchFlightsContainerProps {
  className?: string;
}

export function SearchFlightsContainer({
  className,
}: SearchFlightsContainerProps) {
  const { navigateToResults } = useFlightSearch();

  return (
    <SearchFlightsForm className={className} onSearch={navigateToResults} />
  );
}

export default SearchFlightsContainer;
