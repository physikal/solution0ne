"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ContactForm } from "@/components/contact/contact-form";

export function ContactSection() {
  return (
    <SectionWrapper id="contact">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Get In Touch
        </h2>
        <div
          className={
            "mx-auto mt-3 h-1 w-20 rounded-full " +
            "bg-[var(--accent-cyan)] shadow-[var(--glow-cyan)]"
          }
        />
        <p className="mt-4 text-white/60">
          Ready to transform your business with AI? Let&apos;s talk.
        </p>
      </div>
      <div className="mx-auto max-w-lg">
        <ContactForm />
      </div>
    </SectionWrapper>
  );
}
