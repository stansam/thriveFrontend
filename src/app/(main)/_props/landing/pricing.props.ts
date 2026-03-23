import type { PricingPlanFallback } from '@/lib/fallback/pricing.fallback'

export interface PricingViewProps {
  isLoading: boolean
  hasFallback: boolean
  displayPlans: PricingPlanFallback[]
  displayCorporate: PricingPlanFallback[]
  displayTransactional: PricingPlanFallback[]
}