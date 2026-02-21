"use client";

import { type ReactNode, useRef } from "react";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ParticleField } from "@/components/ui/particle-field";

type SectionChildren =
  | ReactNode
  | ((scrollYProgress: MotionValue<number>) => ReactNode);

interface SectionWrapperProps {
  id?: string;
  children: SectionChildren;
  className?: string;
}

export function SectionWrapper({
  id,
  children,
  className = "",
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 0.15–0.35: fade in, 0.35–0.65: visible, 0.65–0.85: fade out
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.35, 0.65, 0.7, 0.9],
    reducedMotion ? [1, 1, 1, 1, 1, 1] : [0, 1, 1, 1, 1, 0],
  );

  const y = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.35, 0.65, 0.7, 0.9],
    reducedMotion ? [0, 0, 0, 0, 0, 0] : [40, 0, 0, 0, 0, -40],
  );

  const blur = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.35, 0.65, 0.7, 0.9],
    reducedMotion
      ? [0, 0, 0, 0, 0, 0]
      : [6, 0, 0, 0, 0, 6],
  );

  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  const resolvedChildren =
    typeof children === "function"
      ? children(scrollYProgress)
      : children;

  return (
    <section
      id={id}
      ref={ref}
      className={`relative px-6 py-24 mx-auto max-w-6xl ${className}`}
    >
      <ParticleField scrollYProgress={scrollYProgress} />
      <motion.div
        className="relative z-10"
        style={{ opacity, y, filter }}
      >
        {resolvedChildren}
      </motion.div>
    </section>
  );
}
