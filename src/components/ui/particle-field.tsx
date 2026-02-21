"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  type MotionValue,
  useReducedMotion,
} from "motion/react";

const PARTICLE_COUNT = 40;
const MOBILE_PARTICLE_COUNT = 20;
const MOBILE_BREAKPOINT = 768;
const CYAN_R = 0;
const CYAN_G = 255;
const CYAN_B = 255;

interface Particle {
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  size: number;
  glowSize: number;
  phase: number;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function createParticles(
  width: number,
  height: number,
  count: number,
): Particle[] {
  const particles: Particle[] = [];
  const margin = 0.1;
  const overshoot = 0.3;

  for (let i = 0; i < count; i++) {
    // Distribute evenly across 4 edges
    const edge = i % 4;
    let originX: number;
    let originY: number;

    switch (edge) {
      case 0: // left
        originX = -Math.random() * width * overshoot;
        originY = Math.random() * height;
        break;
      case 1: // right
        originX = width + Math.random() * width * overshoot;
        originY = Math.random() * height;
        break;
      case 2: // top
        originX = Math.random() * width;
        originY = -Math.random() * height * overshoot;
        break;
      default: // bottom
        originX = Math.random() * width;
        originY = height + Math.random() * height * overshoot;
        break;
    }

    const targetX =
      width * (margin + Math.random() * (1 - 2 * margin));
    const targetY =
      height * (margin + Math.random() * (1 - 2 * margin));

    particles.push({
      originX,
      originY,
      targetX,
      targetY,
      size: 1.5 + Math.random() * 2,
      glowSize: 6 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return particles;
}

interface ParticleFieldProps {
  scrollYProgress: MotionValue<number>;
}

export function ParticleField({ scrollYProgress }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const reducedMotion = useReducedMotion();

  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Convergence: how far particles have traveled from edge to target
      // 0.0–0.10: at edges
      // 0.10–0.30: flying inward
      // 0.30–0.35: arriving at target, fading out
      // 0.35–0.65: invisible (content reading zone)
      // 0.65–0.70: reappearing at target, starting to scatter
      // 0.70–0.90: flying outward
      // 0.90–1.0: at edges
      let convergence: number;
      if (progress < 0.30) {
        convergence = smoothstep(0.10, 0.30, progress);
      } else if (progress < 0.65) {
        convergence = 1;
      } else {
        convergence = 1 - smoothstep(0.65, 0.90, progress);
      }

      // Fade: particles visible while moving, invisible once converged
      // Peaks mid-transition, drops to 0 when content is solid
      let fade: number;
      if (progress < 0.20) {
        fade = smoothstep(0.10, 0.20, progress);
      } else if (progress < 0.35) {
        fade = 1 - smoothstep(0.25, 0.35, progress);
      } else if (progress < 0.65) {
        fade = 0;
      } else if (progress < 0.75) {
        fade = smoothstep(0.65, 0.75, progress);
      } else {
        fade = 1 - smoothstep(0.85, 0.95, progress);
      }

      if (fade < 0.01) return;

      for (const p of particlesRef.current) {
        const x =
          p.originX + (p.targetX - p.originX) * convergence;
        const y =
          p.originY + (p.targetY - p.originY) * convergence;

        const pulse =
          0.7 + 0.3 * Math.sin(p.phase + progress * Math.PI * 4);
        const alpha = fade * 0.8;

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, p.glowSize * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN_R}, ${CYAN_G}, ${CYAN_B}, ${alpha * 0.2})`;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(x, y, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN_R}, ${CYAN_G}, ${CYAN_B}, ${alpha})`;
        ctx.fill();
      }
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      const count =
        rect.width < MOBILE_BREAKPOINT
          ? MOBILE_PARTICLE_COUNT
          : PARTICLE_COUNT;
      particlesRef.current = createParticles(
        rect.width,
        rect.height,
        count,
      );

      draw(scrollYProgress.get());
    }

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const unsubscribe = scrollYProgress.on("change", draw);

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [scrollYProgress, draw]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full"
    />
  );
}
