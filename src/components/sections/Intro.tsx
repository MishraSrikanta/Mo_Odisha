"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { STATS } from "@/lib/data/site";
import { useLocale } from "@/lib/i18n/provider";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CURTAIN_GLYPHS } from "@/lib/odia";
import { cn } from "@/lib/utils";

/** Opening statement below the hero, plus the headline figures. */
export function Intro() {
  const { t, isOdia } = useLocale();

  return (
    <Container>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <Reveal variant="fade">
            <p className="flex items-center gap-3 text-xs font-medium tracking-[0.32em] text-[color:var(--color-gold)] uppercase">
              <span className="h-px w-8 bg-[color:var(--color-gold)]" aria-hidden="true" />
              {t("home.intro.eyebrow")}
            </p>
          </Reveal>
          <Reveal variant="blur" delay={0.06}>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.04] font-light">{t("home.intro.title")}</h2>
          </Reveal>
        </div>

        <div className="flex flex-col justify-end">
          <Reveal variant="up" delay={0.1}>
            <p className={cn("text-base leading-relaxed text-muted sm:text-lg", isOdia && "font-odia")}>
              {t("home.intro.body")}
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.18}>
            <Link
              href="/about"
              className="group mt-7 inline-flex items-center gap-3 text-sm text-[color:var(--color-gold)]"
            >
              {t("common.readMore")}
              <span className="h-px w-8 bg-[color:var(--color-gold)] transition-all duration-500 group-hover:w-14" />
            </Link>
          </Reveal>
        </div>
      </div>

      <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[color:var(--line)] lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="glass p-7 text-center"
          >
            <dt className="sr-only">{t(stat.key)}</dt>
            <dd>
              <span className="gold-text block text-[clamp(2.2rem,5vw,3.4rem)] leading-none font-light">{stat.value}</span>
              <span className={cn("mt-2 block text-xs tracking-[0.18em] text-muted uppercase", isOdia && "font-odia")}>
                {t(stat.key)}
              </span>
            </dd>
          </motion.div>
        ))}
      </dl>
    </Container>
  );
}

/** An endlessly scrolling band of the Odia varnamala. */
export function GlyphMarquee() {
  const line = [...CURTAIN_GLYPHS, ...CURTAIN_GLYPHS];

  return (
    <div className="relative overflow-hidden border-y border-[color:var(--line)] py-6" aria-hidden="true">
      <div className="marquee-track flex w-max gap-8 will-change-transform">
        {line.map((glyph, index) => (
          <span
            key={`${glyph}-${index}`}
            className="font-odia text-2xl text-muted opacity-45 select-none sm:text-3xl"
          >
            {glyph}
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(90deg, var(--bg), transparent 12%, transparent 88%, var(--bg))" }}
      />
    </div>
  );
}
