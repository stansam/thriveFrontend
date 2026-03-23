"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export function PackageDetailsLoading() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <p className="text-neutral-400 animate-pulse">Curating your experience...</p>
            </div>
        </div>
    );
}
