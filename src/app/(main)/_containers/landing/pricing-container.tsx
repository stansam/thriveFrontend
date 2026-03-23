'use client'

import { usePricing } from '@/lib/hooks/shared/use-pricing'
import { FALLBACK_PRICING, type PricingPlanFallback } from '@/lib/fallback/pricing.fallback'
import { IS_DEV } from '@/lib/constants/env.constants'

import { PricingView } from '../../_components/landing/pricing-view'

export function PricingContainer() {
  const { data: plans, isLoading, isError } = usePricing()

  const hasFallback = isError || (IS_DEV && (plans ?? []).length === 0)
  const displayPlans = hasFallback ? FALLBACK_PRICING : (plans ?? [])
  const displayCorporate = displayPlans.filter((p) => p.group === 'corporate')
  const displayTransactional = displayPlans.filter((p) => p.group === 'transactional')

  return (
    <PricingView 
      isLoading={isLoading}
      hasFallback={hasFallback}
      displayPlans={displayPlans as PricingPlanFallback[]}
      displayCorporate={displayCorporate as PricingPlanFallback[]}
      displayTransactional={displayTransactional as PricingPlanFallback[]}
    />
  )
}
