'use client'

/**
 * ceo-portrait.tsx
 * Pure presentational component — CEO portrait with parallax accents.
 * COMPONENTS.md: props-only, parallax values flow in from parent's useScroll.
 */

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

interface CeoPortraitProps {
    y1: MotionValue<number>
    y2: MotionValue<number>
}

export function CeoPortrait({ y1, y2 }: CeoPortraitProps) {
    return (
        <div className="flex justify-center items-center order-first md:order-0 mb-8 md:mb-0">
            <motion.div className="relative w-full max-w-xs">
                <motion.div
                    className="rounded-md overflow-hidden shadow-xl"
                    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                >
                    <div className="relative w-full aspect-3/4">
                        <Image
                            src="/edna.jpeg"
                            alt="Dr. Edna Kemboi — Founder & CEO of Thrive Global Travel & Tours"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 80vw, 280px"
                        />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-[#202e44]/90 to-transparent flex items-end justify-center p-6 text-center">
                        <div>
                            <p className="text-white font-medium text-sm mb-1">Founder & CEO</p>
                            <p className="text-[#88734C] font-bold text-lg">Dr. Edna Kemboi</p>
                        </div>
                    </div>
                </motion.div>

                {/* Border frame */}
                <div className="absolute inset-0 border-4 border-[#A9BBC8] rounded-md -m-3 z-[-1]" />

                {/* Floating parallax accents */}
                <motion.div
                    className="absolute -top-4 -right-8 w-16 h-16 rounded-full bg-[#88734C]/10"
                    style={{ y: y1 }}
                />
                <motion.div
                    className="absolute -bottom-6 -left-10 w-20 h-20 rounded-full bg-[#A9BBC8]/15"
                    style={{ y: y2 }}
                />
            </motion.div>
        </div>
    )
}
