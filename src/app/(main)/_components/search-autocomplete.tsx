'use client'

import * as React from "react"
import { Search, Loader2, MapPin, Calendar, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { MainService } from "@/lib/services/main.service"
import { PackageDTO, GetPackagesResponseDTO } from "@/lib/dtos/package.dto"

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
    const [query, setQuery] = React.useState(value || "")
    const [data, setData] = React.useState<PackageDTO[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)

    const wrapperRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (value !== undefined) {
            setQuery(value)
        }
    }, [value])

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true)
                setIsOpen(true)
                try {
                    const res = await MainService.searchPackages({ q: query, limit: 5 }) as GetPackagesResponseDTO;
                    if (res.packages) {
                        setData(res.packages)
                    } else {
                        setData([])
                    }
                } catch (error) {
                    console.error("Search error", error)
                    setData([])
                } finally {
                    setLoading(false)
                }
            } else {
                setData([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const handleSelect = (item: PackageDTO) => {
        const selectedValue = item.title;
        setQuery(selectedValue)
        if (onChange) onChange(selectedValue)
        setIsOpen(false)
        if (onSelect) {
            onSelect(selectedValue)
        } else {
            router.push(`/packages/${item.slug}`)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (onChange) onChange(val);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (query.trim()) {
                setIsOpen(false)
                router.push(`/packages?q=${encodeURIComponent(query)}`)
            }
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
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.trim().length > 1 && setIsOpen(true)}
                        className="flex h-11 w-full rounded-md bg-transparent py-3 pl-8 pr-3 text-sm outline-none placeholder:text-neutral-400 text-white disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0"
                        autoComplete="off"
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-full rounded-md border border-white/10 bg-black/90 shadow-2xl overflow-hidden z-60">
                        <div className="max-h-[300px] overflow-y-auto">
                            {loading && (
                                <div className="py-6 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                                </div>
                            )}

                            {!loading && data.length === 0 && query.length > 1 && (
                                <div className="py-6 text-center text-sm text-neutral-400">
                                    No trips found. Press Enter to search.
                                </div>
                            )}

                            {!loading && data.length > 0 && (
                                <div className="p-2 text-neutral-400">
                                    <h4 className="px-2 py-1.5 text-xs font-semibold text-neutral-500">Suggestions</h4>
                                    {data.map((item) => (
                                        <div
                                            key={item.slug}
                                            onClick={() => handleSelect(item)}
                                            className="cursor-pointer hover:bg-white/10 text-white flex flex-col items-start gap-1 p-2 rounded-sm transition-colors"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-medium text-base">{item.title}</span>
                                                {/* Price mapping - typically we format or display something if available, omit price if not explicitly in DTO without a mapped source, assuming logic applies. For UI sake: */}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-neutral-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {item.city}, {item.country}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.duration_days} Days
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}