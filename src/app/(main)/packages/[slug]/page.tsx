import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPackageDetailsCached } from "./data";
import { PackageDetailsContainer } from "../../_containers/package-details/PackageDetailsContainer";

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
    // Validate data server-side — missing packages trigger the not-found boundary.
    // Render errors are caught by the route segment's error.tsx boundary.
    const pkg = await getPackageDetailsCached(slug).catch(() => null);
    if (!pkg) notFound();
    return <PackageDetailsContainer slug={slug} />;
}