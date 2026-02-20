"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig } from "@/config/site";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

const LINK_CLASS =
  "text-sm text-[var(--foreground)]/70 transition-colors hover:text-[var(--accent-cyan)]";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={
        "fixed top-0 left-0 z-50 w-full transition-colors duration-300 " +
        (scrolled
          ? "bg-[var(--background)]/80 backdrop-blur-md"
          : "bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-lg font-bold text-[var(--accent-cyan)]">
          {siteConfig.name}
        </a>

        <ul className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={LINK_CLASS}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          className="text-[var(--foreground)] md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={
              "overflow-hidden px-6 md:hidden " +
              "bg-[var(--background)]/95 backdrop-blur-md"
            }
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-white/5">
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 ${LINK_CLASS}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
