'use client'

import { Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RatingFilterProps } from "../../../_props/packages"


export function RatingFilter({ rating, onRatingChange }: RatingFilterProps) {
    return (
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
                            {star} Stars 
                            <span className="flex">
                                {Array(star).fill(0).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                ))}
                            </span>
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    )
}
