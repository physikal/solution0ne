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
  const animatingRef = useRef(false);
  const isInView = useInView(ref, { margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setDisplay(0);
      animatingRef.current = false;
      return;
    }

    if (animatingRef.current) return;
    animatingRef.current = true;

    const duration = 2000;
    const start = performance.now();
    let frameId: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        animatingRef.current = false;
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      animatingRef.current = false;
    };
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
