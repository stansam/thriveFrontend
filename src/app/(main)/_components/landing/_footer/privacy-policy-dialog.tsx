import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function PrivacyPolicyDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="hover:text-white transition-colors">Privacy Policy</button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-[#1a1a1a] text-white border-white/10">
                <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Last updated: March 2, 2026
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-white/80 mt-4">
                    <p>At Thrive Global Travel &amp; Tours, we value your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
                    <h4 className="font-bold text-white">1. Information Collection</h4>
                    <p>We collect information necessary to process your bookings, such as name, contact details, passport information, and payment details.</p>
                    <h4 className="font-bold text-white">2. Use of Information</h4>
                    <p>Your data is used solely for travel arrangements, communication regarding your trip, and improving our services.</p>
                    <h4 className="font-bold text-white">3. Data Protection</h4>
                    <p>We implement security measures to protect your personal information from unauthorized access.</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
