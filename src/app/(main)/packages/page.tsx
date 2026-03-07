"use client"
import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Loader2, Filter, LayoutGrid, List, ChevronRight, Home, ChevronLeft } from "lucide-react"
import { Suspense } from "react"
import FooterSection from "../_components/blocks/footer-section"
import { SearchAutocomplete } from "../_components/search-autocomplete"
import { PackageCard } from "../_components/package-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useMyPackages, useSearchPackages } from '@/lib/hooks/shared/use-packages';
import { GetPackagesRequestDTO } from "@/lib/dtos/package.dto"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "../_components/seperator"

function SearchResultsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const query = searchParams.get('q') || ''
    
    // UI State
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
    const limit = 12
    
    // Derived Page State from URL
    const urlPage = searchParams.get('current_page')
    const currentPage = urlPage ? Math.max(1, parseInt(urlPage, 10)) : 1

    // Filters State
    const [minPrice, setMinPrice] = React.useState<string>("")
    const [maxPrice, setMaxPrice] = React.useState<string>("")
    const [minDays, setMinDays] = React.useState<string>("")
    const [maxDays, setMaxDays] = React.useState<string>("")
    const [rating, setRating] = React.useState<string[]>([])

    React.useEffect(() => {
        // Sync URL params to local state on mount or URL change
        setMinPrice(searchParams.get('min_price') || "")
        setMaxPrice(searchParams.get('max_price') || "")
        setMinDays(searchParams.get('min_days') || "")
        setMaxDays(searchParams.get('max_days') || "")

        const hotelR = searchParams.get('hotel_rating')
        if (hotelR) setRating([hotelR])
    }, [searchParams])

    // Construct API Request Payload directly from URL to avoid sync lags
    const buildRequest = (): GetPackagesRequestDTO => {
        const req: GetPackagesRequestDTO = {
            limit,
            offset: (currentPage - 1) * limit
        }
        
        const q = searchParams.get('q');
        if (q) req.q = q;

        const urlMinP = searchParams.get('min_price');
        const urlMaxP = searchParams.get('max_price');
        if (urlMinP) req.min_price = parseInt(urlMinP);
        if (urlMaxP) req.max_price = parseInt(urlMaxP);

        const urlMinD = searchParams.get('min_days');
        const urlMaxD = searchParams.get('max_days');
        if (urlMinD) req.min_days = parseInt(urlMinD);
        if (urlMaxD) req.max_days = parseInt(urlMaxD);

        // Rating
        /* DTO doesnt support rating array natively but we pass min rating if needed or adapt backend */

        return req
    }

    const { data: result, isLoading } = useSearchPackages(buildRequest())
    const packages = result?.packages || []
    
    // Rely completely on backend mapped DTO for true pagination state
    const pagination = result?.pagination
    const totalCount = pagination?.total || 0
    const totalPages = pagination?.total_pages || 1
    // current_page is returned, but UI relies on URL intentionally for back/forward sync.
    // They should match precisely if APIs are consistent.
    
    const { data: savedPackages } = useMyPackages();
    const isPackageSaved = (id: string) => savedPackages?.some((p: any) => p.slug === id);

    const updateFilters = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString())
        
        // When we update core filters, we explicitly drop the page count so users
        // aren't stranded on page 3 of a query that only returns 1 page of results.
        params.delete('current_page')
        
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === "") {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`/packages?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (newPage === 1) {
             params.delete('current_page') 
        } else {
             params.set('current_page', newPage.toString())
        }
        router.push(`/packages?${params.toString()}`)
    }

    // Handle price change from UI
    const handlePriceApply = () => {
        updateFilters({ min_price: minPrice, max_price: maxPrice })
    }

    const handleDurationApply = () => {
        updateFilters({ min_days: minDays, max_days: maxDays })
    }

    const handleRatingChange = (checked: boolean, value: string) => {
        // UI only for now unless schema adapts
        if (checked) {
            setRating([...rating, value])
        } else {
            setRating(rating.filter(r => r !== value))
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Main Content Areas - Results */}
            <div className="flex-1 order-2 lg:order-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold">
                        {isLoading ? 'Searching...' : `${totalCount} Trips Found`} {query && `for "${query}"`}
                    </h2>

                    <div className="flex items-center gap-2 bg-neutral-900/50 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-8 px-2 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Grid
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-8 px-2 ${viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <List className="h-4 w-4 mr-2" />
                            List
                        </Button>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    </div>
                )}

                {!isLoading && packages.length === 0 && (
                    <div className="text-center py-20 bg-neutral-900/50 rounded-lg border border-neutral-800">
                        <h3 className="text-xl font-medium mb-2">No trips found</h3>
                        <p className="text-neutral-400">Try adjusting your filters or search for something else.</p>
                    </div>
                )}

                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {packages.map((pkg: any) => (
                        <PackageCard key={pkg.slug} pkg={pkg} isSaved={isPackageSaved(pkg.slug)} layoutType={viewMode} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12 bg-neutral-900/30 p-4 rounded-xl border border-white/5">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages || isLoading}
                            className="h-10 w-10 border-white/20 hover:bg-white hover:text-gray-900 text-black"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Filters - Fixed on Desktop */}
            <div className="w-full lg:w-80 shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-24 bg-neutral-900/50 backdrop-blur-md border border-white/10 p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Filter className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-bold text-lg">Filters</h3>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <Label>Price Range (USD)</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-neutral-400">Min</Label>
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)} 
                                    className="h-8 bg-neutral-800/50 border-white/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-neutral-400">Max</Label>
                                <Input 
                                    type="number" 
                                    placeholder="Any" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)} 
                                    className="h-8 bg-neutral-800/50 border-white/10"
                                />
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={handlePriceApply}>Apply Price</Button>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Duration */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <Label>Duration (Days)</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-neutral-400">Min</Label>
                                <Input 
                                    type="number" 
                                    placeholder="1" 
                                    value={minDays} 
                                    onChange={(e) => setMinDays(e.target.value)} 
                                    className="h-8 bg-neutral-800/50 border-white/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-neutral-400">Max</Label>
                                <Input 
                                    type="number" 
                                    placeholder="Any" 
                                    value={maxDays} 
                                    onChange={(e) => setMaxDays(e.target.value)} 
                                    className="h-8 bg-neutral-800/50 border-white/10"
                                />
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={handleDurationApply}>Apply Duration</Button>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Hotel Rating */}
                    <div className="space-y-3">
                        <Label>Hotel Rating</Label>
                        <div className="grid grid-cols-1 gap-2">
                            {[5, 4, 3].map((star) => (
                                <div key={star} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`star-${star}`}
                                        checked={rating.includes(star.toString())}
                                        onCheckedChange={(checked) => handleRatingChange(checked as boolean, star.toString())}
                                        className="border-neutral-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                    />
                                    <Label htmlFor={`star-${star}`} className="font-normal text-neutral-300 flex items-center gap-1">
                                        {star} Stars <span className="flex">{Array(star).fill(0).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}</span>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-white/20 hover:bg-white hover:text-gray-700 text-black mt-4"
                        onClick={() => {
                            setMinPrice("")
                            setMaxPrice("")
                            setMinDays("")
                            setMaxDays("")
                            setRating([])
                            router.push('/packages')
                        }}
                    >
                        Reset Filters
                    </Button>
                </div>
            </div>
        </div>
    )
}

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
