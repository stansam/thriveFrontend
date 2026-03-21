'use client'

import { PricingCard } from '@/components/ui/pricing-card'
import { usePricing } from '@/lib/hooks/shared/use-pricing'
import { FALLBACK_PRICING, type PricingPlanFallback } from '@/lib/fallback/pricing.fallback'

const IS_DEV = process.env.NODE_ENV === 'development'

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
    <section className="py-24 px-4 bg-black text-white" id="pricing">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto flex max-w-3xl flex-col text-center mb-16">
          <h2 className="mb-4 text-3xl font-semibold md:text-5xl">
            Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the perfect plan for your travel needs. Whether you&apos;re an individual,
            a group, or a corporation, we have you covered.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            role="status"
            aria-label="Loading pricing"
            className="flex justify-center items-center h-32 text-neutral-500"
          >
            Loading pricing plans…
          </div>
        )}

        {/* Dev fallback banner */}
        {hasFallback && IS_DEV && !isLoading && (
          <p className="mb-8 text-center text-sm text-neutral-500 italic">
            ⚠ Dev mode: showing fallback pricing (backend unreachable or empty)
          </p>
        )}

        {/* Empty state — production only */}
        {!isLoading && !hasFallback && displayPlans.length === 0 && (
          <div className="flex justify-center items-center h-32 text-neutral-500">
            <p>Pricing plans are not available at this time. Please contact us directly.</p>
          </div>
        )}

        {/* Pricing plans */}
        {!isLoading && displayPlans.length > 0 && (
          <>
            {/* Corporate Monthly Packages */}
            {displayCorporate.length > 0 && (
              <div className="mb-20">
                <h3 className="text-2xl font-semibold mb-8 text-center text-white">
                  Corporate Monthly Packages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {displayCorporate.map((plan: PricingPlanFallback) => (
                    <PricingCard
                      key={plan.id}
                      title={plan.title}
                      price={plan.price}
                      description={plan.description}
                      buttonVariant={plan.buttonVariant}
                      highlight={plan.highlight}
                      features={plan.features}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Transactional / Fee Structures */}
            {displayTransactional.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayTransactional.map((plan: PricingPlanFallback) => (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    description={plan.description}
                    buttonVariant={plan.buttonVariant}
                    features={plan.features}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
