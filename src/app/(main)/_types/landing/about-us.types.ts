import { ICON_MAP } from "../../_constants/landing/about-us.constants";

export type IconKey = keyof typeof ICON_MAP

export interface ServiceData {
    iconName: IconKey
    secondaryIconName: IconKey
    title: string
    description: string
    position: 'left' | 'right'
}

export interface StatData {
    iconName: IconKey
    value: number
    label: string
    suffix: string
}