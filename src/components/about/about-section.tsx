"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { siteConfig, stats } from "@/config/site";
import { StatCounter } from "./stat-counter";

export function AboutSection() {
  return (
    <SectionWrapper id="about">
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            About{" "}
            <span className="text-[var(--accent-cyan)]">Us</span>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-[var(--accent-cyan)]" />
          </h2>
          <p className="text-lg text-[var(--foreground)]/70 leading-relaxed">
            {siteConfig.description}
          </p>
          <p className="text-[var(--foreground)]/60 leading-relaxed">
            We partner with forward-thinking organizations to harness
            the full potential of artificial intelligence. Our team of
            experts brings deep technical knowledge and practical
            experience to every engagement.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
