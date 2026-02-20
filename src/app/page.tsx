import { HeroSection } from "@/components/hero/hero-section";
import { SectionDivider } from "@/components/ui/section-divider";
import { ServicesSection } from "@/components/services/services-section";
import { AboutSection } from "@/components/about/about-section";
import { ContactSection } from "@/components/contact/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <ContactSection />
    </>
  );
}
