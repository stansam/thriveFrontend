'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { DurationFilterProps } from "../../../_props/packages"


export function DurationFilter({
    minDays,
    maxDays,
    onMinDaysChange,
    onMaxDaysChange,
    onDurationApply
}: DurationFilterProps) {
    return (
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
            <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={onDurationApply}>
                Apply Duration
            </Button>
        </div>
    )
}
