'use client'

import { Check } from 'lucide-react'
import type { FeaturedPackageInclusionsProps } from '../../../_props/landing/featured.props'

export function FeaturedPackageInclusions({ inclusions }: FeaturedPackageInclusionsProps) {
    const included = (inclusions ?? []).filter((inc) => inc.is_included)
    const visible = included.slice(0, 3)
    const extra = included.length - 3

    return (
        <div>
            <h4 className="font-semibold mb-2 text-white/90">What&apos;s Included</h4>
            <ul className="grid grid-cols-1 gap-1">
                {visible.map((inc) => (
                    <li key={inc.description} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="size-3 text-success-500 shrink-0" aria-hidden />
                        <span className="truncate">{inc.description}</span>
                    </li>
                ))}
                {extra > 0 && (
                    <li className="text-xs text-muted-foreground pl-5">+{extra} more</li>
                )}
            </ul>
        </div>
    )
}
