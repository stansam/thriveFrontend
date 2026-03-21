'use client'

import { AlertCircle } from 'lucide-react'

import { ServicesMarquee } from '../_components/blocks/services-marquee'
import { useServices } from '@/lib/hooks/shared/use-services'
import { LANDING_SERVICES } from '@/lib/constants/landing.constants'

/**
 * ServicesContainer — data container for the Services section.
 *
 * Fetches service data from /api/services via `useServices`.
 * Falls back to LANDING_SERVICES in dev; empty state in production.
 */
export function ServicesContainer() {
  const { data: services, isLoading, isError } = useServices()

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading services"
        className="flex justify-center items-center h-32 bg-black text-neutral-500"
      >
        Loading services…
      </div>
    )
  }

  if (isError) {
    // Error — ServicesMarquee still shows (hook provides fallback in dev)
    // In prod, show generic error
    if (process.env.NODE_ENV === 'production') {
      return (
        <div className="flex flex-col justify-center items-center py-12 bg-black text-neutral-500 gap-2">
          <AlertCircle className="h-6 w-6" aria-hidden />
          <p>Services unavailable at this time.</p>
        </div>
      )
    }
  }

  const displayServices = services ?? LANDING_SERVICES

  if (displayServices.length === 0) {
    return null
  }

  return (
    <ServicesMarquee
      title="Our Premium Services"
      description="Comprehensive travel solutions tailored to your unique needs."
      services={displayServices}
      className="bg-black text-white py-12"
    />
  )
}
