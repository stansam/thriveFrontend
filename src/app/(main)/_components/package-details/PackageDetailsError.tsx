"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PackageDetailsError() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-4 text-center">
            <div className="bg-red-500/10 p-4 rounded-full">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Trip Not Found</h1>
                <p className="text-neutral-400 max-w-md">
                    We couldn&apos;t locate the package you&apos;re looking for. It may have been removed or is temporarily unavailable.
                </p>
            </div>
            <Button asChild variant="outline" className="border-white/20 hover:bg-white/10">
                <a href="/trips/results">Explore Other Trips</a>
            </Button>
        </div>
    );
}
