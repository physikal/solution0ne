"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CYAN = new THREE.Color("#00f0ff");
const NODE_COUNT = 100;
const NODE_COUNT_MOBILE = 40;
const RADIUS = 4;
const MAX_NEIGHBORS = 3;
const MAX_DISTANCE = 2.2;

interface ParticleNetworkProps {
  reducedDetail?: boolean;
}

function getPos(arr: Float32Array, i: number) {
  return {
    x: arr[i * 3]!,
    y: arr[i * 3 + 1]!,
    z: arr[i * 3 + 2]!,
  };
}

function buildNetwork(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * Math.PI * 2;
    const r = RADIUS * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);
  }

  const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const pi = getPos(positions, i);
    const dists: { idx: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const pj = getPos(positions, j);
      const d = Math.sqrt(
        (pi.x - pj.x) ** 2 + (pi.y - pj.y) ** 2 + (pi.z - pj.z) ** 2,
      );
      if (d < MAX_DISTANCE) dists.push({ idx: j, d });
    }
    dists.sort((a, b) => a.d - b.d);
    const neighborCount = Math.min(MAX_NEIGHBORS, dists.length);
    for (let k = 0; k < neighborCount; k++) {
      const neighbor = dists[k];
      if (neighbor && i < neighbor.idx) edges.push([i, neighbor.idx]);
    }
  }

  const deduped = [...new Map(edges.map((e) => [`${e[0]}-${e[1]}`, e])).values()];
  const linePositions = new Float32Array(deduped.length * 6);
  for (let i = 0; i < deduped.length; i++) {
    const edge = deduped[i];
    if (!edge) continue;
    const a = getPos(positions, edge[0]);
    const b = getPos(positions, edge[1]);
    linePositions[i * 6] = a.x;
    linePositions[i * 6 + 1] = a.y;
    linePositions[i * 6 + 2] = a.z;
    linePositions[i * 6 + 3] = b.x;
    linePositions[i * 6 + 4] = b.y;
    linePositions[i * 6 + 5] = b.z;
  }

  return { positions, linePositions };
}

export function ParticleNetwork({ reducedDetail = false }: ParticleNetworkProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const count = reducedDetail ? NODE_COUNT_MOBILE : NODE_COUNT;

  const { positions, linePositions } = useMemo(
    () => buildNetwork(count),
    [count],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.05;

    const posAttr = pointsRef.current.geometry.attributes["position"];
    if (!posAttr) return;
    const posArray = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] = positions[i * 3 + 1]! + Math.sin(t + i * 0.3) * 0.08;
    }
    posAttr.needsUpdate = true;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.7 + Math.sin(t * 1.5) * 0.15;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={CYAN}
          size={0.06}
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      {!reducedDetail && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={CYAN} transparent opacity={0.15} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  );
}
