"use client";

import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/lib/services/client.service';

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['client-bookings'],
    queryFn: () => clientService.getMyBookings(),
  });
};

export const useClientProfile = () => {
  return useQuery({
    queryKey: ['client-profile'],
    queryFn: () => clientService.getProfile(),
  });
};
