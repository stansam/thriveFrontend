'use client'

import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NotificationBellProps } from '../../../_props/landing/navbar.props'

export function NotificationBell({ notifications, unreadCount, onMarkAllRead, onOpenModal }: NotificationBellProps) {
    const recentNotifications = notifications.slice(0, 3)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="relative text-white hover:bg-white/10"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#88734C] animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-[#1a1a1a] border-white/10 text-white">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <span
                            onClick={onMarkAllRead}
                            className="text-xs font-normal text-[#88734C] cursor-pointer hover:underline"
                        >
                            Mark all read
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {recentNotifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-white/50">No new notifications</div>
                ) : (
                    recentNotifications.map((notif) => (
                        <DropdownMenuItem
                            key={notif.id}
                            className="cursor-pointer focus:bg-white/5 p-3 flex flex-col items-start gap-1"
                        >
                            <div className="flex justify-between w-full">
                                <span className={`font-medium text-sm ${notif.read ? 'text-white/60' : 'text-white'}`}>
                                    {notif.title}
                                </span>
                                {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-[#88734C]" />}
                            </div>
                            <p className="text-xs text-white/50 line-clamp-2">{notif.body}</p>
                        </DropdownMenuItem>
                    ))
                )}
                <DropdownMenuSeparator className="bg-white/10" />
                <div className="p-2">
                    <Button
                        variant="outline"
                        className="w-full h-8 text-xs text-gray-900 border-white/20 hover:bg-white/10 hover:text-white"
                        onClick={onOpenModal}
                    >
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
