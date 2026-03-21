'use client'

import { useEffect, useState } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import type { PackageDTO } from '@/lib/dtos/package.dto'

import { FeaturedPackagesHeader } from './_featured-packages/featured-packages-header'
import { FeaturedPackagesStates } from './_featured-packages/featured-packages-states'
import { FeaturedPackagesCarousel } from './_featured-packages/featured-packages-carousel'

export interface FeaturedPackagesViewProps {
    packages: PackageDTO[]
    isLoading: boolean
    isError: boolean
    isEmpty: boolean
    displayFallback: boolean
    isAuthenticated: boolean
    isSavedError: boolean
    isPackageSaved: (slug: string) => boolean
    onViewPackage: (slug: string) => void
}

export function FeaturedPackagesView({
    packages,
    isLoading,
    isError,
    isEmpty,
    displayFallback,
    isAuthenticated,
    isSavedError,
    isPackageSaved,
    onViewPackage
}: FeaturedPackagesViewProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

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
            <FeaturedPackagesHeader 
                carouselApi={carouselApi} 
                canScrollPrev={canScrollPrev} 
                canScrollNext={canScrollNext} 
            />

            <div className="w-full">
                <FeaturedPackagesStates isLoading={isLoading} isError={isError} isEmpty={isEmpty} />

                {!isLoading && packages.length > 0 && (
                    <FeaturedPackagesCarousel
                        packages={packages}
                        displayFallback={displayFallback}
                        isAuthenticated={isAuthenticated}
                        isSavedError={isSavedError}
                        isPackageSaved={isPackageSaved}
                        onViewPackage={onViewPackage}
                        setCarouselApi={setCarouselApi}
                        carouselApi={carouselApi}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                        currentSlide={currentSlide}
                    />
                )}
            </div>
        </section>
    )
}
