import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useFeaturedPackages, useMyPackages, FALLBACK_PACKAGES } from "@/lib/hooks/shared/use-packages";
import { PackageDTO } from "@/lib/dtos/package.dto";
import { AlertCircle } from "lucide-react";
import { WishlistButton } from "@/components/blocks/wishlist-button";
import { useAuth } from "@/lib/auth-context";

export function FeaturedPackages() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data: apiPackages, isLoading, isError } = useFeaturedPackages();
    const { data: saved, isError: isSavedError } = useMyPackages();
    const isPackageSaved = (slug: string) => saved?.some((p: PackageDTO) => p.slug === slug);

    const extractedPackages = apiPackages?.packages || [];
    const showFallback = !isLoading && !isError && extractedPackages.length === 0;
    const packages: PackageDTO[] = showFallback ? FALLBACK_PACKAGES : extractedPackages;

    const handleViewPackage = (slug: string) => {
        router.push(`/packages/${slug}`);
    };

    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
            setCurrentSlide(carouselApi.selectedScrollSnap());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => {
            carouselApi.off("select", updateSelection);
        };
    }, [carouselApi]);

    return (
        <section className="relative py-24 bg-black text-white" id="featured-tours">
            <div className="container mx-auto px-4">
                <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                            Featured Travels & Tours
                        </h2>
                        <p className="max-w-lg text-muted-foreground">
                            Discover our hand-picked selection of exclusive travel packages tailored for unforgettable experiences.
                        </p>
                    </div>
                    <div className="hidden shrink-0 gap-2 md:flex">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            className="rounded-full border-neutral-700 bg-black hover:bg-neutral-800 disabled:opacity-50"
                        >
                            <ArrowRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full">
                {isLoading && (
                    <div className="flex justify-center items-center h-64 text-neutral-500">
                        Loading featured tours...
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col justify-center items-center h-64 text-red-400 gap-2">
                        <AlertCircle className="h-8 w-8" />
                        <p>Unable to load featured tours at this time.</p>
                        <Button
                            variant="outline"
                            className="mt-4 border-white/20 text-white hover:bg-white/10"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && (
                    <>
                        {showFallback && (
                            <div className="mb-4 text-center text-sm text-neutral-500 italic">
                                * Displaying sample packages (No featured packages found)
                            </div>
                        )}
                        <Carousel
                            setApi={setCarouselApi}
                            opts={{
                                breakpoints: {
                                    "(max-width: 768px)": {
                                        dragFree: true,
                                    },
                                },
                            }}
                        >
                            <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10 hidden md:block">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => carouselApi?.scrollPrev()}
                                    disabled={!canScrollPrev}
                                    className="rounded-full h-12 w-12 border-neutral-700 bg-black/50 backdrop-blur-sm text-white hover:bg-black hover:text-white disabled:opacity-30"
                                >
                                    <ArrowLeft className="size-6" />
                                </Button>
                            </div>

                            <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10 hidden md:block">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => carouselApi?.scrollNext()}
                                    disabled={!canScrollNext}
                                    className="rounded-full h-12 w-12 border-neutral-700 bg-black/50 backdrop-blur-sm text-white hover:bg-black hover:text-white disabled:opacity-30"
                                >
                                    <ArrowRight className="size-6" />
                                </Button>
                            </div>

                            <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
                                {packages.map((item: PackageDTO) => (
                                    <CarouselItem
                                        key={item.slug}
                                        className="max-w-[340px] pl-[20px] lg:max-w-[400px]"
                                    >
                                        <div className="group relative h-full flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50">
                                            <div className="relative aspect-4/3 w-full overflow-hidden">
                                                <Image
                                                    src={item.media?.find(m => m.is_featured)?.image_url || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1080&auto=format&fit=crop"}
                                                    alt={item.title || "Tour Package"}
                                                    fill
                                                    priority
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-neutral-900 to-transparent pointer-events-none" />
                                                <div className="absolute top-4 left-4">
                                                    <div className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                                                        {item.duration_days} Days • {item.duration_nights} Nights
                                                    </div>
                                                </div>
                                                {isAuthenticated && (
                                                    <div className="absolute top-4 right-4">
                                                        {isSavedError ? (
                                                            // <AlertCircle className="w-6 h-6 text-red-500" />
                                                            <div style={{ display: 'none' }}></div>
                                                        ) : (
                                                            <WishlistButton
                                                                packageSlug={item.slug}
                                                                isSaved={isPackageSaved(item.slug)}
                                                                className="bg-black/20 hover:bg-black/40 text-white"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between p-6">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-4 leading-tight line-clamp-2">{item.title}</h3>

                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {(item.itineraries || []).slice(0, 3).map((it, idx: number) => (
                                                            <span key={idx} className="max-w-[100px] truncate text-[10px] tracking-wide px-2 py-1 rounded-full bg-white/10 text-white/90">
                                                                {it.title}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-4 text-sm">
                                                        <div>
                                                            <h4 className="font-semibold mb-2 text-white/90">What’s Included</h4>
                                                            <ul className="grid grid-cols-1 gap-1">
                                                                {(item.inclusions || []).filter(inc => inc.is_included).slice(0, 3).map((inc, i: number) => (
                                                                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                                                                        <Check className="size-3 text-green-500 shrink-0" /> <span className="truncate">{inc.description}</span>
                                                                    </li>
                                                                ))}
                                                                {(item.inclusions?.filter(inc => inc.is_included)?.length || 0) > 3 && (
                                                                    <li className="text-xs text-muted-foreground pl-5">+ {(item.inclusions?.filter(inc => inc.is_included)?.length || 0) - 3} more</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleViewPackage(item.slug)}
                                                    className="w-full mt-6 bg-white text-black hover:bg-neutral-200"
                                                >
                                                    View Package
                                                    <ArrowRight className="ml-2 size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <div className="mt-8 flex justify-center gap-2">
                            {packages.map((_, index: number) => (
                                <button
                                    key={index}
                                    className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index ? "bg-white" : "bg-neutral-700"
                                        }`}
                                    onClick={() => carouselApi?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section >
    );
};
