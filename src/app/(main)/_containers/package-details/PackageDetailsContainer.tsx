"use client";

import * as React from "react";

import { usePackageDetails } from "@/lib/hooks/shared/use-packages";

import { PackageHero } from "@/app/(main)/_components/package-details/package-hero";
import { PackageItinerary } from "@/app/(main)/_components/package-details/package-itinerary";
import { BookingWizard } from "@/app/(main)/_components/package-details/package-booking-wizard";
import { StickyBookBar } from "@/app/(main)/_components/package-details/sticky-package-book-bar";
import FooterSection from "@/app/(main)/_components/landing/footer-section";
import { Separator } from "@/app/(main)/_components/seperator";
import { PackageDetailsLoading } from "@/app/(main)/_components/package-details/PackageDetailsLoading";
import { PackageDetailsError } from "@/app/(main)/_components/package-details/PackageDetailsError";
import { PackageDetailsOverview } from "@/app/(main)/_components/package-details/PackageDetailsOverview";
import { PackageDetailsInclusions } from "@/app/(main)/_components/package-details/PackageDetailsInclusions";
import { PackageDetailsGallery } from "@/app/(main)/_components/package-details/PackageDetailsGallery";
import { PackageDetailsSidebar } from "@/app/(main)/_components/package-details/PackageDetailsSidebar";
import { PackageDetailsContainerProps } from "../../_props/package-details";

export function PackageDetailsContainer({ slug }: PackageDetailsContainerProps) {
    const [isBookingOpen, setIsBookingOpen] = React.useState(false);
    const { data: pkg, error, isLoading } = usePackageDetails(slug);

    if (isLoading) return <PackageDetailsLoading />;
    if (error || !pkg) return <PackageDetailsError />;

    const allImages = [
        ...pkg.media.filter((media) => media.is_featured).map((media) => media.image_url),
        ...pkg.media.filter((media) => !media.is_featured).map((media) => media.image_url)
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-emerald-500/30">
            <main className="pb-24 lg:pb-0">
                <PackageHero
                    title={pkg.title}
                    images={allImages}
                    durationDays={pkg.duration_days}
                    durationNights={pkg.duration_nights}
                    startingPrice={pkg.starting_price}
                    packageSlug={pkg.slug}
                />

                <div className="container mx-auto px-4 py-8 lg:py-16">
                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-24 relative">
                        <div className="flex-1 min-w-0 space-y-12">
                            <PackageDetailsOverview city={pkg.city} country={pkg.country} description={pkg.description} />
                            <Separator className="bg-white/10" />
                            <section id="itinerary">
                                <PackageItinerary itinerary={pkg.itineraries} />
                            </section>
                            <Separator className="bg-white/10" />
                            <PackageDetailsInclusions inclusions={pkg.inclusions} />
                            <PackageDetailsGallery images={allImages} />
                        </div>
                        <PackageDetailsSidebar startingPrice={pkg.starting_price} durationDays={pkg.duration_days} onBookClick={() => setIsBookingOpen(true)} />
                    </div>
                </div>

                <StickyBookBar pkg={{ id: pkg.slug, name: pkg.title, starting_price: pkg.starting_price }} />
                <BookingWizard pkg={pkg} open={isBookingOpen} onOpenChange={setIsBookingOpen} />
            </main>
            <FooterSection />
        </div>
    );
}
