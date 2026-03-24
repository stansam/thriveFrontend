"use client";

import Image from "next/image";
import { PackageDetailsGalleryProps } from "../../_props/package-details";


export function PackageDetailsGallery({ images }: PackageDetailsGalleryProps) {
    if (images.length <= 1) return null;

    return (
        <section id="gallery" className="space-y-6 pt-8">
            <h2 className="text-2xl font-bold">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                    <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group cursor-zoom-in">
                        <Image
                            src={img}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                ))}
            </div>
        </section>
    );
}
