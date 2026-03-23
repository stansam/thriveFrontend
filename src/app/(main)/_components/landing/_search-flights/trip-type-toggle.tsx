'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import type { TripTypeToggleProps } from '../../../_props/landing/search-flights.props'

export function TripTypeToggle({ control }: TripTypeToggleProps) {
    return (
        <div className="flex justify-center mb-4">
            <FormField
                control={control}
                name="tripType"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="round-trip" id="round-trip" className="border-white text-white" />
                                    <Label htmlFor="round-trip" className="text-white">Round Trip</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="one-way" id="one-way" className="border-white text-white" />
                                    <Label htmlFor="one-way" className="text-white">One Way</Label>
                                </div>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    )
}
