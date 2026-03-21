'use client'

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PriceFilterProps {
    minPrice: string
    maxPrice: string
    onMinPriceChange: (val: string) => void
    onMaxPriceChange: (val: string) => void
    onPriceApply: () => void
}

export function PriceFilter({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    onPriceApply
}: PriceFilterProps) {
    return (
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
            <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={onPriceApply}>
                Apply Price
            </Button>
        </div>
    )
}
