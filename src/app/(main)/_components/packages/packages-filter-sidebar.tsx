'use client'

import * as React from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "../seperator"
import { PackagesFilterSidebarProps } from "@/app/(main)/_types/packages.types"
import { PriceFilter } from "./filters/price-filter"
import { DurationFilter } from "./filters/duration-filter"
import { RatingFilter } from "./filters/rating-filter"

export function PackagesFilterSidebar({
    minPrice, maxPrice, onMinPriceChange, onMaxPriceChange, onPriceApply,
    minDays, maxDays, onMinDaysChange, onMaxDaysChange, onDurationApply,
    rating, onRatingChange, onResetFilters
}: PackagesFilterSidebarProps) {
    return (
        <div className="lg:sticky lg:top-24 bg-neutral-900/50 backdrop-blur-md border border-white/10 p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Filter className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-lg">Filters</h3>
            </div>

            <PriceFilter 
                minPrice={minPrice} maxPrice={maxPrice} 
                onMinPriceChange={onMinPriceChange} onMaxPriceChange={onMaxPriceChange} 
                onPriceApply={onPriceApply} 
            />

            <Separator className="bg-white/10" />

            <DurationFilter 
                minDays={minDays} maxDays={maxDays} 
                onMinDaysChange={onMinDaysChange} onMaxDaysChange={onMaxDaysChange} 
                onDurationApply={onDurationApply} 
            />

            <Separator className="bg-white/10" />

            <RatingFilter rating={rating} onRatingChange={onRatingChange} />

            <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white hover:text-gray-700 text-black mt-4"
                onClick={onResetFilters}
            >
                Reset Filters
            </Button>
        </div>
    )
}
