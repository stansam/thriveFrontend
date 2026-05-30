"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/hooks/features/use-notifications";
import { MOCK_NOTIFICATIONS } from "@/lib/__fixtures__/notifications.fixture";
import { NAV_LINKS } from "../../_fallback/landing/navbar.fallback";
import { Navbar } from "../../_components/landing/navbar";
import { NotificationsModal } from "@/components/ui/notifications-modal";
import { NavbarSkeleton } from "../../_fallback/landing/navbar.skeleton";

export function NavbarContainer() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotifications(MOCK_NOTIFICATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <NavbarSkeleton />;

  return (
    <>
      <Navbar
        links={NAV_LINKS}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onOpenNotifications={() => setIsModalOpen(true)}
      />
      <NotificationsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        notifications={notifications}
        onMarkRead={markRead}
        onDelete={deleteNotification}
      />
    </>
  );
}
