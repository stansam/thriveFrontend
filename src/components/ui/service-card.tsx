import { LucideIcon } from "lucide-react"

export function ServiceCard({ title, description, icon: Icon }: { title: string, description: string, icon: LucideIcon }) {
    return (
        <div className="flex w-[280px] flex-col items-center justify-center p-6 bg-neutral-900 border border-neutral-800 rounded-xl m-2 transition-all hover:border-neutral-700">
            <div className="mb-4 rounded-full bg-neutral-800 p-3 text-emerald-500">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white text-center">{title}</h3>
            <p className="text-sm text-neutral-400 text-center">{description}</p>
        </div>
    )
}
