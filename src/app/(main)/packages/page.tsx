import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import FooterSection from "../_components/landing/footer-section"
import { PackagesHeader } from "../_components/packages/packages-header"
import { PackagesContainer } from "../_containers/packages/PackagesContainer"

export default function SearchResultsPage() {
    return (
        <div className="min-h-screen bg-black font-sans text-white">
            <main className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col gap-6">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                    </div>
                }>
                    <PackagesHeader />
                </Suspense>

                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        <span className="ml-2 text-neutral-400">Loading results...</span>
                    </div>
                }>
                    <PackagesContainer />
                </Suspense>
            </main>

            <FooterSection />
        </div>
    )
}
