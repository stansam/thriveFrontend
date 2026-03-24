"use client";

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/lib/services/admin.service';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getDashboardStats(),
  });
};

export const useSystemUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getSystemUsers(),
  });
};
