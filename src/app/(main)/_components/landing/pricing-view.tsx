"use client";

import { PricingCard } from "@/components/ui/pricing-card";
import type { PricingPlanDTO } from "@/lib/dtos/pricing.dto";
import { IS_DEV } from "@/lib/constants/env.constants";
import { PricingSkeleton } from "../../_fallback/landing/pricing-skeleton";
import type { PricingViewProps } from "../../_props/landing/pricing.props";
import { Button } from "@/components/ui/button";

export function PricingView({
  isLoading,
  isError,
  hasFallback,
  displayPlans,
  displayCorporate,
  displayTransactional,
  onRetry,
}: PricingViewProps) {
  return (
    <section className="py-24 px-4 bg-black text-white" id="pricing">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col text-center mb-16">
          <h2 className="mb-4 text-3xl font-semibold md:text-5xl">
            Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the perfect plan for your travel needs. Whether you&apos;re
            an individual, a group, or a corporation, we have you covered.
          </p>
        </div>

        {isLoading && <PricingSkeleton />}

        {isError && !hasFallback && (
          <div className="flex flex-col justify-center items-center h-64 text-neutral-400 gap-4">
            <p>Unable to load pricing options at this time.</p>
            <Button
              variant="outline"
              onClick={onRetry}
              className="border-white/10 text-white hover:bg-neutral-800"
            >
              Retry
            </Button>
          </div>
        )}

        {hasFallback && IS_DEV && !isLoading && (
          <p className="mb-8 text-center text-sm text-neutral-500 italic">
            &nbsp; Dev mode: showing fallback pricing (backend unreachable or empty)
          </p>
        )}

        {!isLoading && !isError && displayPlans.length === 0 && (
          <div className="flex justify-center items-center h-32 text-neutral-500">
            <p>
              Pricing plans are not available at this time. Please contact us
              directly.
            </p>
          </div>
        )}

        {!isLoading && displayPlans.length > 0 && (
          <div className="space-y-20">
            {displayCorporate.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold mb-8 text-center text-white">
                  Corporate Monthly Packages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {displayCorporate.map((plan: PricingPlanDTO) => (
                    <PricingCard
                      key={plan.id}
                      title={plan.title}
                      price={plan.price}
                      description={plan.description}
                      buttonVariant={plan.button_variant}
                      highlight={plan.highlight}
                      features={plan.features}
                    />
                  ))}
                </div>
              </div>
            )}

            {displayTransactional.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayTransactional.map((plan: PricingPlanDTO) => (
                  <PricingCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    description={plan.description}
                    buttonVariant={plan.button_variant}
                    features={plan.features}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PricingView;
