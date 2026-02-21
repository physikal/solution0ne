import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-[#06060a] py-12">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="flex justify-center">
          <Logo size={28} showText />
        </div>
        <p className="mt-2 text-xs text-[var(--foreground)]/50">
          {siteConfig.tagline}
        </p>
        <p className="mt-4 text-xs text-[var(--foreground)]/30">
          &copy; 2026 {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
