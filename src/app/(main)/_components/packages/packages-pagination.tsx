'use client'

import { ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PackagesPaginationProps } from "../../_props/package-details"

export function PackagesPagination({
    currentPage,
    totalPages,
    isLoading,
    onPageChange
}: PackagesPaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-12 bg-neutral-900/30 p-4 rounded-xl border border-white/5">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
                className="h-10 w-10 border-white/20 hover:bg-white hover:text-gray-900 text-black"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 mx-4 text-sm font-medium">
                <span className="text-white">Page {currentPage}</span>
                <span className="text-neutral-500">of {totalPages}</span>
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="h-10 w-10 border-white/20 hover:bg-white hover:text-gray-900 text-black"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
