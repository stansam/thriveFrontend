import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import { AppProviders } from '@/lib/providers/app-providers'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import '../globals.css'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Thrive Global Travel & Tours',
    template: '%s | Thrive',
  },
  description:
    'Thrive Global Travel & Tours — premium flight bookings, group travel, corporate travel planning, and custom itineraries. Fast quotes, affordable fees, world-class service.',
  openGraph: {
    title: 'Thrive Global Travel & Tours',
    description:
      'Premium travel services for individuals, groups, and corporations. Book flights, plan trips, and explore the world with Thrive.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thrive Global Travel & Tours',
    description: 'Premium travel services — flights, group travel, corporate packages and more.',
  },
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
        <AppProviders>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AppProviders>
        </Suspense>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
