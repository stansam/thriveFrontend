'use client'

import * as React from "react"
import { Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "../seperator"

interface PackagesFilterSidebarProps {
    minPrice: string
    maxPrice: string
    onMinPriceChange: (val: string) => void
    onMaxPriceChange: (val: string) => void
    onPriceApply: () => void

    minDays: string
    maxDays: string
    onMinDaysChange: (val: string) => void
    onMaxDaysChange: (val: string) => void
    onDurationApply: () => void

    rating: string[]
    onRatingChange: (checked: boolean, value: string) => void
    onResetFilters: () => void
}

export function PackagesFilterSidebar({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    onPriceApply,
    minDays,
    maxDays,
    onMinDaysChange,
    onMaxDaysChange,
    onDurationApply,
    rating,
    onRatingChange,
    onResetFilters
}: PackagesFilterSidebarProps) {
    return (
        <div className="lg:sticky lg:top-24 bg-neutral-900/50 backdrop-blur-md border border-white/10 p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Filter className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-lg">Filters</h3>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <Label>Price Range (USD)</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-neutral-400">Min</Label>
                        <Input 
                            type="number" 
                            placeholder="0" 
                            value={minPrice} 
                            onChange={(e) => onMinPriceChange(e.target.value)} 
                            className="h-8 bg-neutral-800/50 border-white/10"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-neutral-400">Max</Label>
                        <Input 
                            type="number" 
                            placeholder="Any" 
                            value={maxPrice} 
                            onChange={(e) => onMaxPriceChange(e.target.value)} 
                            className="h-8 bg-neutral-800/50 border-white/10"
                        />
                    </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={onPriceApply}>Apply Price</Button>
            </div>

            <Separator className="bg-white/10" />

            {/* Duration */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <Label>Duration (Days)</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-neutral-400">Min</Label>
                        <Input 
                            type="number" 
                            placeholder="1" 
                            value={minDays} 
                            onChange={(e) => onMinDaysChange(e.target.value)} 
                            className="h-8 bg-neutral-800/50 border-white/10"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-neutral-400">Max</Label>
                        <Input 
                            type="number" 
                            placeholder="Any" 
                            value={maxDays} 
                            onChange={(e) => onMaxDaysChange(e.target.value)} 
                            className="h-8 bg-neutral-800/50 border-white/10"
                        />
                    </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={onDurationApply}>Apply Duration</Button>
            </div>

            <Separator className="bg-white/10" />

            {/* Hotel Rating */}
            <div className="space-y-3">
                <Label>Hotel Rating</Label>
                <div className="grid grid-cols-1 gap-2">
                    {[5, 4, 3].map((star) => (
                        <div key={star} className="flex items-center space-x-2">
                            <Checkbox
                                id={`star-${star}`}
                                checked={rating.includes(star.toString())}
                                onCheckedChange={(checked) => onRatingChange(checked as boolean, star.toString())}
                                className="border-neutral-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                            <Label htmlFor={`star-${star}`} className="font-normal text-neutral-300 flex items-center gap-1">
                                {star} Stars <span className="flex">{Array(star).fill(0).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

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
