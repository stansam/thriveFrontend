import { useQuery } from '@tanstack/react-query'
import { MainService } from '@/lib/services/main.service'
import { GetPackagesResponseDTO } from '@/lib/dtos/package.dto'

export function useAutocompleteSearch(query: string) {
    return useQuery<GetPackagesResponseDTO>({
        queryKey: ['packages-search-autocomplete', query],
        queryFn: async () => {
            const res = await MainService.searchPackages({ q: query, limit: 5 }) as GetPackagesResponseDTO
            return res
        },
        enabled: query.trim().length > 1,
        staleTime: 1000 * 60 * 5, // Cache short results for 5 minutes
    })
}
