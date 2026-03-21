import { PackageDetailsContainer } from "@/containers/package-details-container";

export default async function TripDetailsPage({ params }: { params: { slug: string } }) {
    const param = await params;
    const slug = param.slug;
    return <PackageDetailsContainer slug={slug} />;
}