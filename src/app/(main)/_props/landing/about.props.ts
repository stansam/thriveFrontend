import { type MotionValue } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { type RefObject } from "react";

export interface AboutUsSectionProps {
  sectionRef: RefObject<HTMLDivElement | null>;
  isInView: boolean;
  y1: MotionValue<number>;
  y2: MotionValue<number>;
  rotate1: MotionValue<number>;
  rotate2: MotionValue<number>;
}

export interface AboutParallaxBackgroundProps {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
  rotate1: MotionValue<number>;
  rotate2: MotionValue<number>;
}

export interface CeoPortraitProps {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
}

export interface ServiceItemProps {
  icon: LucideIcon;
  secondaryIcon: LucideIcon;
  title: string;
  description: string;
  direction: "left" | "right";
}

export interface StatCounterProps {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix: string;
}