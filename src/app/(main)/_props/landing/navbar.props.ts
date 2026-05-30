import type { NavItem } from "../../_types/landing/navbar.types";
import type { Notification } from "@/lib/types/notification.types";
import type { UserDTO } from "@/lib/dtos/auth.dto";

export interface DesktopNavProps {
  links: { href: string; label: string }[];
}

export interface MobileNavProps {
  links: NavItem[];
}

export interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onOpenModal: () => void;
}

export interface UserMenuProps {
  user: UserDTO | null;
  onLogout: () => void;
}

export interface NavbarProps {
  links: NavItem[];
  isAuthenticated: boolean;
  user: UserDTO | null;
  onLogout: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onOpenNotifications: () => void;
}
