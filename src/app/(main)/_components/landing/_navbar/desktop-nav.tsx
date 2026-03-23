import Link from 'next/link'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { DesktopNavProps } from '../../../_props/landing/navbar.props'

export function DesktopNav({ links }: DesktopNavProps) {
    return (
        <div className="hidden md:flex">
            <NavigationMenu>
                <NavigationMenuList>
                    {links.map((link) => (
                        <NavigationMenuItem key={link.href}>
                            <NavigationMenuLink
                                asChild
                                className={cn(navigationMenuTriggerStyle(), 'bg-transparent text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer')}
                            >
                                <Link href={link.href}>{link.label}</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
