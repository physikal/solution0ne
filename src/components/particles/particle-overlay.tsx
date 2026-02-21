"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ParticleTextGroup } from "@/components/particles/particle-text-group";

interface SectionScrollState {
  contentOpacity: MotionValue<number>;
  contentY: MotionValue<number>;
}

const ParticleContext = createContext<
  Map<string, SectionScrollState> | null
>(null);

export function useParticleContext() {
  return useContext(ParticleContext);
}

const SECTIONS = [
  { id: "services", heading: "Our Services" },
  { id: "about", heading: "About Us" },
  { id: "contact", heading: "Get In Touch" },
] as const;

function SectionScrollTracker({
  sectionId,
  heading,
  particleCount,
}: {
  sectionId: string;
  heading: string;
  particleCount: number;
}) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const find = () => {
      const found = document.getElementById(sectionId);
      if (found) setEl(found);
    };
    find();
    if (!el) {
      const timer = setTimeout(find, 200);
      return () => clearTimeout(timer);
    }
  }, [sectionId, el]);

  const { scrollYProgress } = useScroll(
    el
      ? { target: { current: el }, offset: ["start end", "end start"] }
      : undefined,
  );

  if (!el) return null;

  return (
    <ParticleTextGroup
      sectionId={sectionId}
      headingText={heading}
      particleCount={particleCount}
      scrollProgress={scrollYProgress}
    />
  );
}

function OverlayScene({
  particleCount,
}: {
  particleCount: number;
}) {
  return (
    <>
      {SECTIONS.map((s) => (
        <SectionScrollTracker
          key={s.id}
          sectionId={s.id}
          heading={s.heading}
          particleCount={particleCount}
        />
      ))}
    </>
  );
}

function useSectionMotionValues() {
  const [elements, setElements] = useState<
    Map<string, HTMLElement>
  >(new Map());

  useEffect(() => {
    const find = () => {
      const map = new Map<string, HTMLElement>();
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) map.set(s.id, el);
      }
      if (map.size > 0) setElements(map);
    };
    find();
    const timer = setTimeout(find, 300);
    return () => clearTimeout(timer);
  }, []);

  const servicesEl = elements.get("services") ?? null;
  const aboutEl = elements.get("about") ?? null;
  const contactEl = elements.get("contact") ?? null;

  const servicesScroll = useScroll(
    servicesEl
      ? {
          target: { current: servicesEl },
          offset: ["start end", "end start"],
        }
      : undefined,
  );
  const aboutScroll = useScroll(
    aboutEl
      ? {
          target: { current: aboutEl },
          offset: ["start end", "end start"],
        }
      : undefined,
  );
  const contactScroll = useScroll(
    contactEl
      ? {
          target: { current: contactEl },
          offset: ["start end", "end start"],
        }
      : undefined,
  );

  const servicesOpacity = useTransform(
    servicesScroll.scrollYProgress,
    [0, 0.36, 0.42, 0.56, 0.60, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const servicesY = useTransform(
    servicesScroll.scrollYProgress,
    [0, 0.36, 0.42, 0.56, 0.60, 1],
    [40, 40, 0, 0, -20, -20],
  );
  const aboutOpacity = useTransform(
    aboutScroll.scrollYProgress,
    [0, 0.36, 0.42, 0.56, 0.60, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const aboutY = useTransform(
    aboutScroll.scrollYProgress,
    [0, 0.36, 0.42, 0.56, 0.60, 1],
    [40, 40, 0, 0, -20, -20],
  );
  const contactOpacity = useTransform(
    contactScroll.scrollYProgress,
    [0, 0.36, 0.42, 0.56, 0.60, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const contactY = useTransform(
    contactScroll.scrollYProgress,
    [0, 0.36, 0.42, 0.56, 0.60, 1],
    [40, 40, 0, 0, -20, -20],
  );

  return useMemo(() => {
    const map = new Map<string, SectionScrollState>();
    if (servicesEl) {
      map.set("services", {
        contentOpacity: servicesOpacity,
        contentY: servicesY,
      });
    }
    if (aboutEl) {
      map.set("about", {
        contentOpacity: aboutOpacity,
        contentY: aboutY,
      });
    }
    if (contactEl) {
      map.set("contact", {
        contentOpacity: contactOpacity,
        contentY: contactY,
      });
    }
    return map;
  }, [
    servicesEl,
    aboutEl,
    contactEl,
    servicesOpacity,
    servicesY,
    aboutOpacity,
    aboutY,
    contactOpacity,
    contactY,
  ]);
}

export function ParticleOverlay() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const sectionStates = useSectionMotionValues();
  const particleCount = isMobile ? 1000 : 2000;

  if (prefersReducedMotion) {
    return (
      <ParticleContext.Provider value={null}>
        {null}
      </ParticleContext.Provider>
    );
  }

  return (
    <ParticleContext.Provider value={sectionStates}>
      <div
        className="fixed inset-0 z-5"
        style={{ pointerEvents: "none" }}
      >
        <Canvas
          orthographic
          camera={{
            position: [0, 0, 50],
            zoom: 1,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: false }}
          style={{ pointerEvents: "none" }}
        >
          <OverlayScene particleCount={particleCount} />
        </Canvas>
      </div>
    </ParticleContext.Provider>
  );
}
