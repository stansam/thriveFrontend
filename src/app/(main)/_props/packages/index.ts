import type { PackageDTO } from '@/lib/dtos/package.dto'

export interface PackageCardImageProps {
    pkg: PackageDTO
    isSaved: boolean
    isList: boolean
}

export interface PackageCardProps {
    pkg: PackageDTO
    className?: string
    isSaved?: boolean
    layoutType?: 'grid' | 'list'
}

export interface PackagesContainerHeaderProps {
    isLoading: boolean
    totalCount: number
    query: string
    viewMode: 'grid' | 'list'
    setViewMode: (mode: 'grid' | 'list') => void
}

export interface PackagesGridListProps {
    packages: PackageDTO[]
    isLoading: boolean
    viewMode: 'grid' | 'list'
    isPackageSaved: (slug: string) => boolean
}

export interface PackagesFilterSidebarProps {
    minPrice: string
    maxPrice: string
    onMinPriceChange: (val: string) => void
    onMaxPriceChange: (val: string) => void
    onPriceApply: () => void

    minDays: string
    maxDays: string
    onMinDaysChange: (val: string) => void
    onMaxDaysChange: (val: string) => void
    onDurationApply: () => void

    rating: string[]
    onRatingChange: (checked: boolean, value: string) => void
    onResetFilters: () => void
}

export interface DurationFilterProps {
    minDays: string
    maxDays: string
    onMinDaysChange: (val: string) => void
    onMaxDaysChange: (val: string) => void
    onDurationApply: () => void
}

export interface PriceFilterProps {
    minPrice: string
    maxPrice: string
    onMinPriceChange: (val: string) => void
    onMaxPriceChange: (val: string) => void
    onPriceApply: () => void
}

export interface RatingFilterProps {
    rating: string[]
    onRatingChange: (checked: boolean, value: string) => void
}