import { useQuery } from '@tanstack/react-query';
import { MainService } from '@/lib/services/main.service';
import { clientService } from '@/lib/services/client.service';
import { useAuth } from '@/lib/auth-context';

export const FALLBACK_PACKAGES = [
  {
    id: 'placeholder-1',
    slug: 'bali-getaway',
    name: 'Tropical Bali Getaway',
    featured_image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1080&auto=format&fit=crop',
    duration_days: 7,
    duration_nights: 6,
    starting_price: 1299,
    highlights: ['Beach', 'Culture', 'Relaxation'],
    inclusions: ['Flight', 'Hotel', 'Transfers', 'Breakfast'],
  },
  {
    id: 'placeholder-2',
    slug: 'swiss-alps',
    name: 'Swiss Alps Adventure',
    featured_image: 'https://images.unsplash.com/photo-1531366936310-6cb1c83a149a?q=80&w=1080&auto=format&fit=crop',
    duration_days: 5,
    duration_nights: 4,
    starting_price: 2499,
    highlights: ['Skiing', 'Mountains', 'Luxury'],
    inclusions: ['Flight', 'Resort', 'Ski Pass', 'All Meals'],
  },
  {
    id: 'placeholder-3',
    slug: 'tokyo-explorer',
    name: 'Tokyo City Explorer',
    featured_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1080&auto=format&fit=crop',
    duration_days: 10,
    duration_nights: 9,
    starting_price: 1899,
    highlights: ['City', 'Food', 'Technology'],
    inclusions: ['Flight', 'Hotel', 'JR Pass', 'Guided Tour'],
  },
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
    queryKey: ['my-packages'],
    queryFn: async () => {
      // Use clientService or equivalent to fetch saved packages
      // If there's no specific endpoint, we return empty array for now
      try {
          return await clientService.getMyBookings(); 
      } catch (err) {
          // If the endpoint doesn't exist yet, we just swallow the error
          return [];
      }
    },
    enabled: isAuthenticated, // Only fetch if logged in
    retry: false,
  });
};
