import { useQuery } from '@tanstack/react-query'
import { MainService } from '@/lib/services/main.service'
import type { PricingPlanFallback } from '@/lib/fallback/pricing.fallback'
import { FALLBACK_PRICING } from '@/lib/fallback/pricing.fallback'

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * Fetches pricing plans from the backend.
 *
 * Fallback strategy:
 *   - Development: shows FALLBACK_PRICING on error OR if backend returns empty.
 *   - Production:  shows FALLBACK_PRICING on error only; empty response → empty state.
 */
export function usePricing() {
  return useQuery<PricingPlanFallback[]>({
    queryKey: ['pricing'],
    queryFn: async () => {
      const result = await MainService.getPricing()
      const plans = result as PricingPlanFallback[]
      // In dev, serve fallback when backend returns empty
      if (IS_DEV && (!plans || plans.length === 0)) {
        return FALLBACK_PRICING
      }
      return plans ?? []
    },
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes — pricing rarely changes
    placeholderData: IS_DEV ? FALLBACK_PRICING : undefined,
  })
}
