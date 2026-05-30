"use client";

import { useCallback } from "react";
import { useScrollThreshold } from "@/lib/hooks/features/use-scroll";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FloatingActionButtonsProps } from "../_props/common.props";
import { WhatsappButton } from "./_floating/whatsapp-button";
import { BackToTopButton } from "./_floating/back-to-top-button";

export function FloatingActionButtons({
  className,
  scrollThreshold = 400,
}: FloatingActionButtonsProps) {
  const showBackToTop = useScrollThreshold(scrollThreshold);
  const prefersReducedMotion = useReducedMotion();

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  }, [prefersReducedMotion]);

  const spring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

  const fadeIn = {
    initial: { scale: 0.6, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.6, opacity: 0 },
    transition: spring,
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 pointer-events-none",
        className
      )}
      aria-hidden="false"
    >
      <WhatsappButton fadeIn={fadeIn} />

      <AnimatePresence mode="wait">
        {showBackToTop && (
          <BackToTopButton fadeIn={fadeIn} onClick={scrollToTop} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FloatingActionButtons;