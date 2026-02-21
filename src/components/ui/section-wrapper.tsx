"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useParticleContext } from "@/components/particles/particle-overlay";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  children,
  className = "",
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const particleCtx = useParticleContext();
  const sectionState = id ? particleCtx?.get(id) : undefined;

  if (sectionState) {
    return (
      <section
        id={id}
        ref={ref}
        className={`relative z-10 px-6 py-24 mx-auto max-w-6xl ${className}`}
      >
        <motion.div
          style={{
            opacity: sectionState.contentOpacity,
            y: sectionState.contentY,
          }}
        >
          {children}
        </motion.div>
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`px-6 py-24 mx-auto max-w-6xl ${className}`}
    >
      {children}
    </motion.section>
  );
}
