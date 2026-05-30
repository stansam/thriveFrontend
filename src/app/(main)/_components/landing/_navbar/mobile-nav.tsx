"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { CONTACT } from "@/lib/constants/contact.constants";
import type { MobileNavProps } from "../../../_props/landing/navbar.props";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-full bg-black border-white/10 p-6 text-white max-h-[80vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        <div className="flex flex-col gap-6">
          <p className="font-semibold text-lg border-b border-white/10 pb-2">
            Menu
          </p>
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
            <a
              href={CONTACT.whatsappUrl}
              className="text-[#88734C] font-mono text-lg"
            >
              {CONTACT.whatsapp}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
