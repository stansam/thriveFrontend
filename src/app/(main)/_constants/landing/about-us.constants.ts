import {
    Plane, Users, Building2, Map, FileText, Headphones,
    Award, Globe, Clock,
    Sparkles, CheckCircle, Star,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'


export const ICON_MAP = {
    Plane, Users, Building2, Map, FileText, Headphones,
    Award, Globe, Clock,
    Sparkles, CheckCircle, Star,
} as const satisfies Record<string, LucideIcon>

