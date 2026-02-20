import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solution0ne — AI Contracting Services",
  description:
    "We build, integrate, and deploy cutting-edge AI systems " +
    "that transform how businesses operate.",
  metadataBase: new URL("https://solution0ne.com"),
  openGraph: {
    title: "Solution0ne — AI Contracting Services",
    description:
      "AI-powered solutions for tomorrow's challenges.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          `${geistSans.variable} ${geistMono.variable} antialiased ` +
          "bg-[var(--background)] text-[var(--foreground)]"
        }
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
