import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function TermsOfUseDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="hover:text-white transition-colors">Terms of Use</button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-[#1a1a1a] text-white border-white/10">
                <DialogHeader>
                    <DialogTitle>Terms of Use</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Please read these terms carefully before using our services.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-white/80 mt-4">
                    <h4 className="font-bold text-white">1. Booking &amp; Payments</h4>
                    <p>All bookings are subject to availability and confirmation. Prices are subject to change until tickets are issued.</p>
                    <h4 className="font-bold text-white">2. Cancellations &amp; Refunds</h4>
                    <p>Cancellation policies vary by airline and service provider. Thrive Global Travel &amp; Tours service fees are non-refundable.</p>
                    <h4 className="font-bold text-white">3. Travel Documents</h4>
                    <p>Travelers are responsible for ensuring they have valid passports, visas, and other necessary travel documents.</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
