import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTogglePackageSave } from "@/lib/hooks/shared/use-packages"
import { WishlistButtonProps } from "@/lib/props/feature/wishlist.props"

export function WishlistButton({ packageSlug, isSaved = false, className }: WishlistButtonProps) {
    const [optimisticSaved, setOptimisticSaved] = useState(isSaved)
    const { mutate: toggleSave, isPending } = useTogglePackageSave()

    useEffect(() => {
        setOptimisticSaved(isSaved)
    }, [isSaved])

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setOptimisticSaved(!optimisticSaved)
        toggleSave(packageSlug, {
            onError: () => {
                // Revert on error
                setOptimisticSaved(isSaved)
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="icon"
            disabled={isPending}
            className={cn("rounded-full border-neutral-700 bg-black/50 hover:bg-neutral-800 transition-colors", className)}
            onClick={handleToggle}
        >
            {isPending ? (
                <Loader2 className="size-4 animate-spin text-white" />
            ) : (
                <Heart className={cn("size-4", optimisticSaved ? "fill-red-500 text-red-500" : "text-white")} />
            )}
        </Button>
    )
}

