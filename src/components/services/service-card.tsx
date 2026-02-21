"use client";

import type { ReactNode } from "react";
import {
  type MotionValue,
  motion,
  useTransform,
} from "motion/react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}

const icons: Record<string, ReactNode> = {
  strategy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-.986-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  development: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M17.25 6.75L22.5 12l-5.25 5.25M6.75 17.25L1.5 12l5.25-5.25M14.25 3.75l-4.5 16.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  integration: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 1 1-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 1 0-6.364 6.364L5.04 6.548" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M4.26 10.147a60 60 0 0 0-.491 6.347A48.6 48.6 0 0 1 12 20.904a48.6 48.6 0 0 1 8.232-4.41 60 60 0 0 0-.491-6.347m-15.482 0a50.6 50.6 0 0 0-2.658-.813A60 60 0 0 1 12 3.493a60 60 0 0 1 10.399 5.84 51 51 0 0 0-2.658.814m-15.482 0A51 51 0 0 1 12 13.489a51 51 0 0 1 7.74-3.342M6.75 15v3.75m0 0h10.5m-10.5 0L12 22.5l5.25-3.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export function ServiceCard({
  title,
  description,
  icon,
  index,
  scrollYProgress,
}: ServiceCardProps) {
  const stagger = index * 0.03;
  const fadeIn = 0.15 + stagger;
  const solidStart = 0.35 + stagger;
  const solidEnd = 0.65 - stagger;
  const fadeOut = 0.85 - stagger;

  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, solidStart, solidEnd, fadeOut],
    [0, 1, 1, 0],
  );

  const y = useTransform(
    scrollYProgress,
    [fadeIn, solidStart, solidEnd, fadeOut],
    [30, 0, 0, -30],
  );

  return (
    <motion.div
      style={{ opacity, y }}
      whileHover={{ scale: 1.02 }}
      className={
        "rounded-xl p-8 backdrop-blur-md " +
        "bg-[var(--card-bg)] border border-[var(--card-border)] " +
        "hover:border-[var(--card-border-hover)] " +
        "hover:shadow-[var(--glow-cyan)] " +
        "transition-[border-color,box-shadow] duration-300"
      }
    >
      <div className="mb-5 text-cyan">{icons[icon]}</div>
      <h3 className="mb-3 text-xl font-semibold text-cyan">{title}</h3>
      <p className="text-sm leading-relaxed text-foreground/60">
        {description}
      </p>
    </motion.div>
  );
}
