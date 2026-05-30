import { useQuery } from "@tanstack/react-query";
import { MainService } from "@/lib/services/main.service";
import { ICON_MAP } from "@/lib/constants/icon-map.constants";
import { Plane } from "lucide-react";
import type { LandingService } from "@/lib/constants/landing.constants";
import { LANDING_SERVICES } from "@/lib/constants/landing.constants";
import { IS_DEV } from "@/lib/constants/env.constants";

export function useServices() {
  return useQuery<LandingService[]>({
    queryKey: ["landing-services"],
    queryFn: async () => {
      const result = await MainService.getServices();

      if (IS_DEV && (!result || result.length === 0)) {
        return LANDING_SERVICES;
      }

      const mapped: LandingService[] = (result ?? []).map((s) => ({
        title: s.title,
        description: s.description,
        icon: ICON_MAP[s.icon as keyof typeof ICON_MAP] ?? Plane,
      }));

      return mapped.length > 0 ? mapped : IS_DEV ? LANDING_SERVICES : [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 60, // 1 hour
    placeholderData: IS_DEV ? LANDING_SERVICES : undefined,
  });
}