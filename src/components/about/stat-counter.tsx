"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface StatCounterProps {
  label: string;
  value: number;
  suffix: string;
}

export function StatCounter({ label, value, suffix }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 p-6">
      <span className="text-5xl font-bold text-[var(--accent-cyan)]">
        {display}
        {suffix}
      </span>
      <span className="text-sm text-[var(--foreground)]/60 tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}
