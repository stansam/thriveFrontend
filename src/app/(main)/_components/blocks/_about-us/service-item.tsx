'use client'

/**
 * service-item.tsx
 * Pure presentational component — single service card with Framer Motion animations.
 * COMPONENTS.md: no hooks, no fetching, props-only.
 */

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

import { ICON_MAP } from './about-us.constants'
import type { ServiceData, IconKey } from './about-us.constants'

type ServiceItemProps = Omit<ServiceData, 'position'> & { direction: 'left' | 'right' }

function resolveIcon(name: IconKey, className: string, wrapperClass?: string): ReactNode {
    const Icon = ICON_MAP[name]
    if (!Icon) return null
    return wrapperClass
        ? <Icon className={`${className} ${wrapperClass}`} />
        : <Icon className={className} />
}

export function ServiceItem({ iconName, secondaryIconName, title, description, direction }: ServiceItemProps) {
    return (
        <motion.div
            className="flex flex-col group"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <motion.div
                className="flex items-center gap-3 mb-3"
                initial={{ x: direction === 'left' ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="text-[#88734C] bg-[#88734C]/10 p-3 rounded-lg transition-colors duration-300 group-hover:bg-[#88734C]/20 relative"
                    whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                >
                    {resolveIcon(iconName, 'w-6 h-6')}
                    <span className="absolute -top-1 -right-1 text-[#A9BBC8]">
                        {resolveIcon(secondaryIconName, 'w-4 h-4')}
                    </span>
                </motion.div>
                <h3 className="text-xl font-medium text-[#202e44] group-hover:text-[#88734C] transition-colors duration-300">
                    {title}
                </h3>
            </motion.div>
            <motion.p
                className="text-sm text-[#202e44]/80 leading-relaxed pl-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {description}
            </motion.p>
        </motion.div>
    )
}
