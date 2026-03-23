'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { SearchAutocomplete } from "../_components/search-autocomplete"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { SearchTripsFormProps } from "../_props/package.props"

export function SearchTripsForm({ className }: SearchTripsFormProps) {
    const router = useRouter()
    
    const [duration, setDuration] = React.useState<{ min?: string, max?: string }>({})
    const [budget, setBudget] = React.useState<{ min?: string, max?: string }>({})
    const [q, setQ] = React.useState("")

    const handleSearch = () => {
        const params = new URLSearchParams()
        
        if (q) params.append('q', q)

        if (duration.min) params.append('min_days', duration.min)
        if (duration.max) params.append('max_days', duration.max)

        if (budget.min) params.append('min_price', budget.min)
        if (budget.max) params.append('max_price', budget.max)

        router.push(`/packages?${params.toString()}`)
    }

    const formatDurationLabel = () => {
        if (!duration.min && !duration.max) return "Any Duration"
        if (duration.min && duration.max) return `${duration.min} - ${duration.max} Days`
        if (duration.min) return `Min ${duration.min} Days`
        if (duration.max) return `Max ${duration.max} Days`
        return "Any Duration"
    }

    const formatBudgetLabel = () => {
        if (!budget.min && !budget.max) return "Any Budget"
        if (budget.min && budget.max) return `$${budget.min} - $${budget.max}`
        if (budget.min) return `Min $${budget.min}`
        if (budget.max) return `Max $${budget.max}`
        return "Any Budget"
    }

    return (
        <Card className={cn("w-[90vw] max-w-[450px] p-6 bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-2xl", className)}>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Find Your Next Trip</h2>
                    <p className="text-sm text-neutral-400">Discover curated packages and exclusive deals.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-neutral-300 tracking-wider">Destination / Package</Label>
                        <SearchAutocomplete value={q} onChange={setQ} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-300 tracking-wider">Duration</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start text-left font-normal bg-black/50 border-white/10 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                                    >
                                        {formatDurationLabel()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-neutral-900 border-white/10 text-white">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Duration (Days)</h4>
                                            <p className="text-xs text-neutral-400">
                                                Set your minimum and maximum days.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="min-days" className="text-xs">Min</Label>
                                                <Input 
                                                    id="min-days" 
                                                    type="number" 
                                                    min="1"
                                                    value={duration.min || ''} 
                                                    onChange={(e) => setDuration({ ...duration, min: e.target.value })} 
                                                    className="bg-black/50 border-white/10 text-white h-8" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max-days" className="text-xs">Max</Label>
                                                <Input 
                                                    id="max-days" 
                                                    type="number" 
                                                    min="1"
                                                    value={duration.max || ''} 
                                                    onChange={(e) => setDuration({ ...duration, max: e.target.value })} 
                                                    className="bg-black/50 border-white/10 text-white h-8" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-neutral-300 tracking-wider">Budget</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start text-left font-normal bg-black/50 border-white/10 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                                    >
                                        {formatBudgetLabel()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-neutral-900 border-white/10 text-white">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Budget (USD)</h4>
                                            <p className="text-xs text-neutral-400">
                                                Set your minimum and maximum budget.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="min-price" className="text-xs">Min</Label>
                                                <Input 
                                                    id="min-price" 
                                                    type="number" 
                                                    min="0"
                                                    step="100"
                                                    value={budget.min || ''} 
                                                    onChange={(e) => setBudget({ ...budget, min: e.target.value })} 
                                                    className="bg-black/50 border-white/10 text-white h-8" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="max-price" className="text-xs">Max</Label>
                                                <Input 
                                                    id="max-price" 
                                                    type="number" 
                                                    min="0"
                                                    step="100"
                                                    value={budget.max || ''} 
                                                    onChange={(e) => setBudget({ ...budget, max: e.target.value })} 
                                                    className="bg-black/50 border-white/10 text-white h-8" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Label className="text-xs font-medium text-neutral-300 tracking-wider mb-2 block">Travel Style</Label>
                        <RadioGroup defaultValue="all" className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="r-all" className="border-white text-emerald-500" />
                                <Label htmlFor="r-all" className="text-sm text-neutral-300">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="international" id="r-int" className="border-white text-emerald-500" />
                                <Label htmlFor="r-int" className="text-sm text-neutral-300">International</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="domestic" id="r-dom" className="border-white text-emerald-500" />
                                <Label htmlFor="r-dom" className="text-sm text-neutral-300">Domestic</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <Button
                    onClick={handleSearch}
                    className="w-full bg-white text-black hover:bg-neutral-200 font-semibold h-11 transition-all duration-300"
                >
                    Explore Packages
                </Button>
            </div>
        </Card>
    )
}
