'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import { useFeaturedPackages, useMyPackages, FALLBACK_PACKAGES } from '@/lib/hooks/shared/use-packages'
import { useAuth } from '@/lib/auth-context'
import type { PackageDTO } from '@/lib/dtos/package.dto'

import { PackageCard } from '../_components/_package-card/package-card'
import { PackageCardSkeleton } from '../_components/_package-card/package-card-skeleton'

const IS_DEV = process.env.NODE_ENV === 'development'

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
        return () => {
            carouselApi.off('select', updateSelection)
        }
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
                            onClick={() => {
                                carouselApi?.scrollPrev()
                            }}
                            disabled={!canScrollPrev}
                            aria-label="Previous package"
                            className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
                        >
                            <ArrowLeft className="size-5" aria-hidden />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext()
                            }}
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
                {/* Loading state - using skeleton matching content  */}
                {isLoading && (
                    <div
                        role="status"
                        aria-label="Loading featured tours"
                        className="flex w-full gap-5 overflow-hidden pl-4 lg:pl-[max(8rem,calc(50vw-700px))]"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <PackageCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {isError && !IS_DEV && (
                    <div className="flex flex-col justify-center items-center h-64 text-error-500 gap-2">
                        <AlertCircle className="h-8 w-8" aria-hidden />
                        <p className="text-white">Unable to load featured tours at this time.</p>
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

                {/* Carousel */}
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
                            {/* Prev arrow */}
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

                            {/* Next arrow */}
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
                                        <PackageCard
                                            package={item}
                                            isPriority={packages.indexOf(item) === 0}
                                            isAuthenticated={isAuthenticated}
                                            isSaved={isPackageSaved(item.slug)}
                                            isSavedError={isSavedError}
                                            onView={handleViewPackage}
                                        />
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
