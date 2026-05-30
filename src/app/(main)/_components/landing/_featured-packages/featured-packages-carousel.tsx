"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { FeaturedPackagesCarouselProps } from "../../../_props/landing/featured.props";
import { FeaturedPackageCard } from "../_package-card/package-card";

export function FeaturedPackagesCarousel({
  packages,
  isAuthenticated,
  isSavedError,
  isPackageSaved,
  onViewPackage,
  setCarouselApi,
  carouselApi,
  currentSlide,
}: FeaturedPackagesCarouselProps) {
  return (
    <>
      <Carousel
        setApi={setCarouselApi}
        opts={{
          breakpoints: {
            "(max-width: 768px)": { dragFree: true },
          },
        }}
      >
        <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
          {packages.map((item, idx) => (
            <CarouselItem
              key={item.slug}
              className="max-w-[340px] pl-[20px] lg:max-w-[400px]"
            >
              <FeaturedPackageCard
                package={item}
                isPriority={idx === 0}
                isAuthenticated={isAuthenticated}
                isSaved={isPackageSaved(item.slug)}
                isSavedError={isSavedError}
                onView={onViewPackage}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div
        className="mt-8 flex justify-center gap-4"
        role="tablist"
        aria-label="Package slides"
      >
        {packages.map((pkg, index) => (
          <button
            key={pkg.slug}
            role="tab"
            aria-selected={currentSlide === index}
            aria-label={`Go to slide ${index + 1}: ${pkg.title}`}
            className="group relative flex h-11 w-11 items-center justify-center focus:outline-none"
            onClick={() => carouselApi?.scrollTo(index)}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors group-hover:bg-white/80 ${
                currentSlide === index ? "bg-white" : "bg-neutral-700"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
export default FeaturedPackagesCarousel;
