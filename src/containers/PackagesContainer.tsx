'use client'

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useMyPackages, useSearchPackages } from '@/lib/hooks/shared/use-packages'
import { PackagesFilterSidebar } from "@/app/(main)/_components/packages/packages-filter-sidebar"
import { PackagesGridList } from "@/app/(main)/_components/packages/packages-grid-list"
import { PackagesPagination } from "@/app/(main)/_components/packages/packages-pagination"
import { PackagesContainerHeader } from "@/app/(main)/_components/packages/packages-container-header"
import { usePackagesFilters } from "@/lib/hooks/features/use-packages-filters"

export function PackagesContainer() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    
    const { 
        request, currentPage, viewMode, setViewMode, 
        formState, setters, handlers 
    } = usePackagesFilters()

    const { data: result, isLoading } = useSearchPackages(request)
    const packages = result?.packages || []
    const totalCount = result?.pagination?.total || 0
    const totalPages = result?.pagination?.total_pages || 1
    
    const { data: savedPackages } = useMyPackages()
    const isPackageSaved = (id: string) => savedPackages?.some(p => p.slug === id) ?? false

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            <div className="flex-1 order-2 lg:order-1">
                <PackagesContainerHeader 
                    isLoading={isLoading} 
                    totalCount={totalCount} 
                    query={query} 
                    viewMode={viewMode} 
                    setViewMode={setViewMode} 
                />

                <PackagesGridList 
                    packages={packages} 
                    isLoading={isLoading} 
                    viewMode={viewMode} 
                    isPackageSaved={isPackageSaved} 
                />

                <PackagesPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoading}
                    onPageChange={handlers.onPageChange}
                />
            </div>

            <div className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
                <PackagesFilterSidebar
                    minPrice={formState.minPrice} maxPrice={formState.maxPrice}
                    onMinPriceChange={setters.setMinPrice} onMaxPriceChange={setters.setMaxPrice}
                    minDays={formState.minDays} maxDays={formState.maxDays}
                    onMinDaysChange={setters.setMinDays} onMaxDaysChange={setters.setMaxDays}
                    rating={formState.rating} onRatingChange={handlers.onRatingChange}
                    onPriceApply={handlers.onPriceApply} onDurationApply={handlers.onDurationApply}
                    onResetFilters={handlers.onResetFilters}
                />
            </div>
        </div>
    )
}

