import { motion, type MotionValue } from 'framer-motion'

interface AboutParallaxBackgroundProps {
    y1: MotionValue<number>
    y2: MotionValue<number>
    rotate1: MotionValue<number>
    rotate2: MotionValue<number>
}

export function AboutParallaxBackground({ y1, y2, rotate1, rotate2 }: AboutParallaxBackgroundProps) {
    return (
        <>
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
        </>
    )
}
