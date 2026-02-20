"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function GlowButton({
  children,
  href,
  className = "",
  ...props
}: GlowButtonProps) {
  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={
        "relative px-8 py-3 font-semibold text-white rounded-lg " +
        "bg-gradient-to-r from-[var(--accent-cyan)] " +
        "to-[var(--accent-purple)] " +
        "shadow-[var(--glow-cyan)] " +
        "hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] " +
        "transition-shadow duration-300 cursor-pointer " +
        className
      }
      {...props}
    >
      {children}
    </motion.button>
  );

  if (href) {
    return <a href={href}>{buttonContent}</a>;
  }

  return buttonContent;
}
