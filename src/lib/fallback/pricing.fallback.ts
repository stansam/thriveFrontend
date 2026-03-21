/**
 * Fallback pricing data for the landing page PricingSection.
 * Displayed when:
 *   - Development: backend is unreachable, returns an error, or returns empty data.
 *   - Production: backend returns an error (empty data in prod shows an empty state instead).
 *
 * Keep this in sync with the shape returned by the /api/pricing backend endpoint.
 */

export interface PricingFeature {
  text: string
}

export interface PricingPlanFallback {
  id: string
  title: string
  price: string
  description: string
  features: string[]
  highlight?: boolean
  buttonVariant: 'outline' | 'default'
  /** Display group heading (e.g. "Corporate Monthly Packages") */
  group: 'corporate' | 'transactional'
}

export const FALLBACK_PRICING: PricingPlanFallback[] = [
  // ── Corporate Monthly Packages ───────────────────────────────────────────
  {
    id: 'bronze',
    title: 'Bronze',
    price: '$150 / mo',
    description: 'Essential for small teams.',
    buttonVariant: 'outline',
    group: 'corporate',
    features: [
      'Up to 6 bookings per month',
      'Standard support',
      'Monthly reporting',
    ],
  },
  {
    id: 'silver',
    title: 'Silver',
    price: '$300 / mo',
    description: 'Perfect for growing businesses.',
    buttonVariant: 'outline',
    group: 'corporate',
    features: [
      'Up to 15 bookings per month',
      'Priority support',
      'Dedicated account manager',
      'Expense integration',
    ],
  },
  {
    id: 'gold',
    title: 'Gold',
    price: '$500 / mo',
    description: 'Ultimate solution for large enterprises.',
    buttonVariant: 'default',
    highlight: true,
    group: 'corporate',
    features: [
      'Unlimited bookings',
      '24/7 Concierge Support',
      'Custom travel policies',
      'VIP Lounge Access coordination',
      'Quarterly business reviews',
    ],
  },

  // ── Transactional Fee Structures ─────────────────────────────────────────
  {
    id: 'ticket-fees',
    title: 'Ticket Booking Fees',
    price: 'Pay as you go',
    description: 'Standard service fees per transaction.',
    buttonVariant: 'outline',
    group: 'transactional',
    features: [
      'Domestic Flights: $25–$50 per ticket',
      'International Flights: $50–$100 per ticket',
      'Last-Minute Emergency Booking: +$25',
      'Group Bookings: $15 per traveler (min 5)',
    ],
  },
  {
    id: 'additional-services',
    title: 'Additional Services',
    price: 'Add-ons',
    description: 'Enhance your trip with customized extras.',
    buttonVariant: 'outline',
    group: 'transactional',
    features: [
      'Hotel booking fee: $20 per booking',
      'Car rental booking fee: $15',
      'Customized itineraries: $50–$150',
      'Travel insurance commissions',
      'Passport/visa information consulting',
    ],
  },
]
