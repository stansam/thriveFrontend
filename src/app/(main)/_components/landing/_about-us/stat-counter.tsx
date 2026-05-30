"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import type { StatCounterProps } from "@/app/(main)/_props/landing/about.props";

export function StatCounter({
  icon: Icon,
  value,
  label,
  suffix,
}: StatCounterProps) {
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: true });
  const springValue = useSpring(0, { stiffness: 50, damping: 10 });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    springValue.set(isInView ? value : 0);
  }, [isInView, value, springValue]);

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center group hover:bg-white transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-14 h-14 rounded-full bg-[#202e44]/5 flex items-center justify-center mb-4 text-[#88734C] group-hover:bg-[#88734C]/10 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </motion.div>
      <motion.div
        ref={countRef}
        className="text-3xl font-bold text-[#202e44] flex items-center"
      >
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-[#202e44]/70 text-sm mt-1">{label}</p>
      <motion.div className="w-10 h-0.5 bg-[#88734C] mt-3 group-hover:w-16 transition-all duration-300" />
    </motion.div>
  );
}

export default StatCounter;
