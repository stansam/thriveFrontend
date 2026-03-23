import { CONTACT } from '@/lib/constants/contact.constants'

export function NavbarTopStrip() {
    return (
        <div className="bg-black text-white py-2 px-4 text-xs md:text-sm font-medium border-b border-white/10 relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                <span className="hidden sm:inline text-white/70">Premium Travel Services</span>
                <div className="flex items-center gap-2">
                    <span className="text-[#88734C] animate-pulse">Urgent flight or quote?</span>
                    <span>
                        WhatsApp:{' '}
                        <a href={CONTACT.whatsappUrl} className="hover:text-[#88734C] transition-colors font-mono">
                            {CONTACT.whatsapp}
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}
