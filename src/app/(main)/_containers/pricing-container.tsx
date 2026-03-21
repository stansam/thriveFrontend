'use client'

import { usePricing } from '@/lib/hooks/shared/use-pricing'
import { FALLBACK_PRICING, type PricingPlanFallback } from '@/lib/fallback/pricing.fallback'
import { IS_DEV } from '@/lib/constants/env.constants'

import { PricingView } from '../_components/blocks/pricing-view'

/**
 * PricingContainer — data container for the Pricing section on the landing page.
 *
 * Fetches pricing plans from /api/pricing via the usePricing hook.
 * Falls back to FALLBACK_PRICING in dev when backend is unavailable or empty.
 * Shows an empty state in production if backend returns no plans.
 */
export function PricingContainer() {
  const { data: plans, isLoading, isError } = usePricing()

  const corporatePlans = (plans ?? []).filter((p) => p.group === 'corporate')
  const transactionalPlans = (plans ?? []).filter((p) => p.group === 'transactional')

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
