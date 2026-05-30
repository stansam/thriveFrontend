"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFeaturedPackages, useMyPackages } from "@/lib/hooks/shared/use-packages";
import { FALLBACK_PACKAGES } from "@/lib/fallback/packages.fallback";
import { useAuth } from "@/lib/auth-context";
import type { PackageDTO } from "@/lib/dtos/package.dto";
import { IS_DEV } from "@/lib/constants/env.constants";
import { FeaturedPackagesView } from "../../_components/landing/featured-packages-view";

export function FeaturedPackagesContainer() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: apiPackages,
    isLoading,
    isError,
  } = useFeaturedPackages();
  const { data: savedPackages, isError: isSavedError } = useMyPackages();

  const extractedPackages: PackageDTO[] = apiPackages?.packages ?? [];
  const isEmpty = !isLoading && !isError && extractedPackages.length === 0;

  const displayFallback = isError || (IS_DEV && isEmpty);
  const packages: PackageDTO[] = displayFallback
    ? FALLBACK_PACKAGES
    : extractedPackages;

  const isPackageSaved = useCallback(
    (slug: string): boolean =>
      savedPackages?.some((p: PackageDTO) => p.slug === slug) ?? false,
    [savedPackages]
  );

  const handleViewPackage = useCallback(
    (slug: string) => {
      router.push(`/packages/${slug}`);
    },
    [router]
  );

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["featured-packages"] });
  }, [queryClient]);

  return (
    <FeaturedPackagesView
      packages={packages}
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty}
      displayFallback={displayFallback}
      isAuthenticated={isAuthenticated}
      isSavedError={isSavedError ?? false}
      isPackageSaved={isPackageSaved}
      onViewPackage={handleViewPackage}
      onRetry={handleRetry}
    />
  );
}
