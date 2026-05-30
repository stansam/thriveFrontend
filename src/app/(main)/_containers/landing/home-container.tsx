"use client";

import { useHomeHero } from "@/lib/hooks/features/use-home-hero";
import { HomeHeroView } from "../../_components/landing/home-hero-view";

export function HomeContainer() {
  const { activeForm, toggleForm } = useHomeHero();

  return <HomeHeroView activeForm={activeForm} onToggleForm={toggleForm} />;
}
