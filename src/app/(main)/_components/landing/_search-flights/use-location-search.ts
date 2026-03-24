'use client'

import { useState, useEffect } from 'react'

import { useDebounce } from '@/lib/hooks/shared/use-debounce'
import { flightService } from '@/lib/services/flight-service'
import type { LocationResult } from '../../../_types/landing/search-flights.types'
import type { UseLocationSearchOptions } from '../../../_types/landing/search-flights.types'
import type { UseLocationSearchReturn } from '../../../_props/landing/search-flights.props'

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
