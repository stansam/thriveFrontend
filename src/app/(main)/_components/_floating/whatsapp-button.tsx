"use client";

import { motion, type MotionProps } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT, WHATSAPP_FALLBACK } from "@/lib/constants/contact.constants";

interface WhatsappButtonProps {
  fadeIn: MotionProps;
}

export function WhatsappButton({ fadeIn }: WhatsappButtonProps) {
  const whatsappHref =
    typeof CONTACT?.whatsappUrl === "string" && CONTACT.whatsappUrl.trim() !== ""
      ? CONTACT.whatsappUrl
      : WHATSAPP_FALLBACK;

  return (
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
        "pointer-events-auto flex items-center justify-center h-12 w-12 rounded-full shadow-lg bg-[#25D366] text-white transition-colors duration-150 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      )}
    >
      <MessageCircle className="h-5 w-5 fill-current" aria-hidden="true" />
    </motion.a>
  );
}

export default WhatsappButton;
