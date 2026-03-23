import { type MotionValue } from 'framer-motion'
import { ServiceData } from '../../_types/landing/about-us.types'
import type { IconKey } from '../../_types/landing/about-us.types'


export interface AboutParallaxBackgroundProps {
    y1: MotionValue<number>
    y2: MotionValue<number>
    rotate1: MotionValue<number>
    rotate2: MotionValue<number>
}

export interface CeoPortraitProps {
    y1: MotionValue<number>
    y2: MotionValue<number>
}

export type ServiceItemProps = Omit<ServiceData, 'position'> & { direction: 'left' | 'right' }


export interface StatCounterProps {
    iconName: IconKey
    value: number
    label: string
    suffix: string
}