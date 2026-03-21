'use client'

import * as React from "react"
import { LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PackagesContainerHeaderProps {
    isLoading: boolean
    totalCount: number
    query: string
    viewMode: 'grid' | 'list'
    setViewMode: (mode: 'grid' | 'list') => void
}

export function PackagesContainerHeader({ isLoading, totalCount, query, viewMode, setViewMode }: PackagesContainerHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">
                {isLoading ? 'Searching...' : `${totalCount} Trips Found`} {query && `for "${query}"`}
            </h2>
            <div className="flex items-center gap-2 bg-neutral-900/50 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto">
                <Button
                    variant="ghost" size="sm" onClick={() => setViewMode('grid')}
                    className={`h-8 px-2 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                >
                    <LayoutGrid className="h-4 w-4 mr-2" /> Grid
                </Button>
                <Button
                    variant="ghost" size="sm" onClick={() => setViewMode('list')}
                    className={`h-8 px-2 ${viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                >
                    <List className="h-4 w-4 mr-2" /> List
                </Button>
            </div>
        </div>
    )
}
