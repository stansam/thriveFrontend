// ─── Admin Domain Types ─────────────────────────────────────────────────────
// Reflects the Flask API response shapes for /api/admin/* endpoints.

export interface AdminActivityEvent {
  event: string;
  timestamp: string;
}

export interface AdminDashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  recentActivity: AdminActivityEvent[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
