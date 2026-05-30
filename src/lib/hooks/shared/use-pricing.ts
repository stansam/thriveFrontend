import { useQuery } from "@tanstack/react-query";
import { MainService } from "@/lib/services/main.service";
import type { PricingPlanDTO } from "@/lib/dtos/pricing.dto";
import { FALLBACK_PRICING } from "@/lib/fallback/pricing.fallback";
import { IS_DEV } from "@/lib/constants/env.constants";

export function usePricing() {
  return useQuery<PricingPlanDTO[]>({
    queryKey: ["pricing"],
    queryFn: async () => {
      const result = await MainService.getPricing();
      if (IS_DEV && (!result || result.length === 0)) {
        return FALLBACK_PRICING;
      }
      return result ?? [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: IS_DEV ? FALLBACK_PRICING : undefined,
  });
}
