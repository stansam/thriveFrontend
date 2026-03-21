'use client'

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { PackageDTO } from "@/lib/dtos/package.dto"
import { useAutocompleteSearch } from "@/lib/hooks/features/use-autocomplete-search"
import { SearchAutocompleteDropdown } from "./search-autocomplete-dropdown"

interface SearchAutocompleteProps {
    className?: string
    placeholder?: string
    onSelect?: (value: string) => void
    value?: string
    onChange?: (value: string) => void
}

export function SearchAutocomplete({
    className,
    placeholder = "Search for trips, destinations...",
    onSelect,
    value,
    onChange
}: SearchAutocompleteProps) {
    const [rawQuery, setRawQuery] = React.useState(value || "")
    const [debouncedQuery, setDebouncedQuery] = React.useState(value || "")
    const [isOpen, setIsOpen] = React.useState(false)
    const router = useRouter()
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (value !== undefined) setRawQuery(value)
    }, [value])

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(rawQuery)
        }, 300)
        return () => clearTimeout(handler)
    }, [rawQuery])

    const { data: res, isLoading } = useAutocompleteSearch(debouncedQuery)
    const data = res?.packages || []

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (item: PackageDTO) => {
        const selectedValue = item.title
        setRawQuery(selectedValue)
        if (onChange) onChange(selectedValue)
        setIsOpen(false)
        if (onSelect) {
            onSelect(selectedValue)
        } else {
            router.push(`/packages/${item.slug}`)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setRawQuery(val)
        if (onChange) onChange(val)
        if (val.trim().length > 1) setIsOpen(true)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && rawQuery.trim()) {
            setIsOpen(false)
            router.push(`/packages?q=${encodeURIComponent(rawQuery)}`)
        }
    }

    return (
        <div ref={wrapperRef} className={cn("relative w-full z-50", className)}>
            <div className="rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm">
                <div className="flex items-center px-3 relative">
                    <Search className="h-4 w-4 text-neutral-400 absolute left-3" />
                    <input
                        id="search-autocomplete-input"
                        placeholder={placeholder}
                        value={rawQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => rawQuery.trim().length > 1 && setIsOpen(true)}
                        className="flex h-11 w-full rounded-md bg-transparent py-3 pl-8 pr-3 text-sm outline-none placeholder:text-neutral-400 text-white disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0"
                        autoComplete="off"
                    />
                </div>

                {isOpen && (
                    <SearchAutocompleteDropdown
                        loading={isLoading && rawQuery === debouncedQuery}
                        query={rawQuery}
                        data={data}
                        onSelect={handleSelect}
                    />
                )}
            </div>
        </div>
    )
}