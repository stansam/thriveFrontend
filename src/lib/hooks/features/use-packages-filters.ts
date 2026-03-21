import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { GetPackagesRequestDTO } from "@/lib/dtos/package.dto"

export function usePackagesFilters() {
    const searchParams = useSearchParams(); const router = useRouter()
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
    const limit = 12
    const urlPage = searchParams.get('current_page')
    const currentPage = urlPage ? Math.max(1, parseInt(urlPage, 10)) : 1

    const [minPrice, setMinPrice] = React.useState("")
    const [maxPrice, setMaxPrice] = React.useState("")
    const [minDays, setMinDays] = React.useState("")
    const [maxDays, setMaxDays] = React.useState("")
    const [rating, setRating] = React.useState<string[]>([])

    React.useEffect(() => {
        setMinPrice(searchParams.get('min_price') || "")
        setMaxPrice(searchParams.get('max_price') || "")
        setMinDays(searchParams.get('min_days') || "")
        setMaxDays(searchParams.get('max_days') || "")
        const hotelR = searchParams.get('hotel_rating')
        if (hotelR) setRating([hotelR])
    }, [searchParams])

    const request: GetPackagesRequestDTO = { limit, offset: (currentPage - 1) * limit }
    const q = searchParams.get('q')
    if (q) request.q = q
    const parseParam = (key: string) => searchParams.get(key) ? parseInt(searchParams.get(key)!) : undefined
    request.min_price = parseParam('min_price')
    request.max_price = parseParam('max_price')
    request.min_days = parseParam('min_days')
    request.max_days = parseParam('max_days')

    const updateUrlParams = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString()); params.delete('current_page')
        Object.entries(newParams).forEach(([key, value]) => {
            if (!value) params.delete(key)
            else params.set(key, value)
        })
        router.push(`/packages?${params.toString()}`)
    }

    const handlers = {
        onPriceApply: () => updateUrlParams({ min_price: minPrice, max_price: maxPrice }),
        onDurationApply: () => updateUrlParams({ min_days: minDays, max_days: maxDays }),
        onRatingChange: (checked: boolean, value: string) => checked ? setRating([...rating, value]) : setRating(rating.filter(r => r !== value)),
        onPageChange: (newPage: number) => updateUrlParams({ current_page: newPage === 1 ? undefined : newPage.toString() }),
        onResetFilters: () => {
            setMinPrice(""); setMaxPrice(""); setMinDays(""); setMaxDays(""); setRating([])
            router.push('/packages')
        }
    }

    return {
        request, currentPage, viewMode, setViewMode, 
        formState: { minPrice, maxPrice, minDays, maxDays, rating }, 
        setters: { setMinPrice, setMaxPrice, setMinDays, setMaxDays }, 
        handlers
    }
}
