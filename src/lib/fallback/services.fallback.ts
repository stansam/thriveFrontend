export interface ServiceFallback {
  id: string
  title: string
  description: string
  iconName: string
}

export const FALLBACK_SERVICES: ServiceFallback[] = [
  {
    id: 'airline-ticketing',
    title: 'Airline Ticket Booking',
    description: 'Seamless domestic and international flight reservations with competitive rates.',
    iconName: 'Plane',
  },
  {
    id: 'group-travel',
    title: 'Group Travel Coordination',
    description: 'Expert planning for large groups, ensuring smooth logistics and accommodation.',
    iconName: 'Users',
  },
  {
    id: 'corporate-travel',
    title: 'Corporate Travel Planning',
    description: 'Tailored solutions for business travel, optimizing efficiency and comfort.',
    iconName: 'Building2',
  },
  {
    id: 'itinerary',
    title: 'Itinerary Planning',
    description: 'Customized travel schedules designed to make the most of your trip.',
    iconName: 'Map',
  },
  {
    id: 'consultation',
    title: 'Travel Consultation',
    description: 'Guidance on visa rules, entry requirements, and destination specifics.',
    iconName: 'Info',
  },
  {
    id: 'concierge',
    title: '24/7 Concierge Support',
    description: 'Round-the-clock assistance for any travel needs or emergencies.',
    iconName: 'Headphones',
  },
]
