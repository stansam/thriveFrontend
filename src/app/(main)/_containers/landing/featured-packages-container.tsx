'use client'

import { useRouter } from 'next/navigation'

import { useFeaturedPackages, useMyPackages, FALLBACK_PACKAGES } from '@/lib/hooks/shared/use-packages'
import { useAuth } from '@/lib/auth-context'
import type { PackageDTO } from '@/lib/dtos/package.dto'
import { IS_DEV } from '@/lib/constants/env.constants'

import { FeaturedPackagesView } from '../../_components/landing/featured-packages-view'

export function FeaturedPackagesContainer() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    const { data: apiPackages, isLoading, isError } = useFeaturedPackages()
    const { data: savedPackages, isError: isSavedError } = useMyPackages()

    const extractedPackages: PackageDTO[] = apiPackages?.packages ?? []
    const isEmpty = !isLoading && !isError && extractedPackages.length === 0

    // In dev show fallback on error or empty; in prod show empty state on empty
    const displayFallback = isError || (IS_DEV && isEmpty)
    const packages: PackageDTO[] = displayFallback ? FALLBACK_PACKAGES : extractedPackages

    const isPackageSaved = (slug: string): boolean =>
        savedPackages?.some((p: PackageDTO) => p.slug === slug) ?? false

    const handleViewPackage = (slug: string) => {
        router.push(`/packages/${slug}`)
    }

    return (
        <FeaturedPackagesView 
            packages={packages}
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            displayFallback={displayFallback}
            isAuthenticated={isAuthenticated}
            isSavedError={isSavedError}
            isPackageSaved={isPackageSaved}
            onViewPackage={handleViewPackage}
        />
    )
}
