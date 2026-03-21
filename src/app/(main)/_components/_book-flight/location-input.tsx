'use client'

/**
 * location-input.tsx
 * Pure presentational component — single location input with autocomplete dropdown.
 * COMPONENTS.md: no hooks, no fetching; props-only.
 */

import { Building, MapPin, Plane } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LocationResult } from '@/lib/types/flight-form.types'
import type { UseFormReturn } from 'react-hook-form'
import type { BookFlightFormValues } from '@/lib/types/flight-form.types'

interface LocationInputProps {
    label: string
    placeholder: string
    id: 'from' | 'to'
    form: UseFormReturn<BookFlightFormValues>
    inputValue: string
    onInputChange: (v: string) => void
    onFocus: () => void
    onBlur: () => void
    showDropdown: boolean
    results: LocationResult[]
    isSearching: boolean
    debouncedValue: string
    onSelectLocation: (location: LocationResult) => void
}

export function LocationInput({
    label, placeholder, id, form, inputValue, onInputChange,
    onFocus, onBlur, showDropdown, results, isSearching, debouncedValue, onSelectLocation,
}: LocationInputProps) {
    const hasError = !!form.formState.errors[id]

    return (
        <div className="relative group">
            <Label htmlFor={id} className="text-xs text-neutral-400">{label}</Label>
            <input type="hidden" {...form.register(id)} />
            <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                    id={id}
                    placeholder={placeholder}
                    className="pl-8 bg-black/50 border-white/10 focus:border-white/30"
                    value={inputValue}
                    aria-invalid={hasError}
                    onChange={(e) => { onInputChange(e.target.value) }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
            {hasError && (
                <span className="text-xs text-red-400">{form.formState.errors[id]?.message as string}</span>
            )}
            {showDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-neutral-900 border border-white/10 rounded-md z-50 max-h-60 overflow-y-auto">
                    {isSearching ? (
                        <div className="p-3 text-sm text-neutral-400 text-center">Searching...</div>
                    ) : results.length > 0 ? (
                        results.map((location) => (
                            <div
                                key={`${location.iataCode}-${location.type}`}
                                className="p-2 text-sm hover:bg-white/10 cursor-pointer flex items-center gap-2"
                                onClick={() => onSelectLocation(location)}
                            >
                                {location.type === 'CITY'
                                    ? <Building className="h-4 w-4 text-neutral-400" />
                                    : <Plane className="h-4 w-4 text-neutral-400" />}
                                <div>
                                    <span className="font-medium">{location.name}</span>
                                    <span className="text-neutral-400 ml-1">({location.iataCode})</span>
                                    <div className="text-xs text-neutral-500">
                                        {location.city !== location.name ? `${location.city}, ` : ''}{location.country}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : debouncedValue.length >= 2 ? (
                        <div className="p-3 text-sm text-neutral-400 text-center">No results found</div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
