"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { GlowButton } from "@/components/ui/glow-button";
import { HeroCanvas } from "@/components/hero/hero-canvas";

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <HeroCanvas />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4 text-5xl font-bold tracking-tight text-white sm:text-7xl"
          style={{
            textShadow:
              "0 0 40px rgba(0,240,255,0.5), 0 0 80px rgba(0,240,255,0.2)",
          }}
        >
          {siteConfig.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-8 max-w-xl text-lg text-[var(--foreground)]/70 sm:text-xl"
        >
          {siteConfig.tagline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <GlowButton href="#contact">Get in Touch</GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
