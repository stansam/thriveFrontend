"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./_navbar/mobile-nav";
import { NotificationBell } from "./_navbar/notification-bell";
import { UserMenu } from "./_navbar/user-menu";
import { NavbarTopStrip } from "./_navbar/navbar-top-strip";
import { DesktopNav } from "./_navbar/desktop-nav";
import type { NavbarProps } from "../../_props/landing/navbar.props";

export function Navbar({
  links,
  isAuthenticated,
  user,
  onLogout,
  notifications,
  unreadCount,
  onMarkAllRead,
  onOpenNotifications,
}: NavbarProps) {
  return (
    <>
      <NavbarTopStrip />
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/80 border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-white tracking-tight"
            >
              THRIVE<span className="text-[#88734C] sm:inline">.</span>
            </Link>
            <DesktopNav links={links} />
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationBell
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllRead={onMarkAllRead}
                  onOpenModal={onOpenNotifications}
                />
                <UserMenu user={user} onLogout={onLogout} />
              </>
            ) : (
              <>
                <Link href="/auth?tab=sign-in">
                  <Button className="bg-[#88734C] hover:bg-[#7a6540] text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?tab=sign-up">
                  <Button className="bg-white text-black hover:bg-neutral-200">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            <MobileNav links={links} />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;

