'use client'

import * as React from "react"
import { Badge } from "../../../components/ui/badge"
import { MapPin } from "lucide-react"
import { WishlistButton } from "../../../components/blocks/wishlist-button"
import type { PackageDTO } from "../../../lib/dtos/package.dto"
import { cn } from "../../../lib/utils"
import Image from "next/image"

interface PackageCardImageProps {
    pkg: PackageDTO
    isSaved: boolean
    isList: boolean
}

export function PackageCardImage({ pkg, isSaved, isList }: PackageCardImageProps) {
    const imageUrl = pkg.media?.find((m: { is_featured: boolean; image_url: string }) => m.is_featured)?.image_url || 

        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    
    return (
        <div className={cn("relative overflow-hidden shrink-0", isList ? "h-64 sm:h-full sm:w-72" : "h-48 w-full")}>
            <Image
                src={imageUrl}
                alt={pkg.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
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
                    {pkg.city || 'Unknown'}, {pkg.country || 'Unknown'}
                </div>
            </div>
        </div>
    )
}
