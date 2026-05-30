"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/hooks/shared/use-debounce";
import { flightService } from "@/lib/services/flight-service";
import type { LocationResult } from "@/app/(main)/_types/landing/search-flights.types";

interface UseLocationSearchOptions {
  field: "from" | "to";
  setValue: (field: "from" | "to", value: string) => void;
}

export function useLocationSearch({
  field,
  setValue,
}: UseLocationSearchOptions) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedValue = useDebounce(inputValue, 300);

  const { data: results = [], isFetching: isSearching } = useQuery({
    queryKey: ["location-search", field, debouncedValue],
    queryFn: async () => {
      const res = await flightService.searchLocations(debouncedValue);
      return res.success ? res.data : [];
    },
    enabled: debouncedValue.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const handleSelect = useCallback(
    (location: LocationResult) => {
      setInputValue(`${location.name} (${location.iataCode})`);
      setValue(field, location.iataCode);
      setShowDropdown(false);
    },
    [field, setValue]
  );

  return {
    inputValue,
    setInputValue,
    results: results as LocationResult[],
    isSearching,
    showDropdown,
    setShowDropdown,
    handleSelect,
    debouncedValue,
  };
}
