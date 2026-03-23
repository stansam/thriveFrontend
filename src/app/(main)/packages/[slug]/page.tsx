import type { Metadata } from "next";
import { getPackageDetailsCached } from "./data"; 
import { PackageDetailsContainer } from "@/containers/PackageDetailsContainer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    try {
        const pkg = await getPackageDetailsCached(slug);
        return {
            title: pkg.meta_title || pkg.title,
            description: pkg.meta_description || pkg.description,
        };
    } catch {
        return {
            title: "Package Details",
        };
    }
}

export default async function PackageDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    try{
        return <PackageDetailsContainer slug={slug} />;
    } catch{
        return <div>Failed to load package</div>;
    }
}