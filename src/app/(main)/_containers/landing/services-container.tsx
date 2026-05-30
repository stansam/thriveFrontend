"use client";

import { AlertCircle } from "lucide-react";
import { ServicesMarquee } from "../../_components/landing/services-marquee";
import { useServices } from "@/lib/hooks/shared/use-services";
import { HERO_COPY, LANDING_SERVICES } from "@/lib/constants/landing.constants";
import { IS_DEV } from "@/lib/constants/env.constants";
import { ServicesMarqueeSkeleton } from "../../_fallback/landing/services-marquee.skeleton";

export function ServicesContainer() {
  const { data: services, isLoading, isError } = useServices();

  if (isLoading) {
    return <ServicesMarqueeSkeleton />;
  }

  if (isError && !IS_DEV) {
    return (
      <div className="flex flex-col justify-center items-center py-12 bg-black text-neutral-500 gap-2">
        <AlertCircle className="h-6 w-6" aria-hidden />
        <p>Services unavailable at this time.</p>
      </div>
    );
  }

  const displayServices = services ?? LANDING_SERVICES;

  if (displayServices.length === 0) {
    return null;
  }

  return (
    <ServicesMarquee
      title={HERO_COPY.services_title}
      description={HERO_COPY.services_description}
      services={displayServices}
      className="bg-black text-white py-12"
    />
  );
}
