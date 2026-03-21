'use client'

/**
 * use-location-search.ts
 * Custom hook — owns all location autocomplete state and side effects.
 * DATA_FLOW.md: components never call APIs; hooks call services.
 */

import { useState, useEffect } from 'react'

import { useDebounce } from '@/lib/hooks/shared/use-debounce'
import { flightService } from '@/lib/services/flight-service'
import type { LocationResult } from '@/lib/types/flight-form.types'

interface UseLocationSearchOptions {
    field: 'from' | 'to'
    setValue: (field: 'from' | 'to', value: string) => void
}

export interface UseLocationSearchReturn {
    inputValue: string
    setInputValue: (v: string) => void
    results: LocationResult[]
    isSearching: boolean
    showDropdown: boolean
    setShowDropdown: (v: boolean) => void
    handleSelect: (location: LocationResult) => void
    debouncedValue: string
}

export function useLocationSearch({ field, setValue }: UseLocationSearchOptions): UseLocationSearchReturn {
    const [inputValue, setInputValue] = useState('')
    const [results, setResults] = useState<LocationResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    const debouncedValue = useDebounce(inputValue, 300)

    useEffect(() => {
        const search = async () => {
            if (debouncedValue.length < 2) {
                setResults([])
                return
            }
            setIsSearching(true)
            try {
                const response = await flightService.searchLocations(debouncedValue)
                if (response.success) {
                    setResults(response.data as LocationResult[])
                }
            } catch (error) {
                console.error(`Failed to search ${field}:`, error)
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }
        void search()
    }, [debouncedValue, field])

    const handleSelect = (location: LocationResult) => {
        const displayValue = `${location.name} (${location.iataCode})`
        setInputValue(displayValue)
        setValue(field, location.iataCode)
        setShowDropdown(false)
    }

    return { inputValue, setInputValue, results, isSearching, showDropdown, setShowDropdown, handleSelect, debouncedValue }
}
