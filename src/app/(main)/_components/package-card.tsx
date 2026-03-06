'use client'

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Star, ArrowRight } from "lucide-react"
import { WishlistButton } from "@/components/blocks/wishlist-button"

import { PackageDTO } from "@/lib/dtos/package.dto"

interface PackageCardProps {
    pkg: PackageDTO
    className?: string
    isSaved?: boolean
    layoutType?: 'grid' | 'list'
}

export function PackageCard({ pkg, className, isSaved = false, layoutType = 'grid' }: PackageCardProps) {
    // Determine image - use fallback if needed
    const imageUrl = pkg.media?.find(m => m.is_featured)?.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"

    const isList = layoutType === 'list'

    return (
        <Card className={cn(
            "flex overflow-hidden bg-white/5 border-white/10 text-white hover:border-emerald-500/50 transition-all duration-300",
            isList ? "flex-col sm:flex-row h-auto" : "flex-col h-full",
            className
        )}>
            <div className={cn("relative overflow-hidden shrink-0", isList ? "h-64 sm:h-full sm:w-72" : "h-48 w-full")}>
                <img
                    src={imageUrl}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {pkg.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-emerald-500 hover:bg-emerald-600 text-white">
                        Featured
                    </Badge>
                )}
                <div className="absolute top-2 left-2 z-10">
                    <WishlistButton
                        packageSlug={pkg.slug}
                        isSaved={isSaved}
                        className="bg-black/20 hover:bg-black/40 text-white"
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <MapPin className="h-3 w-3" />
                        {pkg.city || 'Unknown City'}, {pkg.country || 'Unknown Country'}
                    </div>
                </div>
            </div>

            <div className="flex flex-col grow">
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{pkg.title}</h3>
                        {/* 
                         * DTO doesn't have hotel_rating but we keep the visual for now, 
                         * maybe rating is added later or computed from reviews
                         */}
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            4.5
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 grow flex flex-col justify-between">
                    <p className="text-sm text-neutral-400 line-clamp-3 mb-4">
                        {pkg.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-neutral-300">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {pkg.duration_days} Days / {pkg.duration_nights} Nights
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t border-white/10 flex items-center justify-between mt-auto">
                <div>
                    <p className="text-xs text-neutral-400">Starting from</p>
                    <p className="text-xl font-bold text-white">{(pkg as any).starting_price ? `$${(pkg as any).starting_price}` : 'Explore'}</p>
                </div>
                <Button className="bg-white text-black hover:bg-neutral-200" asChild>
                    <Link href={`/packages/${pkg.slug}`}>
                        View Package <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
            </div>
        </Card>
    )
}