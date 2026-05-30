"use client";

import { useAboutUsAnimations } from "@/lib/hooks/features/use-about-us-animations";
import { AboutUsSection } from "../../_components/landing/about-us-section";

export function AboutUsContainer() {
  const animations = useAboutUsAnimations();
  return <AboutUsSection {...animations} />;
}

export default AboutUsContainer;
