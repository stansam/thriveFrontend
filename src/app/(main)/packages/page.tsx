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
import { Checkbox } from "@/components/ui/checkbox"
import { useMyPackages, useSearchPackages } from '@/lib/hooks/shared/use-packages';
import { PackageSearchRequestDTO } from "../_schemas/package.schema"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "../_components/seperator"

function SearchResultsContent() {
    const searchParams = useSearchParams()
    // const router = useRouter() // Not currently used, but good to have if needed for navigation
    const query = searchParams.get('q') || ''
    
    // UI State
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
    const [page, setPage] = React.useState(1)
    const limit = 12

    // Filters State
    const [priceRange, setPriceRange] = React.useState([0, 5000])
    const [duration, setDuration] = React.useState("any")
    const [rating, setRating] = React.useState<string[]>([])

    React.useEffect(() => {
        // Sync URL params to state on mount
        const minP = searchParams.get('min_price')
        const maxP = searchParams.get('max_price')
        if (minP || maxP) {
            setPriceRange([minP ? parseInt(minP) : 0, maxP ? parseInt(maxP) : 5000])
        }

        const minD = searchParams.get('min_days')
        const maxD = searchParams.get('max_days')
        if (minD && maxD) setDuration(`${minD}-${maxD}`)
        else if (minD) setDuration('11-20') // Rough approximation

        const hotelR = searchParams.get('hotel_rating')
        if (hotelR) setRating([hotelR])

        // Initial params set, reset page
        setPage(1)
    }, [searchParams])

    // Construct API Request Payload
    const buildRequest = (): PackageSearchRequestDTO => {
        const req: PackageSearchRequestDTO = {
            limit,
            offset: (page - 1) * limit
        }
        if (query) req.q = query

        // Price
        if (priceRange[0] > 0) req.min_price = priceRange[0]
        if (priceRange[1] < 5000) req.max_price = priceRange[1]

        // Duration
        if (duration !== 'any') {
            const [min, max] = duration.split('-')
            if (min) req.min_days = parseInt(min)
            if (max) req.max_days = parseInt(max)
        }

        // Rating
        /* DTO doesnt support rating array natively but we pass min rating if needed or adapt backend */

        return req
    }

    const { data: result, isLoading } = useSearchPackages(buildRequest())
    const packages = result?.items || []
    const totalCount = result?.total || 0
    const totalPages = Math.ceil(totalCount / limit)
    
    const { data: savedPackages } = useMyPackages();
    const isPackageSaved = (id: string) => savedPackages?.some((p: any) => p.slug === id);

    // Handle price change
    const handlePriceChange = (value: number[]) => {
        setPriceRange(value)
    }

    const handleRatingChange = (checked: boolean, value: string) => {
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
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                            className="h-10 w-10 border-white/20 hover:bg-white hover:text-black"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-1 mx-4 text-sm font-medium">
                            <span className="text-white">Page {page}</span>
                            <span className="text-neutral-500">of {totalPages}</span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || isLoading}
                            className="h-10 w-10 border-white/20 hover:bg-white hover:text-black"
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
                        <div className="flex justify-between text-sm">
                            <Label>Price Range</Label>
                            <span className="text-emerald-400 font-mono">${priceRange[0]} - ${priceRange[1]}</span>
                        </div>
                        <Slider
                            defaultValue={[0, 5000]}
                            max={10000}
                            step={100}
                            value={priceRange}
                            onValueChange={handlePriceChange}
                            className="py-4"
                        />
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Duration */}
                    <div className="space-y-3">
                        <Label>Duration</Label>
                        <RadioGroup value={duration} onValueChange={setDuration}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="any" id="d-any" className="border-emerald-500 text-emerald-500" />
                                <Label htmlFor="d-any" className="font-normal text-neutral-300">Any</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1-5" id="d-short" className="border-emerald-500 text-emerald-500" />
                                <Label htmlFor="d-short" className="font-normal text-neutral-300">Short (1-5 days)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="6-10" id="d-medium" className="border-emerald-500 text-emerald-500" />
                                <Label htmlFor="d-medium" className="font-normal text-neutral-300">Medium (6-10 days)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="11-20" id="d-long" className="border-emerald-500 text-emerald-500" />
                                <Label htmlFor="d-long" className="font-normal text-neutral-300">Long (11+ days)</Label>
                            </div>
                        </RadioGroup>
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
                        className="w-full border-white/20 hover:bg-white hover:text-black mt-4"
                        onClick={() => {
                            setPriceRange([0, 5000])
                            setDuration("any")
                            setRating([])
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
