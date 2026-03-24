import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FeaturedPackagesHeaderProps } from '../../../_props/landing/featured.props'


export function FeaturedPackagesHeader({
  carouselApi,
  canScrollPrev,
  canScrollNext,
}: FeaturedPackagesHeaderProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
            Featured Travels &amp; Tours
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Discover our hand-picked selection of exclusive travel packages tailored for
            unforgettable experiences.
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <Button
            size="icon"
            variant="outline"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous package"
            className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next package"
            className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
          >
            <ArrowRight className="size-5" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  )
}
