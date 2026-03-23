'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Zap } from 'lucide-react'

import { SERVICES, STATS } from '../../_fallback/landing/about-us.fallback'
import { ServiceItem } from './_about-us/service-item'
import { StatCounter } from './_about-us/stat-counter'
import { CeoPortrait } from './_about-us/ceo-portrait'
import { AboutParallaxBackground } from './_about-us/about-parallax-background'
import { MissionVisionCards } from './_about-us/mission-vision-cards'

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
            <AboutParallaxBackground y1={y1} y2={y2} rotate1={rotate1} rotate2={rotate2} />

            <div className="container mx-auto max-w-6xl relative z-10">
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

                <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map((stat) => (
                        <StatCounter key={stat.label} {...stat} />
                    ))}
                </div>

                <MissionVisionCards />
            </div>
        </section>
    )
}
