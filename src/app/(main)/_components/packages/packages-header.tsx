'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { SearchAutocomplete } from "../search-autocomplete"

export function PackagesHeader() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSearchSelect = (val: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (val) {
            params.set('q', val)
        } else {
            params.delete('q')
        }
        router.push(`/packages?${params.toString()}`)
    }

    return (
        <React.Fragment>
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-neutral-400 font-medium mb-4">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link href="/" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li><ChevronRight className="h-4 w-4 text-neutral-600" /></li>
                    <li className="text-white">Packages</li>
                </ol>
            </nav>

            {/* Top Search Bar */}
            <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-3xl font-bold">Explore Packages</h1>
                <div className="w-full relative">
                    <SearchAutocomplete
                        placeholder="Explore destinations, tours or hotels..."
                        className="bg-neutral-900 border-neutral-800"
                        onSelect={handleSearchSelect}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}
