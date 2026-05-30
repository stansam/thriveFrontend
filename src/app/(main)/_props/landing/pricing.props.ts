import type { PricingPlanDTO } from "@/lib/dtos/pricing.dto";

export interface PricingViewProps {
  isLoading: boolean;
  isError: boolean;
  hasFallback: boolean;
  displayPlans: PricingPlanDTO[];
  displayCorporate: PricingPlanDTO[];
  displayTransactional: PricingPlanDTO[];
  onRetry: () => void;
}