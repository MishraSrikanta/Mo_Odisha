"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { HISTORY } from "@/lib/data/history";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { cn } from "@/lib/utils";

/**
 * Vertical timeline with a scroll-linked progress spine and expandable
 * milestones. Each entry is a native `<button>` controlling a region, so the
 * whole thing works from the keyboard and reads correctly to a screen reader.
 */
export function HistoryTimeline({ limit }: { limit?: number }) {
  const containerRef = useRef<HTMLOListElement | null>(null);
  const { pick, isOdia } = useLocale();
  const [expanded, setExpanded] = useState<string | null>(HISTORY[0].id);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 55%"],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  const entries = limit ? HISTORY.slice(0, limit) : HISTORY;

  return (
    <ol ref={containerRef} className="relative mt-14 ml-4 sm:ml-8">
      {/* The spine, and the gold thread that fills it as you scroll */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-[color:var(--line)]" aria-hidden="true" />
      <motion.div
        className="absolute top-0 left-0 w-px origin-top"
        style={{ scaleY: spine, background: "linear-gradient(to bottom, var(--color-gold), var(--color-copper))" }}
        aria-hidden="true"
      />

      {entries.map((era, index) => {
        const open = expanded === era.id;
        const panelId = `era-panel-${era.id}`;

        return (
          <motion.li
            key={era.id}
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="relative pb-12 pl-8 sm:pl-12"
          >
            <span
              className={cn(
                "absolute top-2 -left-[7px] h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500",
                open
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)]"
                  : "border-[color:var(--line)] bg-[color:var(--bg)]",
              )}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => setExpanded(open ? null : era.id)}
              aria-expanded={open}
              aria-controls={panelId}
              className="w-full text-left"
            >
              <p className="text-xs tracking-[0.24em] text-[color:var(--color-gold)] uppercase">{era.period}</p>
              <h3 className="mt-2 text-2xl leading-tight font-light sm:text-3xl">
                {pick(era.title, era.titleOr)}
                <span
                  className={cn(
                    "ml-3 inline-block text-base text-muted transition-transform duration-500",
                    open && "rotate-45",
                  )}
                  aria-hidden="true"
                >
                  +
                </span>
              </h3>
              <p className={cn("mt-2 max-w-2xl text-sm text-muted sm:text-base", isOdia && "font-odia")}>{era.summary}</p>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="glass ornament mt-5 grid gap-6 rounded-2xl p-5 sm:grid-cols-[1fr_minmax(0,15rem)] sm:p-6">
                    <div>
                      <p className="text-sm leading-relaxed">{era.detail}</p>
                      <ul className="mt-5 space-y-2">
                        {era.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3 text-sm text-muted">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-gold)]" aria-hidden="true" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="overflow-hidden rounded-xl sm:self-start">
                      <Motif id={era.id} kind={era.motif} className="aspect-[4/3] w-full" />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}
