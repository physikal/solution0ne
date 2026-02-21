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
  const margin = 0.15;

  for (let i = 0; i < count; i++) {
    const fromLeft = i < count / 2;
    const originX = fromLeft
      ? -Math.random() * width * 0.3
      : width + Math.random() * width * 0.3;
    const originY = Math.random() * height;

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

      // Map scroll progress to convergence:
      // 0.0–0.15: particles at edges (convergence = 0)
      // 0.15–0.35: converging (0 → 1)
      // 0.35–0.65: fully converged (1)
      // 0.65–0.85: scattering (1 → 0)
      // 0.85–1.0: particles at edges (convergence = 0)
      let convergence: number;
      if (progress < 0.35) {
        convergence = smoothstep(0.15, 0.35, progress);
      } else if (progress < 0.65) {
        convergence = 1;
      } else {
        convergence = 1 - smoothstep(0.65, 0.85, progress);
      }

      for (const p of particlesRef.current) {
        const x =
          p.originX + (p.targetX - p.originX) * convergence;
        const y =
          p.originY + (p.targetY - p.originY) * convergence;

        const pulse =
          0.7 + 0.3 * Math.sin(p.phase + progress * Math.PI * 4);
        const alpha = convergence * 0.6 + 0.15;

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, p.glowSize * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN_R}, ${CYAN_G}, ${CYAN_B}, ${alpha * 0.15})`;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(x, y, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN_R}, ${CYAN_G}, ${CYAN_B}, ${alpha * 0.9})`;
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
