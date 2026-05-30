"use client";

import { motion, type MotionProps } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopButtonProps {
  fadeIn: MotionProps;
  onClick: () => void;
}

export function BackToTopButton({ fadeIn, onClick }: BackToTopButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scroll back to top"
      {...fadeIn}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className={cn(
        "pointer-events-auto flex items-center justify-center h-12 w-12 rounded-full shadow-lg bg-neutral-900 border border-white/10 text-white transition-colors duration-150 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </motion.button>
  );
}

export default BackToTopButton;
