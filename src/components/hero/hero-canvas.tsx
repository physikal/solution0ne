"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { ParticleNetwork } from "@/components/hero/particle-network";

export function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight
          position={[5, 5, 5]}
          intensity={0.6}
          color="#00f0ff"
        />
        <Stars
          radius={50}
          depth={40}
          count={isMobile ? 500 : 1000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
        <ParticleNetwork reducedDetail={isMobile} />
      </Canvas>
    </div>
  );
}
