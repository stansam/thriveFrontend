import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    buttonVariant?: "default" | "outline";
    highlight?: boolean;
}

export function PricingCard({
    title,
    price,
    description,
    features,
    buttonVariant = "default",
    highlight = false,
}: PricingCardProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md",
                highlight
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border bg-card"
            )}
        >
            {highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                    Most Popular
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <div className="mt-2 flex items-baseline text-3xl font-bold">
                    {price}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
            <ul className="mb-8 flex flex-1 flex-col gap-3">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
            <Button variant={buttonVariant} className="w-full">
                Get Started
            </Button>
        </div>
    );
}
