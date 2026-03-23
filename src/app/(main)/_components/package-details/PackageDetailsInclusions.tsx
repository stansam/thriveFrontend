"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/(main)/_components/tabs";
import type { PackageInclusionDTO } from "@/lib/dtos/package.dto";

interface PackageDetailsInclusionsProps {
    inclusions?: PackageInclusionDTO[];
}

export function PackageDetailsInclusions({ inclusions }: PackageDetailsInclusionsProps) {
    return (
        <section id="inclusions">
            <h2 className="text-2xl font-bold mb-6">What&apos;s Included</h2>
            <Tabs defaultValue="included" className="w-full">
                <TabsList className="bg-neutral-900 border border-white/10 w-full justify-start h-auto p-1">
                    <TabsTrigger value="included" className="flex-1 md:flex-none px-6 py-2.5 text-white data-[state=active]:bg-emerald-600">
                        Included
                    </TabsTrigger>
                    <TabsTrigger value="excluded" className="flex-1 md:flex-none px-6 py-2.5 text-white data-[state=active]:bg-red-900/50 data-[state=active]:text-red-100">
                        Not Included
                    </TabsTrigger>
                </TabsList>
                <div className="mt-6 bg-neutral-900/30 rounded-xl p-6 border border-white/5">
                    <TabsContent value="included" className="mt-0">
                        <ul className="grid md:grid-cols-2 gap-4">
                            {inclusions?.map((item: PackageInclusionDTO, idx: number) => (
                                <li key={idx} className="flex gap-3 text-neutral-300">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span>{item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                </div>
            </Tabs>
        </section>
    );
}
