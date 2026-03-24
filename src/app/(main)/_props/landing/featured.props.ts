import type { PackageDTO } from '@/lib/dtos/package.dto'
import { type CarouselApi } from '@/components/ui/carousel'

export interface FeaturedPackagesViewProps {
    packages: PackageDTO[]
    isLoading: boolean
    isError: boolean
    isEmpty: boolean
    displayFallback: boolean
    isAuthenticated: boolean
    isSavedError: boolean
    isPackageSaved: (slug: string) => boolean
    onViewPackage: (slug: string) => void
}

export interface FeaturedPackagesCarouselProps {
  packages: PackageDTO[]
  displayFallback: boolean
  isAuthenticated: boolean
  isSavedError: boolean
  isPackageSaved: (slug: string) => boolean
  onViewPackage: (slug: string) => void
  setCarouselApi: (api: CarouselApi) => void
  carouselApi: CarouselApi | undefined
  canScrollPrev: boolean
  canScrollNext: boolean
  currentSlide: number
}

export interface FeaturedPackagesHeaderProps {
  carouselApi: CarouselApi | undefined
  canScrollPrev: boolean
  canScrollNext: boolean
}

export interface FeaturedPackagesStatesProps {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
}

export interface FeaturedPackageCardProps {
    package: PackageDTO
    isPriority?: boolean
    isAuthenticated: boolean
    isSavedError: boolean
    isSaved: boolean
    onView: (slug: string) => void
}

export interface FeaturedPackageInclusionsProps {
    inclusions: PackageDTO['inclusions']
}