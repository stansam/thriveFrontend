import type { PackageDTO, PackageInclusionDTO } from "@/lib/dtos/package.dto";
import { PackageItineraryDTO } from "@/lib/dtos/package.dto";

export interface PackageDetailsContainerProps {
    slug: string;
}

export interface PackagesPaginationProps {
    currentPage: number
    totalPages: number
    isLoading: boolean
    onPageChange: (newPage: number) => void
}

export interface PackageDetailsInclusionsProps {
    inclusions?: PackageInclusionDTO[];
}

export interface PackageDetailsGalleryProps {
    images: string[];
}

export interface PackageItineraryProps {
    itinerary: PackageItineraryDTO[];
}

export interface PackageHeroProps {
    title: string;
    images: string[];
    durationDays: number;
    durationNights: number;
    startingPrice: number;
    className?: string;
    packageSlug?: string; 
}

export interface PackageBookingWizardProps {
    pkg: PackageDTO;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface PackageDetailsOverviewProps {
    city: string;
    country: string;
    description: string;
}

export interface PackageDetailsSidebarProps {
    startingPrice: number;
    durationDays: number;
    onBookClick: () => void;
}

export interface StickyBookBarProps {
    pkg: {
        id: string;
        name: string;
        starting_price: number;
    };
    className?: string;
}