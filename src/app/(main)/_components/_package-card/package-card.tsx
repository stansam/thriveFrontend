'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WishlistButton } from '@/components/blocks/wishlist-button'
import { PackageInclusions } from './package-inclusions'
import type { PackageDTO } from '@/lib/dtos/package.dto'

interface PackageCardProps {
    package: PackageDTO
    isPriority?: boolean
    isAuthenticated: boolean
    isSavedError: boolean
    isSaved: boolean
    onView: (slug: string) => void
}

export function PackageCard({
    package: item,
    isPriority,
    isAuthenticated,
    isSavedError,
    isSaved,
    onView,
}: PackageCardProps) {
    const imageUrl =
        item.media?.find((m) => m.is_featured)?.image_url ??
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1080&auto=format&fit=crop'
    
    const itineraries = (item.itineraries ?? []).slice(0, 3)

    return (
        <div className="group relative h-full flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50">
            <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={item.title ?? 'Tour Package'}
                    fill
                    priority={isPriority}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-neutral-900 to-transparent pointer-events-none" />

                {/* Duration badge */}
                <div className="absolute top-4 left-4">
                    <div className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                        {item.duration_days} Days &bull; {item.duration_nights} Nights
                    </div>
                </div>

                {/* Wishlist */}
                {isAuthenticated && !isSavedError && (
                    <div className="absolute top-4 right-4">
                        <WishlistButton
                            packageSlug={item.slug}
                            isSaved={isSaved}
                            className="bg-black/20 hover:bg-black/40 text-white"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                    <h3 className="text-xl font-bold mb-4 leading-tight line-clamp-2">
                        {item.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {itineraries.map((it) => (
                            <span
                                key={`${it.day_number}-${it.title}`}
                                className="max-w-[100px] truncate text-[10px] tracking-wide px-2 py-1 rounded-full bg-white/10 text-white/90"
                            >
                                {it.title}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-4 text-sm">
                        <PackageInclusions inclusions={item.inclusions} />
                    </div>
                </div>

                <Button
                    onClick={() => onView(item.slug)}
                    className="w-full mt-6 bg-white text-black hover:bg-neutral-200"
                >
                    View Package
                    <ArrowRight className="ml-2 size-4" aria-hidden />
                </Button>
            </div>
        </div>
    )
}
