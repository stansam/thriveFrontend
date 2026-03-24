"use client";

import { MapPin, Globe } from "lucide-react";
import { PackageDetailsOverviewProps } from "../../_props/package-details";


export function PackageDetailsOverview({
    city,
    country,
    description,
}: PackageDetailsOverviewProps) {
    return (
        <section id="overview" className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">Overview</h2>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        {city}, {country}
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        &quot;International Tour&quot;
                    </div>
                </div>
                <p className="text-lg text-neutral-300 leading-relaxed whitespace-pre-line">
                    {description}
                </p>
            </div>
        </section>
    );
}
