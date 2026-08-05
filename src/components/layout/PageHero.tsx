"use client";

import { motion } from "framer-motion";
import { LetterField } from "@/components/hero/LetterField";
import { DustMotes } from "@/components/hero/Lighting";
import { Container } from "@/components/ui/Section";
import { useLocale } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

/** Compact hero used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  body,
  odiaTitle,
}: {
  eyebrow: TranslationKey;
  title: TranslationKey;
  body?: TranslationKey;
  /** Large watermark glyph or word, set in Odia. */
  odiaTitle?: string;
}) {
  const { t, isOdia } = useLocale();

  return (
    <section className="relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
      <LetterField className="absolute inset-0 h-full w-full opacity-60" density={0.5} />
      <DustMotes count={22} className="mix-blend-screen" />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(48rem 26rem at 20% 0%, color-mix(in oklab, var(--color-gold) 16%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative">
        {odiaTitle ? (
          <motion.p
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.07, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-odia pointer-events-none absolute -top-4 right-0 hidden text-[10rem] leading-none whitespace-nowrap select-none lg:block"
            aria-hidden="true"
          >
            {odiaTitle}
          </motion.p>
        ) : null}

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 text-xs font-medium tracking-[0.32em] text-[color:var(--color-gold)] uppercase"
        >
          <span className="h-px w-8 bg-[color:var(--color-gold)]" aria-hidden="true" />
          {t(eyebrow)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] font-light"
        >
          {t(title)}
        </motion.h1>

        {body ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn("mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg", isOdia && "font-odia")}
          >
            {t(body)}
          </motion.p>
        ) : null}
      </Container>
    </section>
  );
}
