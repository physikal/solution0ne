"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { services } from "@/config/site";
import { ServiceCard } from "./service-card";

export function ServicesSection() {
  return (
    <SectionWrapper id="services">
      {(scrollYProgress) => (
        <>
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Services
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-cyan" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
