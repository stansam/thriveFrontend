import { SearchFlightsForm } from '../_forms/search-flights'
import { SearchTripsForm } from '../_forms/search-trips-form'
import { SplineScene } from '../spline-scene'
import { cn } from '@/lib/utils'
import { HomeHeroVisualsProps } from '../../../_props/landing/home-hero.props'

export function HomeHeroVisuals({ activeForm }: HomeHeroVisualsProps) {
  return (
    <div
      className={cn(
        'flex-1 relative min-h-[400px] md:min-h-full transition-all duration-500',
        activeForm !== 'none' ? 'h-auto md:h-full' : 'h-[400px] md:h-full',
      )}
    >
      <div className="absolute inset-0 z-0">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div
        className={cn(
          'w-full flex items-center justify-center p-4 md:p-0 transition-all duration-500 ease-in-out z-20',
          'md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
          activeForm === 'book'
            ? 'relative opacity-100 scale-100'
            : 'absolute opacity-0 scale-95 pointer-events-none top-0',
        )}
      >
        <SearchFlightsForm className="relative w-full max-w-md md:mt-20" />
      </div>

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
  )
}
