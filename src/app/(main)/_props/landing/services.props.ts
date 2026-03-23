import { LucideIcon } from "lucide-react"

export interface ServicesMarqueeProps {
    title: string
    description: string
    services: Array<{
        title: string
        description: string
        icon: LucideIcon
    }>
    className?: string
}