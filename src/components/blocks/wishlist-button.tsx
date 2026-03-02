import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
    packageId: string
    initialIsSaved?: boolean
    className?: string
}

export function WishlistButton({ packageId, initialIsSaved = false, className }: WishlistButtonProps) {
    const [isSaved, setIsSaved] = useState(initialIsSaved)

    const toggleSaved = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsSaved(!isSaved)
        // TODO: Wire up to actual API endpoint to save the package
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn("rounded-full border-neutral-700 bg-black/50 hover:bg-neutral-800 transition-colors", className)}
            onClick={toggleSaved}
        >
            <Heart className={cn("size-4", isSaved ? "fill-red-500 text-red-500" : "text-white")} />
        </Button>
    )
}
