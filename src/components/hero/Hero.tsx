"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { OdiaCurtain } from "./OdiaCurtain";
import { LetterField } from "./LetterField";
import { DustMotes, LightRays, StageGlow } from "./Lighting";
import { useLocale } from "@/lib/i18n/provider";

const reveal = {
  hidden: { opacity: 0, filter: "blur(18px)", scale: 0.94, y: 24 },
  visible: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
};

export function Hero() {
  const { t, isOdia } = useLocale();

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Layer 1 — the glow behind the cloth */}
      <StageGlow />

      {/* Layer 2 — letters drifting in depth (Web Worker driven) */}
      <LetterField className="absolute inset-0 h-full w-full" />

      {/* Layer 3 — volumetric shafts */}
      <LightRays className="mix-blend-screen" />

      {/* Layer 4 — the curtain itself; the only layer that takes the pointer */}
      <OdiaCurtain className="absolute inset-0 h-full w-full" />

      {/* Layer 5 — ambient dust in front of everything */}
      <DustMotes className="mix-blend-screen" />

      {/* Layer 6 — the title. Pointer events stay off so the cloth stays reachable. */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="font-odia text-sm tracking-[0.4em] text-[color:var(--color-gold-2)] sm:text-base"
        >
          ମୋ ଓଡ଼ିଶା
        </motion.p>

        <motion.h1
          id="hero-title"
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-4 text-[clamp(2.8rem,10vw,9rem)] leading-[0.95] font-light"
        >
          <span className="gold-text">{t("hero.title")}</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.62 }}
          className={`mt-5 max-w-2xl text-balance text-lg text-muted sm:text-xl ${isOdia ? "font-odia" : ""}`}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/tourism"
            className="group relative overflow-hidden rounded-full bg-[color:var(--color-gold)] px-7 py-3 text-sm font-medium text-[#071a34] transition-transform duration-500 hover:scale-[1.04]"
          >
            <span className="relative z-10">{t("hero.cta.primary")}</span>
            <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href="/visit-us"
            className="glass rounded-full px-7 py-3 text-sm font-medium transition-colors duration-500 hover:border-[color:var(--color-gold)]"
          >
            {t("hero.cta.secondary")}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.5 }}
          className="mt-8 text-xs tracking-[0.24em] text-muted uppercase"
        >
          {t("hero.hint")}
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="pointer-events-none absolute bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[0.65rem] tracking-[0.3em] text-muted uppercase">{t("hero.scroll")}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-[color:var(--line)]">
          <span className="absolute inset-x-0 top-0 h-4 bg-[color:var(--color-gold)] [animation:scroll-cue_2.2s_ease-in-out_infinite]" />
        </span>
      </motion.div>

      {/* Fade the curtain into the page below it */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        aria-hidden="true"
      />

      <style>{`
        @keyframes scroll-cue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
      `}</style>
    </section>
  );
}
