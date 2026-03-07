import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainService } from '@/lib/services/main.service';
import { clientService } from '@/lib/services/client.service';
import { useAuth } from '@/lib/auth-context';

import { PackageDTO, GetPackagesResponseDTO } from '@/lib/dtos/package.dto';

export const FALLBACK_PACKAGES: PackageDTO[] = [
  {
    title: 'Tropical Bali Getaway',
    slug: 'bali-getaway',
    city: 'Bali',
    country: 'Indonesia',
    currency: 'USD',
    description: 'Experience the ultimate tropical getaway in Bali.',
    duration_days: 7,
    duration_nights: 6,
    is_active: true,
    is_featured: true,
    meta_title: 'Tropical Bali Getaway',
    meta_description: '7 days in tropical Bali.',
    media: [
        { display_order: 1, is_featured: true, image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1080&auto=format&fit=crop' }
    ],
    inclusions: [
        { description: 'Flight', is_included: true },
        { description: 'Hotel', is_included: true },
        { description: 'Transfers', is_included: true },
        { description: 'Breakfast', is_included: true }
    ],
    itineraries: [
        { day_number: 1, title: 'Arrival', description: 'Arrive in Bali', location: 'Denpasar' },
        { day_number: 2, title: 'Beach Day', description: 'Relax at the beach', location: 'Kuta' },
        { day_number: 3, title: 'Culture Tour', description: 'Visit temples', location: 'Ubud' }
    ]
  },
  {
    title: 'Swiss Alps Adventure',
    slug: 'swiss-alps',
    city: 'Zurich',
    country: 'Switzerland',
    currency: 'USD',
    description: 'Thrilling adventure in the snowy Swiss Alps.',
    duration_days: 5,
    duration_nights: 4,
    is_active: true,
    is_featured: true,
    meta_title: 'Swiss Alps Adventure',
    meta_description: '5 days skiing the Alps.',
    media: [
        { display_order: 1, is_featured: true, image_url: 'https://images.unsplash.com/photo-1531366936310-6cb1c83a149a?q=80&w=1080&auto=format&fit=crop' }
    ],
    inclusions: [
        { description: 'Flight', is_included: true },
        { description: 'Resort', is_included: true },
        { description: 'Ski Pass', is_included: true },
        { description: 'All Meals', is_included: true }
    ],
    itineraries: [
        { day_number: 1, title: 'Arrival', description: 'Arrive in Swiss Alps', location: 'Zurich' },
        { day_number: 2, title: 'Skiing', description: 'Hit the slopes', location: 'Zermatt' },
        { day_number: 3, title: 'Mountain Tour', description: 'Scenic views', location: 'Matterhorn' }
    ]
  },
  {
    title: 'Tokyo City Explorer',
    slug: 'tokyo-explorer',
    city: 'Tokyo',
    country: 'Japan',
    currency: 'USD',
    description: 'Immerse yourself in neon-lit Tokyo.',
    duration_days: 10,
    duration_nights: 9,
    is_active: true,
    is_featured: true,
    meta_title: 'Tokyo City Explorer',
    meta_description: '10 days exploring Tokyo.',
    media: [
        { display_order: 1, is_featured: true, image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1080&auto=format&fit=crop' }
    ],
    inclusions: [
        { description: 'Flight', is_included: true },
        { description: 'Hotel', is_included: true },
        { description: 'JR Pass', is_included: true },
        { description: 'Guided Tour', is_included: true }
    ],
    itineraries: [
        { day_number: 1, title: 'Arrival', description: 'Arrive in Tokyo', location: 'Narita' },
        { day_number: 2, title: 'City Tour', description: 'Explore Shibuya', location: 'Shibuya' },
        { day_number: 3, title: 'Tech District', description: 'Visit Akihabara', location: 'Akihabara' }
    ]
  }
];

export const useFeaturedPackages = () => {
  return useQuery({
    queryKey: ['featured-packages'],
    queryFn: () => MainService.getFeaturedPackages(),
    retry: 1, // Don't retry endlessly so we can fallback quickly
  });
};

export const useMyPackages = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['saved-packages'],
    queryFn: async () => {
      // Fetch saved packages using the correct endpoint
      try {
          return await clientService.getSavedPackages(); 
      } catch {
          // If the endpoint doesn't exist yet, we just swallow the error
          return [];
      }
    },
    enabled: isAuthenticated, // Only fetch if logged in
    retry: false,
  });
};

export const useTogglePackageSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => clientService.toggleSavedPackage(slug),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['saved-packages'] });
    },
  });
};


export const useSearchPackages = (request: any, queryOptions = {}) => {
  return useQuery<GetPackagesResponseDTO>({
    queryKey: ['packages-search', request],
    queryFn: async () => {
      const res = await MainService.searchPackages(request) as { data: GetPackagesResponseDTO };
      return res.data;
    },
    ...queryOptions,
  });
};
