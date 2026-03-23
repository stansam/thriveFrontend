import type { ServiceData, StatData } from '../../_types/landing/about-us.types'

export const SERVICES: ServiceData[] = [
    {
        iconName: 'Plane',
        secondaryIconName: 'Sparkles',
        title: 'Flight Booking',
        description: 'Comprehensive domestic and international airline ticket booking services tailored to your schedule and budget.',
        position: 'left',
    },
    {
        iconName: 'Users',
        secondaryIconName: 'CheckCircle',
        title: 'Group Travel',
        description: 'Expert coordination for families, churches, and nonprofits, ensuring seamless group travel experiences.',
        position: 'left',
    },
    {
        iconName: 'Building2',
        secondaryIconName: 'Star',
        title: 'Corporate Travel',
        description: 'Professional corporate travel planning that streamlines logistics for businesses and global travelers.',
        position: 'left',
    },
    {
        iconName: 'Map',
        secondaryIconName: 'Sparkles',
        title: 'Itinerary Planning',
        description: 'Detailed itinerary planning to maximize your trip, including optional hotel bookings and activity scheduling.',
        position: 'right',
    },
    {
        iconName: 'FileText',
        secondaryIconName: 'CheckCircle',
        title: 'Travel Consultation',
        description: 'Expert advice on visa rules, destination requirements, and travel regulations to keep you informed.',
        position: 'right',
    },
    {
        iconName: 'Headphones',
        secondaryIconName: 'Star',
        title: '24/7 Concierge',
        description: 'Reliable 24/7 concierge support providing immediate assistance before, during, and after your journey.',
        position: 'right',
    },
]

export const STATS: StatData[] = [
    { iconName: 'Award', value: 100, label: 'Satisfaction', suffix: '%' },
    { iconName: 'Globe', value: 50, label: 'Destinations', suffix: '+' },
    { iconName: 'Clock', value: 24, label: 'Support Hours', suffix: '/7' },
    { iconName: 'Users', value: 500, label: 'Happy Travelers', suffix: '+' },
]
