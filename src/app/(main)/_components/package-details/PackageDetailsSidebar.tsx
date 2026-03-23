"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageDetailsSidebarProps } from "../../_props/package-details";

export function PackageDetailsSidebar({
    startingPrice,
    durationDays,
    onBookClick,
}: PackageDetailsSidebarProps) {
    return (
        <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-6">
                {/* Booking Card */}
                <div className="bg-neutral-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl shadow-emerald-900/10 overflow-hidden relative">
                    {/* Decorative gradient blob */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

                    <div className="mb-6">
                        <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider mb-2">
                            Package Price
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">
                                ${startingPrice}
                            </span>
                            <span className="text-neutral-500">/ person</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8 bg-black/20 p-4 rounded-xl">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Duration</span>
                            <span className="font-medium text-white">{durationDays} Days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Availability</span>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                Dates Available
                            </Badge>
                        </div>
                    </div>

                    <Button
                        onClick={onBookClick}
                        className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg shadow-emerald-900/20 mb-4"
                    >
                        Request Availability
                    </Button>

                    <p className="text-xs text-center text-neutral-500">
                        *No payment required now. Our concierge will confirm your dates first.
                    </p>
                </div>

                {/* Quick Links Card */}
                <div className="bg-neutral-900 border border-white/5 rounded-xl p-6 hidden xl:block">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                        Quick Navigation
                    </h4>
                    <nav className="flex flex-col space-y-2">
                        <a href="#overview" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm py-1">
                            Overview & Highlights
                        </a>
                        <a href="#itinerary" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm py-1">
                            Day-by-Day Itinerary
                        </a>
                        <a href="#inclusions" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm py-1">
                            Inclusions & Exclusions
                        </a>
                        <a href="#gallery" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm py-1">
                            Photo Gallery
                        </a>
                    </nav>
                </div>
            </div>
        </aside>
    );
}
