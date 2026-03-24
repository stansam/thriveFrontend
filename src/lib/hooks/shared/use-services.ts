import { useQuery } from '@tanstack/react-query'
import { MainService } from '@/lib/services/main.service'
import type { LandingService } from '@/lib/constants/landing.constants'
import { LANDING_SERVICES } from '@/lib/constants/landing.constants'
import type { LucideIcon } from 'lucide-react'
import { Plane, Users, Building2, Map, Info, Headphones } from 'lucide-react'

const IS_DEV = process.env.NODE_ENV === 'development'

const ICON_MAP: Record<string, LucideIcon> = {
  Plane,
  Users,
  Building2,
  Map,
  Info,
  Headphones,
}

export function useServices() {
  return useQuery<LandingService[]>({
    queryKey: ['landing-services'],
    queryFn: async () => {
      const result = await MainService.getServices()
      const raw = result as Array<{ title: string; description: string; icon: string }>

      if (IS_DEV && (!raw || raw.length === 0)) {
        return LANDING_SERVICES
      }

      const mapped: LandingService[] = (raw ?? []).map((s) => ({
        title: s.title,
        description: s.description,
        icon: ICON_MAP[s.icon] ?? Plane,
      }))

      return mapped.length > 0 ? mapped : IS_DEV ? LANDING_SERVICES : []
    },
    retry: 1,
    staleTime: 1000 * 60 * 60, // 1 hour 
    placeholderData: IS_DEV ? LANDING_SERVICES : undefined,
  })
}