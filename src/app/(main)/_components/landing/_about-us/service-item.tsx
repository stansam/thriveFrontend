"use client";

import { motion } from "framer-motion";
import type { ServiceItemProps } from "../../../_props/landing/about.props";

export function ServiceItem({
  icon: Icon,
  secondaryIcon: SecondaryIcon,
  title,
  description,
  direction,
}: ServiceItemProps) {
  const isLeft = direction === "left";

  return (
    <motion.div
      className="flex flex-col group"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-3"
        initial={{ x: isLeft ? -20 : 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-[#88734C] bg-[#88734C]/10 p-3 rounded-lg transition-colors duration-300 group-hover:bg-[#88734C]/20 relative"
          whileHover={{
            rotate: [0, -10, 10, -5, 0],
            transition: { duration: 0.5 },
          }}
        >
          {Icon && <Icon className="w-6 h-6" />}
          {SecondaryIcon && (
            <span className="absolute -top-1 -right-1 text-[#A9BBC8]">
              <SecondaryIcon className="w-4 h-4" />
            </span>
          )}
        </motion.div>
        <h3 className="text-xl font-medium text-[#202e44] group-hover:text-[#88734C] transition-colors duration-300">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="text-sm text-[#202e44]/80 leading-relaxed pl-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

export default ServiceItem;
