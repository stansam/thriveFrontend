'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CONTACT } from '@/lib/constants/contact.constants'
import { MobileNavProps } from '../../../_props/landing/navbar.props'

export function MobileNav({ links }: MobileNavProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-white hover:bg-white/10"
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full h-[calc(100vh-8rem)] overflow-y-auto bg-black border-none p-6 text-white"
                align="start"
                side="bottom"
            >
                <div className="flex flex-col gap-6">
                    <p className="font-semibold text-lg border-b border-white/10 pb-2">Menu</p>
                    {links.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-xl font-medium text-white/80 hover:text-[#88734C]"
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="mt-8 border-t border-white/10 pt-4">
                        <p className="text-sm text-white/60 mb-2">Need help?</p>
                        <a href={CONTACT.whatsappUrl} className="text-[#88734C] font-mono text-lg">
                            {CONTACT.whatsapp}
                        </a>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
