import { NavItem } from "../../_types/landing/navbar.types";
import type { Notification } from '@/components/ui/notifications-modal'
import type { UserMenuUser } from "../../_types/landing/navbar.types";

export interface DesktopNavProps {
    links: { href: string; label: string }[]
}

export interface MobileNavProps {
    links: NavItem[]
}

export interface NotificationBellProps {
    notifications: Notification[]
    unreadCount: number
    onMarkAllRead: () => void
    onOpenModal: () => void
}

export interface UserMenuProps {
    user: UserMenuUser | null
    onLogout: () => void
}
