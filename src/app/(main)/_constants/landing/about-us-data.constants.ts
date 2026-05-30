import {
  Plane,
  Sparkles,
  Users,
  CheckCircle,
  Building2,
  Star,
  Map,
  FileText,
  Headphones,
  Award,
  Globe,
  Clock,
  type LucideIcon,
} from "lucide-react";

export interface ServiceData {
  icon: LucideIcon;
  secondaryIcon: LucideIcon;
  title: string;
  description: string;
  position: "left" | "right";
}

export interface StatData {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix: string;
}

export const SERVICES: ServiceData[] = [
  {
    icon: Plane,
    secondaryIcon: Sparkles,
    title: "Flight Booking",
    description:
      "Comprehensive domestic and international airline ticket booking services tailored to your schedule and budget.",
    position: "left",
  },
  {
    icon: Users,
    secondaryIcon: CheckCircle,
    title: "Group Travel",
    description:
      "Expert coordination for families, churches, and nonprofits, ensuring seamless group travel experiences.",
    position: "left",
  },
  {
    icon: Building2,
    secondaryIcon: Star,
    title: "Corporate Travel",
    description:
      "Professional corporate travel planning that streamlines logistics for businesses and global travelers.",
    position: "left",
  },
  {
    icon: Map,
    secondaryIcon: Sparkles,
    title: "Itinerary Planning",
    description:
      "Detailed itinerary planning to maximize your trip, including optional hotel bookings and activity scheduling.",
    position: "right",
  },
  {
    icon: FileText,
    secondaryIcon: CheckCircle,
    title: "Travel Consultation",
    description:
      "Expert advice on visa rules, destination requirements, and travel regulations to keep you informed.",
    position: "right",
  },
  {
    icon: Headphones,
    secondaryIcon: Star,
    title: "24/7 Concierge",
    description:
      "Reliable 24/7 concierge support providing immediate assistance before, during, and after your journey.",
    position: "right",
  },
];

export const STATS: StatData[] = [
  { icon: Award, value: 100, label: "Satisfaction", suffix: "%" },
  { icon: Globe, value: 50, label: "Destinations", suffix: "+" },
  { icon: Clock, value: 24, label: "Support Hours", suffix: "/7" },
  { icon: Users, value: 500, label: "Happy Travelers", suffix: "+" },
];
