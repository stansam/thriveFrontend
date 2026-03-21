'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { WishlistButton } from '@/components/blocks/wishlist-button'
import { useFeaturedPackages, useMyPackages, FALLBACK_PACKAGES } from '@/lib/hooks/shared/use-packages'
import { useAuth } from '@/lib/auth-context'
import type { PackageDTO } from '@/lib/dtos/package.dto'

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * FeaturedPackagesContainer — data container for the Featured Packages section.
 *
 * ARCHITECTURE.md: tightly coupled to the (main) page group, so it lives in
 * `src/app/(main)/_containers/` rather than the global `src/containers/`.
 *
 * Data fetching is owned here; the rendering subtree is presentational.
 */
export function FeaturedPackagesContainer() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const { data: apiPackages, isLoading, isError } = useFeaturedPackages()
  const { data: savedPackages, isError: isSavedError } = useMyPackages()

  const extractedPackages: PackageDTO[] = apiPackages?.packages ?? []
  const isEmpty = !isLoading && !isError && extractedPackages.length === 0

  // In dev show fallback on error or empty; in prod show empty state on empty
  const displayFallback = isError || (IS_DEV && isEmpty)
  const packages: PackageDTO[] = displayFallback ? FALLBACK_PACKAGES : extractedPackages

  const isPackageSaved = (slug: string): boolean =>
    savedPackages?.some((p: PackageDTO) => p.slug === slug) ?? false

  const handleViewPackage = (slug: string) => {
    router.push(`/packages/${slug}`)
  }

  useEffect(() => {
    if (!carouselApi) return
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => { carouselApi.off('select', updateSelection) }
  }, [carouselApi])

  return (
    <section className="relative py-24 bg-black text-white" id="featured-tours">
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
              onClick={() => { carouselApi?.scrollPrev() }}
              disabled={!canScrollPrev}
              aria-label="Previous package"
              className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => { carouselApi?.scrollNext() }}
              disabled={!canScrollNext}
              aria-label="Next package"
              className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
            >
              <ArrowRight className="size-5" aria-hidden />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Loading state */}
        {isLoading && (
          <div
            role="status"
            aria-label="Loading featured tours"
            className="flex justify-center items-center h-64 text-neutral-500"
          >
            Loading featured tours…
          </div>
        )}

        {/* Error state */}
        {isError && !IS_DEV && (
          <div className="flex flex-col justify-center items-center h-64 text-red-400 gap-2">
            <AlertCircle className="h-8 w-8" aria-hidden />
            <p>Unable to load featured tours at this time.</p>
            <Button
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty state in production only */}
        {!isLoading && !isError && isEmpty && !IS_DEV && (
          <div className="flex flex-col justify-center items-center h-64 text-neutral-500 gap-2">
            <p>No featured tours available at this time. Check back soon.</p>
          </div>
        )}

        {/* Carousel — shown when we have packages (real or fallback) */}
        {!isLoading && packages.length > 0 && (
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
              {/* Prev arrow — floating on desktop */}
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

              {/* Next arrow — floating on desktop */}
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
                    <div className="group relative h-full flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50">
                      <div className="relative aspect-4/3 w-full overflow-hidden">
                        <Image
                          src={
                            item.media?.find((m) => m.is_featured)?.image_url ??
                            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1080&auto=format&fit=crop'
                          }
                          alt={item.title ?? 'Tour Package'}
                          fill
                          // Only first slide is above-the-fold LCP candidate
                          priority={packages.indexOf(item) === 0}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-neutral-900 to-transparent pointer-events-none" />

                        {/* Duration badge */}
                        <div className="absolute top-4 left-4">
                          <div className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                            {item.duration_days} Days &bull; {item.duration_nights} Nights
                          </div>
                        </div>

                        {/* Wishlist — only for authenticated users */}
                        {isAuthenticated && !isSavedError && (
                          <div className="absolute top-4 right-4">
                            <WishlistButton
                              packageSlug={item.slug}
                              isSaved={isPackageSaved(item.slug)}
                              className="bg-black/20 hover:bg-black/40 text-white"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <h3 className="text-xl font-bold mb-4 leading-tight line-clamp-2">
                            {item.title}
                          </h3>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {(item.itineraries ?? []).slice(0, 3).map((it) => (
                              <span
                                key={`${it.day_number}-${it.title}`}
                                className="max-w-[100px] truncate text-[10px] tracking-wide px-2 py-1 rounded-full bg-white/10 text-white/90"
                              >
                                {it.title}
                              </span>
                            ))}
                          </div>

                          <div className="space-y-4 text-sm">
                            <div>
                              <h4 className="font-semibold mb-2 text-white/90">What&apos;s Included</h4>
                              <ul className="grid grid-cols-1 gap-1">
                                {(item.inclusions ?? [])
                                  .filter((inc) => inc.is_included)
                                  .slice(0, 3)
                                  .map((inc) => (
                                    <li
                                      key={inc.description}
                                      className="flex items-center gap-2 text-muted-foreground"
                                    >
                                      <Check className="size-3 text-green-500 shrink-0" aria-hidden />
                                      <span className="truncate">{inc.description}</span>
                                    </li>
                                  ))}
                                {(item.inclusions?.filter((inc) => inc.is_included).length ?? 0) > 3 && (
                                  <li className="text-xs text-muted-foreground pl-5">
                                    +{(item.inclusions?.filter((inc) => inc.is_included).length ?? 0) - 3} more
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleViewPackage(item.slug)}
                          className="w-full mt-6 bg-white text-black hover:bg-neutral-200"
                        >
                          View Package
                          <ArrowRight className="ml-2 size-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Dot indicators */}
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
        )}
      </div>
    </section>
  )
}
