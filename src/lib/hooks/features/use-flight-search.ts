"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { CABIN_CLASS_MAP } from "@/app/(main)/_constants/landing/search-flights.constants";
import type { SearchFlightsFormValues } from "@/app/(main)/_types/landing/search-flights.types";

export function useFlightSearch() {
  const router = useRouter();

  const navigateToResults = useCallback(
    (data: SearchFlightsFormValues) => {
      const params = new URLSearchParams({
        origin: data.from,
        destination: data.to,
        departureDate: data.departureDate.toISOString().split("T")[0],
        adults: data.adults.toString(),
        travelClass: CABIN_CLASS_MAP[data.cabinClass] ?? "e",
      });
      if (data.tripType === "round-trip" && data.returnDate) {
        params.append(
          "returnDate",
          data.returnDate.toISOString().split("T")[0]
        );
      }
      if (data.children > 0)
        params.append("children", data.children.toString());
      router.push(`/flights/results?${params.toString()}`);
    },
    [router]
  );

  return { navigateToResults };
}
