"use client";

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Placeholder */}
        <div className="h-6 w-28 animate-pulse rounded bg-neutral-800" />
        
        {/* Navigation Links Placeholder */}
        <div className="hidden md:flex space-x-8">
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-800" />
          <div className="h-4 w-16 animate-pulse rounded bg-neutral-800" />
        </div>

        {/* User Profile / Notifications Placeholder */}
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-800" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-800" />
        </div>
      </div>
    </header>
  );
}
