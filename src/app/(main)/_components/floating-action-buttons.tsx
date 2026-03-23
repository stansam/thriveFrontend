"use client"

import { useCallback } from "react"
import { useScrollThreshold } from "@/lib/hooks/features/use-scroll"
import { ArrowUp, MessageCircle } from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CONTACT, WHATSAPP_FALLBACK } from "@/lib/constants/contact.constants"
import { FloatingActionButtonsProps } from "../_props/common.props"



export function FloatingActionButtons({
  className,
  scrollThreshold = 400,
}: FloatingActionButtonsProps) {
  const showBackToTop = useScrollThreshold(scrollThreshold)
  const prefersReducedMotion = useReducedMotion()

  const whatsappHref =
    typeof CONTACT?.whatsappUrl === "string" && CONTACT.whatsappUrl.trim() !== ""
      ? CONTACT.whatsappUrl
      : WHATSAPP_FALLBACK

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "instant" : "smooth" })
  }, [prefersReducedMotion])

  const spring = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 }

  const fadeIn = {
    initial: { scale: 0.6, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit:    { scale: 0.6, opacity: 0 },
    transition: spring,
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 pointer-events-none",
        className
      )}
      aria-hidden="false"
    >
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        {...fadeIn}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className={cn(
          "pointer-events-auto",
          "flex items-center justify-center",
          "h-12 w-12 rounded-full shadow-lg",
          "bg-[#25D366] text-white",
          "transition-colors duration-150 hover:bg-[#1ebe5d]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        )}
      >
        <MessageCircle className="h-5 w-5 fill-current" aria-hidden="true" />
      </motion.a>

      <AnimatePresence mode="wait">
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            {...fadeIn}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className={cn(
              "pointer-events-auto",
              "flex items-center justify-center",
              "h-12 w-12 rounded-full shadow-lg",
              "bg-primary text-primary-foreground",
              "transition-colors duration-150 hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}