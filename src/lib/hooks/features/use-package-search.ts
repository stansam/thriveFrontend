"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { SearchTripsFormValues } from "@/app/(main)/_types/landing/search-trips.types";

export function usePackageSearch() {
  const router = useRouter();

  const navigateToResults = useCallback(
    (data: SearchTripsFormValues) => {
      const params = new URLSearchParams();
      if (data.q) params.append("q", data.q);
      if (data.travelStyle && data.travelStyle !== "all")
        params.append("travel_style", data.travelStyle);
      if (data.duration?.min)
        params.append("min_days", String(data.duration.min));
      if (data.duration?.max)
        params.append("max_days", String(data.duration.max));
      if (data.budget?.min) params.append("min_price", String(data.budget.min));
      if (data.budget?.max) params.append("max_price", String(data.budget.max));
      router.push(`/packages?${params.toString()}`);
    },
    [router]
  );

  return { navigateToResults };
}
