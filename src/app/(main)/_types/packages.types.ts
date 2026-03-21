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
