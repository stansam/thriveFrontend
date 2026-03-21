"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { NotificationsModal } from '@/components/ui/notifications-modal'
import { NAV_LINKS, MOCK_NOTIFICATIONS } from './_navbar/navbar.constants'
import { MobileNav } from './_navbar/mobile-nav'
import { NotificationBell } from './_navbar/notification-bell'
import { UserMenu } from './_navbar/user-menu'
import { NavbarTopStrip } from './_navbar/navbar-top-strip'
import { DesktopNav } from './_navbar/desktop-nav'
import type { Notification } from '@/components/ui/notifications-modal'

export default function Navbar() {
    const { isAuthenticated, user, logout, loading } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

    if (loading) return null

    const unreadCount = notifications.filter((n) => !n.read).length

    const handleMarkRead = (id: string) =>
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))

    const handleDelete = (id: string) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id))

    const markAllRead = () =>
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

    return (
        <>
            <NavbarTopStrip />

            {/* Sticky Navbar */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/80 border-b border-white/5 transition-all duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo + Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-bold text-white tracking-tight">
                            THRIVE<span className="text-[#88734C]">.</span>
                        </Link>
                        <DesktopNav links={NAV_LINKS} />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <NotificationBell
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    onMarkAllRead={markAllRead}
                                    onOpenModal={() => setIsModalOpen(true)}
                                />
                                <UserMenu user={user} onLogout={logout} />
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button className="bg-[#88734C] hover:bg-[#7a6540] text-white">Sign In</Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button className="bg-white text-black hover:bg-neutral-200">Get Started</Button>
                                </Link>
                            </>
                        )}
                        <MobileNav links={NAV_LINKS} />
                    </div>
                </div>
            </header>

            {/* Notifications Modal */}
            <NotificationsModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
            />
        </>
    )
}
