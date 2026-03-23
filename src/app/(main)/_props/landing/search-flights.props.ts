import type { LocationResult } from '../../_types/landing/search-flights.types'
import type { UseFormReturn } from 'react-hook-form'
import type { SearchFlightsFormValues } from '../../_types/landing/search-flights.types'
import type { Control } from 'react-hook-form'

export interface LocationInputProps {
    label: string
    placeholder: string
    id: 'from' | 'to'
    form: UseFormReturn<SearchFlightsFormValues>
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

export interface SearchFlightsFormProps {
    className?: string
}

export interface PassengerCounterProps {
    adults: number
    numChildren: number
    onAdultsChange: (v: number) => void
    onChildrenChange: (v: number) => void
}

export interface CounterGroupProps {
    label: string
    value: number
    min: number
    onDecrement: () => void
    onIncrement: () => void
}


export interface TripTypeToggleProps {
    control: Control<SearchFlightsFormValues>
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