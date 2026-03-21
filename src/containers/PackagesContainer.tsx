'use client'

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LayoutGrid, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useMyPackages, useSearchPackages } from '@/lib/hooks/shared/use-packages'
import { GetPackagesRequestDTO } from "@/lib/dtos/package.dto"

import { PackagesFilterSidebar } from "@/app/(main)/_components/packages/packages-filter-sidebar"
import { PackagesGridList } from "@/app/(main)/_components/packages/packages-grid-list"
import { PackagesPagination } from "@/app/(main)/_components/packages/packages-pagination"

export function PackagesContainer() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const query = searchParams.get('q') || ''
    
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
    const limit = 12
    
    const urlPage = searchParams.get('current_page')
    const currentPage = urlPage ? Math.max(1, parseInt(urlPage, 10)) : 1

    const [minPrice, setMinPrice] = React.useState<string>("")
    const [maxPrice, setMaxPrice] = React.useState<string>("")
    const [minDays, setMinDays] = React.useState<string>("")
    const [maxDays, setMaxDays] = React.useState<string>("")
    const [rating, setRating] = React.useState<string[]>([])

    React.useEffect(() => {
        setMinPrice(searchParams.get('min_price') || "")
        setMaxPrice(searchParams.get('max_price') || "")
        setMinDays(searchParams.get('min_days') || "")
        setMaxDays(searchParams.get('max_days') || "")

        const hotelR = searchParams.get('hotel_rating')
        if (hotelR) setRating([hotelR])
    }, [searchParams])

    const buildRequest = (): GetPackagesRequestDTO => {
        const req: GetPackagesRequestDTO = {
            limit,
            offset: (currentPage - 1) * limit
        }
        
        const q = searchParams.get('q')
        if (q) req.q = q

        const urlMinP = searchParams.get('min_price')
        const urlMaxP = searchParams.get('max_price')
        if (urlMinP) req.min_price = parseInt(urlMinP)
        if (urlMaxP) req.max_price = parseInt(urlMaxP)

        const urlMinD = searchParams.get('min_days')
        const urlMaxD = searchParams.get('max_days')
        if (urlMinD) req.min_days = parseInt(urlMinD)
        if (urlMaxD) req.max_days = parseInt(urlMaxD)

        return req
    }

    const { data: result, isLoading } = useSearchPackages(buildRequest())
    const packages = result?.packages || []
    
    const pagination = result?.pagination
    const totalCount = pagination?.total || 0
    const totalPages = pagination?.total_pages || 1
    
    const { data: savedPackages } = useMyPackages()
    const isPackageSaved = (id: string) => savedPackages?.some(p => p.slug === id) ?? false

    const updateFilters = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('current_page')
        
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`/packages?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newPage === 1) {
             params.delete('current_page') 
        } else {
             params.set('current_page', newPage.toString())
        }
        router.push(`/packages?${params.toString()}`)
    }

    const handlePriceApply = () => updateFilters({ min_price: minPrice, max_price: maxPrice })
    const handleDurationApply = () => updateFilters({ min_days: minDays, max_days: maxDays })

    const handleRatingChange = (checked: boolean, value: string) => {
        if (checked) {
            setRating([...rating, value])
        } else {
            setRating(rating.filter(r => r !== value))
        }
        // Since original component didn't immediately apply rating, leaving it as state only
    }

    const handleResetFilters = () => {
        setMinPrice("")
        setMaxPrice("")
        setMinDays("")
        setMaxDays("")
        setRating([])
        router.push('/packages')
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            <div className="flex-1 order-2 lg:order-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold">
                        {isLoading ? 'Searching...' : `${totalCount} Trips Found`} {query && `for "${query}"`}
                    </h2>

                    <div className="flex items-center gap-2 bg-neutral-900/50 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-8 px-2 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Grid
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-8 px-2 ${viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <List className="h-4 w-4 mr-2" />
                            List
                        </Button>
                    </div>
                </div>

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
                    onPageChange={handlePageChange}
                />
            </div>

            <div className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
                <PackagesFilterSidebar
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                    onPriceApply={handlePriceApply}
                    minDays={minDays}
                    maxDays={maxDays}
                    onMinDaysChange={setMinDays}
                    onMaxDaysChange={setMaxDays}
                    onDurationApply={handleDurationApply}
                    rating={rating}
                    onRatingChange={handleRatingChange}
                    onResetFilters={handleResetFilters}
                />
            </div>
        </div>
    )
}
