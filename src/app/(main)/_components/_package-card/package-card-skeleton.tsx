'use client'

import React from 'react'

export function PackageCardSkeleton() {
    return (
        <div
            className="w-[320px] shrink-0 md:max-w-[340px] lg:max-w-[400px]"
            aria-hidden="true"
        >
            <div className="flex h-[480px] w-full flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 animate-skeleton">
                {/* Image Placeholder */}
                <div className="relative aspect-4/3 w-full bg-neutral-800">
                    <div className="absolute top-4 left-4 h-6 w-24 rounded-full bg-neutral-700" />
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                        {/* Title */}
                        <div className="mb-4 h-6 w-3/4 rounded bg-neutral-800" />
                        
                        {/* Itineraries */}
                        <div className="mb-6 flex gap-2">
                            <div className="h-5 w-16 rounded-full bg-neutral-800" />
                            <div className="h-5 w-16 rounded-full bg-neutral-800" />
                        </div>

                        {/* Inclusions */}
                        <div className="space-y-4">
                            <div className="mb-2 h-4 w-1/3 rounded bg-neutral-800" />
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-5/6 rounded bg-neutral-800" />
                                <div className="h-3 w-4/6 rounded bg-neutral-800" />
                                <div className="h-3 w-3/6 rounded bg-neutral-800" />
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-6 h-10 w-full rounded bg-neutral-800" />
                </div>
            </div>
        </div>
    )
}
