'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import {
    SearchFlightsFormSchema,
    type SearchFlightsFormValues,
} from '../../../_types/landing/search-flights.types'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { TripTypeToggle } from '../_search-flights/trip-type-toggle'
import { LocationInput } from '../_search-flights/location-input'
import { PassengerCounter } from '../_search-flights/passenger-counter'
import { useLocationSearch } from '../_search-flights/use-location-search'
import { CABIN_CLASS_MAP, CABIN_OPTIONS } from '../../../_constants/landing/search-flights.constants'
import { SearchFlightsFormProps } from '../../../_props/landing/search-flights.props'

export function SearchFlightsForm({ className }: SearchFlightsFormProps) {
    const router = useRouter()
    const form = useForm<SearchFlightsFormValues>({
        resolver: zodResolver(SearchFlightsFormSchema),
        defaultValues: { tripType: 'round-trip', adults: 1, children: 0, cabinClass: 'ECONOMY' },
    })
    const { watch, setValue, control, handleSubmit } = form
    const tripType = watch('tripType')
    const adults = watch('adults')
    const children = watch('children')

    const origin = useLocationSearch({ field: 'from', setValue })
    const destination = useLocationSearch({ field: 'to', setValue })

    const onSubmit = (data: SearchFlightsFormValues) => {
        const params = new URLSearchParams({
            origin: data.from,
            destination: data.to,
            departureDate: data.departureDate.toISOString().split('T')[0] ?? '',
            adults: data.adults.toString(),
            travelClass: CABIN_CLASS_MAP[data.cabinClass] ?? 'e',
        })
        if (data.tripType === 'round-trip' && data.returnDate) {
            params.append('returnDate', data.returnDate.toISOString().split('T')[0] ?? '')
        }
        if (data.children > 0) params.append('children', data.children.toString())
        router.push(`/flights/results?${params.toString()}`)
    }

    return (
        <Card className={cn('w-[400px] p-6 bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-2xl', className)}>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4 text-center">Book Your Flight</h2>
                    <TripTypeToggle control={control} />

                    <div className="grid grid-cols-2 gap-4">
                        <LocationInput label="From" placeholder="Origin" id="from" form={form}
                            inputValue={origin.inputValue} onInputChange={(v) => { origin.setInputValue(v); origin.setShowDropdown(true) }}
                            onFocus={() => origin.setShowDropdown(true)}
                            onBlur={() => setTimeout(() => origin.setShowDropdown(false), 200)}
                            showDropdown={origin.showDropdown} results={origin.results}
                            isSearching={origin.isSearching} debouncedValue={origin.debouncedValue}
                            onSelectLocation={origin.handleSelect}
                        />
                        <LocationInput label="To" placeholder="Destination" id="to" form={form}
                            inputValue={destination.inputValue} onInputChange={(v) => { destination.setInputValue(v); destination.setShowDropdown(true) }}
                            onFocus={() => destination.setShowDropdown(true)}
                            onBlur={() => setTimeout(() => destination.setShowDropdown(false), 200)}
                            showDropdown={destination.showDropdown} results={destination.results}
                            isSearching={destination.isSearching} debouncedValue={destination.debouncedValue}
                            onSelectLocation={destination.handleSelect}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PassengerCounter adults={adults} numChildren={children}
                            onAdultsChange={(v) => setValue('adults', v)}
                            onChildrenChange={(v) => setValue('children', v)}
                        />
                        <FormField control={control} name="departureDate" render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2">
                                <FormLabel className="text-xs text-neutral-400">Departure</FormLabel>
                                <DatePicker date={field.value} setDate={field.onChange} className="bg-black/50 border-white/10 text-white w-full" />
                                <FormMessage />
                            </FormItem>
                        )} />
                        {tripType === 'round-trip' && (
                            <FormField control={control} name="returnDate" render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2 col-span-2">
                                    <FormLabel className="text-xs text-neutral-400">Return</FormLabel>
                                    <DatePicker date={field.value} setDate={field.onChange} className="bg-black/50 border-white/10 text-white w-full" />
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}
                    </div>

                    <div className="flex flex-col space-y-2 mt-2">
                        <FormField control={control} name="cabinClass" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs text-neutral-400">Cabin Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-black/50 border-white/10 text-white h-9">
                                            <SelectValue placeholder="Select cabin class" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-neutral-900 text-white border-white/10">
                                        {CABIN_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                    </div>

                    <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 mt-2">
                        <Search className="mr-2 h-4 w-4" /> Search Flights
                    </Button>
                </form>
            </Form>
        </Card>
    )
}
