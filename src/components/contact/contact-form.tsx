"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GlowButton } from "@/components/ui/glow-button";
import type { ContactFormData, ContactResponse } from "@/types/contact";

type Status = "idle" | "sending" | "success" | "error";
const EMPTY_FORM: ContactFormData = { name: "", email: "", message: "" };
const INPUT =
  "w-full rounded-lg border border-[var(--card-border)] bg-white/5 p-3 " +
  "text-[#e0e0e8] placeholder-white/30 outline-none " +
  "focus:ring-2 focus:ring-[var(--accent-cyan)] transition-shadow duration-200";

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as ContactResponse;
      if (!data.success) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setTimeout(() => { setForm(EMPTY_FORM); setStatus("idle"); }, 3000);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 py-12 text-center"
      >
        <span className="text-4xl text-green-400">&#10003;</span>
        <p className="text-lg font-medium text-green-400">Message sent!</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm text-white/60">
        Name
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={INPUT}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-white/60">
        Email
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={INPUT}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm text-white/60">
        Message
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${INPUT} resize-none`}
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}
      <GlowButton type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </GlowButton>
    </form>
  );
}
