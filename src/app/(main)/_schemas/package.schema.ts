import { PackageDTO } from "@/lib/dtos/package.dto";

export interface PackageSearchRequestDTO {
    q?: string;
    min_price?: number;
    max_price?: number;
    min_days?: number;
    max_days?: number;
    limit: number; // default 20
    offset: number; //default 0
}

export interface PackageSearchResponseDTO {
    items: PackageDTO[];
    total: number;
    page: number;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}