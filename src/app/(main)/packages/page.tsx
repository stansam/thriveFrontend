"use client"
import Link from "next/link"
import { Loader2, ChevronRight, Home } from "lucide-react"
import { Suspense } from "react"
import FooterSection from "../_components/blocks/footer-section"
import { SearchAutocomplete } from "../_components/search-autocomplete"
import { SearchResultsContent } from "../_components/package-search-results"



export default function SearchResultsPage() {
    return (
        <div className="min-h-screen bg-black font-sans text-white">

            <main className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col gap-6">
                
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-neutral-400 font-medium mb-4">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <Link href="/" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li><ChevronRight className="h-4 w-4 text-neutral-600" /></li>
                        <li className="text-white">Packages</li>
                    </ol>
                </nav>

                {/* Top Search Bar */}
                <div className="flex flex-col gap-4 mb-4">
                    <h1 className="text-3xl font-bold">Explore Packages</h1>
                    <div className="w-full relative">
                        <SearchAutocomplete
                            placeholder="Explore destinations, tours or hotels..."
                            className="bg-neutral-900 border-neutral-800"
                            onSelect={(val) => {
                                const params = new URLSearchParams(window.location.search);
                                if (val) params.set('q', val);
                                else params.delete('q');
                                window.location.href = `/packages?${params.toString()}`;
                            }}
                        />
                    </div>
                </div>

                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        <span className="ml-2 text-neutral-400">Loading results...</span>
                    </div>
                }>
                    <SearchResultsContent />
                </Suspense>
            </main>

            <FooterSection />
        </div>
    )
}
