import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import type { FeaturedPackagesCarouselProps } from '../../../_props/landing/featured.props'
import { FeaturedPackageCard } from '../_package-card/package-card'
import { IS_DEV } from '@/lib/constants/env.constants'


export function FeaturedPackagesCarousel({
  packages,
  displayFallback,
  isAuthenticated,
  isSavedError,
  isPackageSaved,
  onViewPackage,
  setCarouselApi,
  carouselApi,
  canScrollPrev,
  canScrollNext,
  currentSlide,
}: FeaturedPackagesCarouselProps) {
  return (
    <>
      {displayFallback && IS_DEV && (
        <div className="mb-4 text-center text-sm text-neutral-500 italic">
          ⚠ Dev mode: showing fallback packages (backend unreachable or empty)
        </div>
      )}

      <Carousel
        setApi={setCarouselApi}
        opts={{
          breakpoints: {
            '(max-width: 768px)': { dragFree: true },
          },
        }}
      >
        <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10 hidden md:block">
          <Button
            size="icon"
            variant="outline"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous package"
            className="rounded-full h-12 w-12 border-neutral-700 bg-black/50 backdrop-blur-sm text-white hover:bg-black hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="size-6" aria-hidden />
          </Button>
        </div>

        <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10 hidden md:block">
          <Button
            size="icon"
            variant="outline"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next package"
            className="rounded-full h-12 w-12 border-neutral-700 bg-black/50 backdrop-blur-sm text-white hover:bg-black hover:text-white disabled:opacity-30"
          >
            <ArrowRight className="size-6" aria-hidden />
          </Button>
        </div>

        <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
          {packages.map((item) => (
            <CarouselItem
              key={item.slug}
              className="max-w-[340px] pl-[20px] lg:max-w-[400px]"
            >
              <FeaturedPackageCard
                package={item}
                isPriority={packages.indexOf(item) === 0}
                isAuthenticated={isAuthenticated}
                isSaved={isPackageSaved(item.slug)}
                isSavedError={isSavedError}
                onView={onViewPackage}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Package slides">
        {packages.map((pkg, index) => (
          <button
            key={pkg.slug}
            role="tab"
            aria-selected={currentSlide === index}
            aria-label={`Go to slide ${index + 1}: ${pkg.title}`}
            className={`h-2 w-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-neutral-700'
            }`}
            onClick={() => carouselApi?.scrollTo(index)}
          />
        ))}
      </div>
    </>
  )
}
