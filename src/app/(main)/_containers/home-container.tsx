'use client'

import { useState } from 'react'

import { BookFlightForm } from '../_components/book-flight-form'
import { SearchTripsForm } from '../_components/search-trips-form'
import { SplineScene } from '../_components/spline-scene'
import { Spotlight } from '../_components/spotlight'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plane, Globe } from 'lucide-react'

type ActiveForm = 'none' | 'book' | 'quote'

/**
 * HomeContainer — owns all interactive hero state for the landing page.
 *
 * ARCHITECTURE.md: containers own state/data; pages are thin shells.
 * The `page.tsx` for (main) is a Server Component that renders this container
 * alongside the other presentational page sections.
 */
export function HomeContainer() {
  const [activeForm, setActiveForm] = useState<ActiveForm>('none')

  const toggleForm = (form: 'book' | 'quote') => {
    setActiveForm((curr) => (curr === form ? 'none' : form))
  }

  return (
    <section className="flex items-center justify-center p-4 min-h-screen">
      <Card className="w-full min-h-[600px] h-auto md:h-[600px] bg-black/96 relative overflow-hidden border-neutral-800 transition-[height] duration-500 ease-in-out">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <div className="flex h-full flex-col md:flex-row relative">
          {/* Left content */}
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center min-h-[300px]">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400">
              Experience the World with Thrive
            </h1>
            <p className="mt-4 text-neutral-300 max-w-lg mb-8">
              Your gateway to seamless travel experiences. From flight bookings to custom
              itineraries, we handle the details so you can focus on the journey.
            </p>
          </div>

          {/* Center Buttons */}
          <div
            className={cn(
              'z-30 flex flex-col gap-4 items-center justify-center p-4',
              'md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
            )}
          >
            <Button
              variant="outline"
              aria-pressed={activeForm === 'book'}
              className={cn(
                'rounded-full h-12 border-neutral-700 bg-black/50 hover:bg-neutral-800 hover:text-white transition-all duration-300 px-6 gap-2 min-w-[160px]',
                activeForm === 'book' && 'bg-white text-gray-300 border-white hover:bg-neutral-200',
              )}
              onClick={() => toggleForm('book')}
            >
              <Plane className="h-5 w-5" aria-hidden />
              <span className="font-medium">Book Flight</span>
            </Button>

            <Button
              variant="outline"
              aria-pressed={activeForm === 'quote'}
              className={cn(
                'rounded-full h-12 border-neutral-700 bg-black/50 hover:bg-neutral-800 hover:text-white transition-all duration-300 px-6 gap-2 min-w-[160px]',
                activeForm === 'quote' && 'bg-white text-gray-300 border-white hover:bg-neutral-200',
              )}
              onClick={() => toggleForm('quote')}
            >
              <Globe className="h-4 w-4" aria-hidden />
              <span className="font-medium">Explore Trips</span>
            </Button>
          </div>

          {/* Right content: 3D Scene + Form Overlays */}
          <div
            className={cn(
              'flex-1 relative min-h-[400px] md:min-h-full transition-all duration-500',
              activeForm !== 'none' ? 'h-auto md:h-full' : 'h-[400px] md:h-full',
            )}
          >
            {/* 3D Scene — lazy-loaded via Suspense inside SplineScene */}
            <div className="absolute inset-0 z-0">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>

            {/* Book Flight Form Overlay */}
            <div
              className={cn(
                'w-full flex items-center justify-center p-4 md:p-0 transition-all duration-500 ease-in-out z-20',
                'md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
                activeForm === 'book'
                  ? 'relative opacity-100 scale-100'
                  : 'absolute opacity-0 scale-95 pointer-events-none top-0',
              )}
            >
              <BookFlightForm className="relative w-full max-w-md md:mt-20" />
            </div>

            {/* Search Trips Form Overlay */}
            <div
              className={cn(
                'w-full flex items-center justify-center p-4 md:p-0 transition-all duration-500 ease-in-out z-20',
                'md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
                activeForm === 'quote'
                  ? 'relative opacity-100 scale-100'
                  : 'absolute opacity-0 scale-95 pointer-events-none top-0',
              )}
            >
              <SearchTripsForm className="relative w-full max-w-md md:mt-20" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
