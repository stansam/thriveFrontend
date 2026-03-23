"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, MessageCircle } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

import { WishlistButton } from "@/components/blocks/wishlist-button";
import { PackageHeroProps } from "../../_props/package-details";

export function PackageHero({
    title,
    images,
    durationDays,
    durationNights,
    startingPrice,
    className,
    packageSlug
}: PackageHeroProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const [isSaved, setIsSaved] = React.useState(false);
    
    const displayImages = images.length > 0
        ? images
        : ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"];

    return (
        <div className={cn("relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-black", className)}>
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    loop: true,
                    align: "start"
                }}
            >
                <CarouselContent className="h-full">
                    {displayImages.map((img, index) => (
                        <CarouselItem key={index} className="h-full w-full pl-0">
                            <div className="relative w-full h-full">
                                <img
                                    src={img}
                                    alt={`${title} - Image ${index + 1}`}
                                    className="object-cover w-full h-full opacity-90"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90" />
                                <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className="hidden md:block">
                    <CarouselPrevious className="left-8 bg-black/20 hover:bg-black/40 border-white/20 text-white backdrop-blur-sm" />
                    <CarouselNext className="right-8 bg-black/20 hover:bg-black/40 border-white/20 text-white backdrop-blur-sm" />
                </div>
            </Carousel>

            {packageSlug && (
                <div className="absolute top-24 right-4 md:right-8 z-30">
                    <WishlistButton
                        packageSlug={packageSlug}
                        isSaved={isSaved}
                        className="bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-md"
                    />
                </div>
            )}

            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24 px-4 md:px-16 container mx-auto pointer-events-none">
                <div className="max-w-4xl space-y-4 md:space-y-6 pointer-events-auto">
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 backdrop-blur-md px-4 py-2 text-sm uppercase tracking-wider font-semibold">
                            <Clock className="w-4 h-4 mr-2" />
                            {durationDays} Days • {durationNights} Nights
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-md px-4 py-2 text-sm uppercase tracking-wider font-semibold">
                            Flights Not Included
                        </Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-lg">
                        {title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 pt-4">
                        <div className="space-y-1">
                            <p className="text-neutral-300 text-sm font-medium uppercase tracking-widest">
                                Starting From
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-bold text-white">
                                    ${startingPrice}
                                </span>
                                <span className="text-neutral-400 text-lg">/ person</span>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-16 bg-white/20" />

                        <div className="flex gap-6 text-sm md:text-base text-neutral-200">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span>24/7 Concierge<br />Assistance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                                    <Phone className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span>Instant<br />Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}