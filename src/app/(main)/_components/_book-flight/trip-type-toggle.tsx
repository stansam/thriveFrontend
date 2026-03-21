'use client'

/**
 * trip-type-toggle.tsx
 * Pure form field component — round-trip / one-way radio group.
 * FORMS.md: uses FormField + control; no local state.
 */

import type { Control } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import type { BookFlightFormValues } from '@/lib/types/flight-form.types'

interface TripTypeToggleProps {
    control: Control<BookFlightFormValues>
}

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
