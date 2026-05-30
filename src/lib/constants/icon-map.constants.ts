import {
  Plane,
  Users,
  Building2,
  Map,
  FileText,
  Headphones,
  Award,
  Globe,
  Clock,
  Sparkles,
  CheckCircle,
  Star,
  Info,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP = {
  Plane,
  Users,
  Building2,
  Map,
  FileText,
  Headphones,
  Award,
  Globe,
  Clock,
  Sparkles,
  CheckCircle,
  Star,
  Info,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICON_MAP;
