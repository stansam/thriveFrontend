'use client'

import { Loader2 } from "lucide-react"
import { PackageCard } from "./package-card"
import type { PackagesGridListProps } from "../../_props/packages"

export function PackagesGridList({ packages, isLoading, viewMode, isPackageSaved }: PackagesGridListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        )
    }

    if (!isLoading && packages.length === 0) {
        return (
            <div className="text-center py-20 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <h3 className="text-xl font-medium mb-2">No trips found</h3>
                <p className="text-neutral-400">Try adjusting your filters or search for something else.</p>
            </div>
        )
    }

    return (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {packages.map((pkg) => (
                <PackageCard 
                    key={pkg.slug} 
                    pkg={pkg} 
                    isSaved={isPackageSaved(pkg.slug)} 
                    layoutType={viewMode} 
                />
            ))}
        </div>
    )
}
