"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { sampleTextPositions } from "@/lib/sample-text";

const VERTEX_SHADER = /* glsl */ `
attribute vec3 aTarget;
attribute vec3 aRandom;
attribute float aSize;
uniform float uProgress;
uniform float uTime;
uniform float uPointSize;
uniform float uPixelRatio;
varying float vAlpha;

void main() {
    float stagger = aRandom.x * 0.3;
    float t = clamp((uProgress - stagger) / (1.0 - stagger), 0.0, 1.0);
    float eased = t * t * (3.0 - 2.0 * t);

    vec3 pos = mix(position, aTarget, eased);

    float spiralStrength = 1.0 - eased;
    float angle = uTime * (1.0 + aRandom.y * 2.0) + aRandom.z * 6.283;
    float radius = spiralStrength * (0.5 + aRandom.x * 0.5);
    pos.x += cos(angle) * radius * 40.0;
    pos.y += sin(angle * 0.7) * radius * 25.0;
    pos.z += sin(angle * 0.5) * radius * 10.0;

    pos.x += sin(uTime * 0.5 + aRandom.x * 10.0) * 0.3;
    pos.y += cos(uTime * 0.4 + aRandom.y * 10.0) * 0.3;

    vAlpha = 0.3 + eased * 0.7;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uPointSize * aSize * uPixelRatio;
    gl_Position = projectionMatrix * mvPos;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform float uOpacity;
varying float vAlpha;

void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * vAlpha * uOpacity;
    vec3 color = vec3(0.0, 0.94, 1.0);
    color += vec3(smoothstep(0.2, 0.0, dist) * 0.3);
    gl_FragColor = vec4(color, alpha);
}
`;

interface ParticleTextGroupProps {
  sectionId: string;
  headingText: string;
  particleCount: number;
  scrollProgress: MotionValue<number>;
}

interface ParticleData {
  scattered: Float32Array;
  targets: Float32Array;
  randoms: Float32Array;
  sizes: Float32Array;
  textWidth: number;
  textHeight: number;
}

function generateScattered(
  count: number,
  textWidth: number,
  textHeight: number,
): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.5 + Math.random() * 0.5;
    arr[i * 3] = Math.cos(angle) * r * textWidth;
    arr[i * 3 + 1] = Math.sin(angle) * r * textHeight * 1.5;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return arr;
}

function generateRandoms(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    arr[i] = Math.random();
  }
  return arr;
}

function generateSizes(count: number): Float32Array {
  const arr = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    arr[i] = 0.8 + Math.random() * 0.4;
  }
  return arr;
}

export function ParticleTextGroup({
  sectionId,
  headingText,
  particleCount,
  scrollProgress,
}: ParticleTextGroupProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [data, setData] = useState<ParticleData | null>(null);

  const fontSize = typeof window !== "undefined"
    && window.matchMedia("(min-width: 640px)").matches
    ? 36 : 28;

  useEffect(() => {
    let cancelled = false;
    sampleTextPositions(headingText, fontSize, particleCount).then(
      (result) => {
        if (cancelled) return;
        const actualCount = result.positions.length / 3;
        setData({
          targets: result.positions,
          scattered: generateScattered(
            actualCount,
            result.width,
            result.height,
          ),
          randoms: generateRandoms(actualCount),
          sizes: generateSizes(actualCount),
          textWidth: result.width,
          textHeight: result.height,
        });
      },
    );
    return () => { cancelled = true; };
  }, [headingText, fontSize, particleCount]);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uProgress: { value: 0 },
          uOpacity: { value: 0 },
          uTime: { value: 0 },
          uPointSize: { value: 3.0 },
          uPixelRatio: {
            value:
              typeof window !== "undefined"
                ? Math.min(window.devicePixelRatio, 1.5)
                : 1,
          },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((state) => {
    if (!data) return;

    const progress = scrollProgress.get();
    const mat = materialRef.current;
    if (!mat) return;

    let morphProgress = 0;
    let particleOpacity = 0;

    if (progress >= 0.12 && progress < 0.18) {
      const t = (progress - 0.12) / 0.06;
      particleOpacity = t;
      morphProgress = 0;
    } else if (progress >= 0.18 && progress < 0.38) {
      particleOpacity = 1;
      morphProgress = (progress - 0.18) / 0.2;
    } else if (progress >= 0.38 && progress < 0.46) {
      const t = (progress - 0.38) / 0.08;
      particleOpacity = 1 - t;
      morphProgress = 1;
    } else if (progress >= 0.58 && progress < 0.66) {
      const t = (progress - 0.58) / 0.08;
      particleOpacity = t;
      morphProgress = 1;
    } else if (progress >= 0.66 && progress < 0.85) {
      particleOpacity = 1;
      morphProgress = 1 - (progress - 0.66) / 0.19;
    } else if (progress >= 0.85 && progress <= 1.0) {
      const t = (progress - 0.85) / 0.15;
      particleOpacity = 1 - t;
      morphProgress = 0;
    }

    mat.uniforms["uProgress"]!.value = morphProgress;
    mat.uniforms["uOpacity"]!.value = particleOpacity;
    mat.uniforms["uTime"]!.value = state.clock.elapsedTime;

    const heading = document.querySelector(
      `#${sectionId} h2`,
    ) as HTMLElement | null;
    if (heading) {
      const rect = heading.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      groupRef.current.position.set(
        cx - window.innerWidth / 2,
        -(cy - window.innerHeight / 2),
        0,
      );
    }
  });

  if (!data) return null;

  return (
    <group ref={groupRef}>
      <points material={shaderMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.scattered, 3]}
          />
          <bufferAttribute
            attach="attributes-aTarget"
            args={[data.targets, 3]}
          />
          <bufferAttribute
            attach="attributes-aRandom"
            args={[data.randoms, 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[data.sizes, 1]}
          />
        </bufferGeometry>
        <primitive
          object={shaderMaterial}
          ref={materialRef}
          attach="material"
        />
      </points>
    </group>
  );
}
