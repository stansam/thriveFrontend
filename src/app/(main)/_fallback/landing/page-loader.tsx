"use client";

import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black text-white">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute h-full w-full rounded-full border border-[#88734C]/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute h-16 w-16 rounded-full border-2 border-t-[#88734C] border-r-transparent border-b-[#88734C]/25 border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="h-6 w-6 rounded-full bg-[#88734C]" />
        </div>

        <div className="text-center space-y-1">
          <motion.h1
            className="text-2xl font-bold tracking-[0.3em] text-white"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            THRIVE
          </motion.h1>
          <p className="text-[10px] tracking-[0.4em] text-[#A9BBC8] uppercase font-semibold">
            Global Travel &amp; Tours
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
