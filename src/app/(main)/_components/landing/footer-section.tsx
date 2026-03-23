"use client"

import Link from 'next/link'
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from 'lucide-react'

import { FOOTER_LINKS } from '../../_constants/landing/footer.constants'
import { PrivacyPolicyDialog } from './_footer/privacy-policy-dialog'
import { TermsOfUseDialog } from './_footer/terms-of-use-dialog'

export default function FooterSection() {
    return (
        <footer className="py-16 md:py-24 bg-black text-white border-t border-white/10">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-col items-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Thrive Global Travel &amp; Tours</h3>
                    <p className="text-white/60 text-center max-w-md">
                        Your premium partner for stress-free travel, flight bookings, and corporate solutions.
                    </p>
                </div>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {FOOTER_LINKS.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-white/60 hover:text-[#88734C] block duration-150 font-medium">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-[#88734C] block transition-colors">
                        <Facebook className="size-5" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-[#88734C] block transition-colors">
                        <Instagram className="size-5" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-[#88734C] block transition-colors">
                        <Twitter className="size-5" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-[#88734C] block transition-colors">
                        <Linkedin className="size-5" />
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12 pt-8 border-t border-white/5 text-xs text-white/40">
                    <span>© {2026} Thrive Global Travel &amp; Tours. All rights reserved.</span>

                    <div className="flex gap-6">
                        <PrivacyPolicyDialog />
                        <TermsOfUseDialog />
                    </div>
                </div>
            </div>
        </footer>
    )
}
