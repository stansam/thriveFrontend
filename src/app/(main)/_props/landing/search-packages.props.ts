import type { PackageDTO } from '@/lib/dtos/package.dto'

export interface SearchAutocompleteDropdownProps {
    loading: boolean
    query: string
    data: PackageDTO[]
    onSelect: (item: PackageDTO) => void
}

export interface SearchAutocompleteProps {
    className?: string
    placeholder?: string
    onSelect?: (value: string) => void
    value?: string
    onChange?: (value: string) => void
}