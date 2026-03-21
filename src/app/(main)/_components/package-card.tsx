'use client'

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar, Star, ArrowRight } from "lucide-react"
import { PackageDTO } from "@/lib/dtos/package.dto"
import { PackageCardImage } from "./package-card-image"

interface PackageCardProps {
    pkg: PackageDTO
    className?: string
    isSaved?: boolean
    layoutType?: 'grid' | 'list'
}

export function PackageCard({ pkg, className, isSaved = false, layoutType = 'grid' }: PackageCardProps) {
    const isList = layoutType === 'list'

    return (
        <Card className={cn(
            "flex overflow-hidden bg-white/5 border-white/10 text-white hover:border-emerald-500/50 transition-all duration-300",
            isList ? "flex-col sm:flex-row h-auto" : "flex-col h-full",
            className
        )}>
            <PackageCardImage pkg={pkg} isSaved={isSaved} isList={isList} />

            <div className="flex flex-col grow">
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{pkg.title}</h3>
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
                        <p className="text-xl font-bold text-white">
                            {pkg.starting_price !== undefined ? `$${pkg.starting_price}` : 'Explore'}
                        </p>
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