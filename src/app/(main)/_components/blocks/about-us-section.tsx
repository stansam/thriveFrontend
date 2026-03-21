'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Zap } from 'lucide-react'

import { SERVICES, STATS } from './_about-us/about-us.constants'
import { ServiceItem } from './_about-us/service-item'
import { StatCounter } from './_about-us/stat-counter'
import { CeoPortrait } from './_about-us/ceo-portrait'

export default function AboutUsSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: false, amount: 0.1 })

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
    const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
    const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

    const leftServices = SERVICES.filter((s) => s.position === 'left')
    const rightServices = SERVICES.filter((s) => s.position === 'right')

    return (
        <section
            id="about-section"
            ref={sectionRef}
            className="w-full py-24 px-4 bg-linear-to-b from-[#F2F2EB] to-[#F8F8F2] text-[#202e44] overflow-hidden relative"
        >
            {/* Parallax background blobs */}
            <motion.div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#88734C]/5 blur-3xl" style={{ y: y1, rotate: rotate1 }} />
            <motion.div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#A9BBC8]/5 blur-3xl" style={{ y: y2, rotate: rotate2 }} />
            <motion.div
                className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-[#88734C]/30"
                animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-[#A9BBC8]/30"
                animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <motion.span
                        className="text-[#88734C] font-medium mb-2 flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Zap className="w-4 h-4" /> BUSINESS PLAN &amp; VISION
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-center">Thrive Global Travel &amp; Tours</h2>
                    <motion.div
                        className="w-24 h-1 bg-[#88734C]"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: 96 } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>
                <p className="text-center max-w-3xl mx-auto mb-16 text-[#202e44]/80 leading-relaxed">
                    Thrive Global Travel &amp; Tours is a premium travel service company specializing in domestic and international
                    flight bookings, group travel arrangements, and corporate travel management. We streamline travel by providing
                    fast quotations, affordable service fees, and personalized customer support.
                </p>

                {/* 3-column grid — services + CEO portrait */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="space-y-16">
                        {leftServices.map((service) => (
                            <ServiceItem key={service.title} {...service} direction="left" />
                        ))}
                    </div>
                    <CeoPortrait y1={y1} y2={y2} />
                    <div className="space-y-16">
                        {rightServices.map((service) => (
                            <ServiceItem key={service.title} {...service} direction="right" />
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map((stat) => (
                        <StatCounter key={stat.label} {...stat} />
                    ))}
                </div>

                {/* Mission & Vision */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#202e44] text-white p-8 rounded-xl">
                        <h3 className="text-xl font-bold mb-3 text-[#88734C]">Our Mission</h3>
                        <p className="text-white/80 leading-relaxed">
                            To provide affordable, reliable, and stress‑free travel services with excellence, transparency, and world‑class service.
                        </p>
                    </div>
                    <div className="bg-[#f0f0f0] text-[#202e44] p-8 rounded-xl border border-[#A9BBC8]/30">
                        <h3 className="text-xl font-bold mb-3 text-[#88734C]">Our Vision</h3>
                        <p className="text-[#202e44]/80 leading-relaxed">
                            To become a recognized and trusted travel service brand known for professionalism and convenience.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
