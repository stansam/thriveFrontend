'use client'

import { PricingCard } from '@/components/ui/pricing-card'
import type { PricingPlanFallback } from '@/lib/fallback/pricing.fallback'
import { IS_DEV } from '@/lib/constants/env.constants'

export interface PricingViewProps {
  isLoading: boolean
  hasFallback: boolean
  displayPlans: PricingPlanFallback[]
  displayCorporate: PricingPlanFallback[]
  displayTransactional: PricingPlanFallback[]
}

export function PricingView({
  isLoading,
  hasFallback,
  displayPlans,
  displayCorporate,
  displayTransactional
}: PricingViewProps) {
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
