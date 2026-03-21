import * as React from "react"
import { Loader2, MapPin, Calendar } from "lucide-react"
import type { PackageDTO } from "@/lib/dtos/package.dto"

interface SearchAutocompleteDropdownProps {
    loading: boolean
    query: string
    data: PackageDTO[]
    onSelect: (item: PackageDTO) => void
}

export function SearchAutocompleteDropdown({
    loading,
    query,
    data,
    onSelect
}: SearchAutocompleteDropdownProps) {
    return (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full rounded-md border border-white/10 bg-black/90 shadow-2xl overflow-hidden z-60">
            <div className="max-h-[300px] overflow-y-auto">
                {loading && (
                    <div className="py-6 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                    </div>
                )}

                {!loading && data.length === 0 && query.trim().length > 1 && (
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
                                onClick={() => onSelect(item)}
                                className="cursor-pointer hover:bg-white/10 text-white flex flex-col items-start gap-1 p-2 rounded-sm transition-colors"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-base">{item.title}</span>
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
    )
}
