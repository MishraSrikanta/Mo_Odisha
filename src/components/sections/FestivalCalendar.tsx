"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FESTIVALS } from "@/lib/data/festivals";
import type { Festival } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_OR = ["ଜାନୁ", "ଫେବ୍", "ମାର୍ଚ୍ଚ", "ଅପ୍ରେ", "ମଇ", "ଜୁନ", "ଜୁଲା", "ଅଗ", "ସେପ୍ଟ", "ଅକ୍ଟୋ", "ନଭେ", "ଡିସେ"];

/**
 * A twelve-month ring: pick a month to filter, or browse the whole year.
 * Months with no festival in the dataset are dimmed and non-interactive.
 */
export function FestivalCalendar({ limit }: { limit?: number }) {
  const { t, pick, isOdia } = useLocale();
  const [month, setMonth] = useState<number | null>(null);
  const [open, setOpen] = useState<Festival | null>(null);

  const populated = useMemo(() => new Set(FESTIVALS.map((festival) => festival.month)), []);

  const festivals = useMemo(() => {
    const filtered = month === null ? FESTIVALS : FESTIVALS.filter((festival) => festival.month === month);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [month, limit]);

  return (
    <div>
      <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setMonth(null)}
          aria-pressed={month === null}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs transition-all duration-300",
            month === null ? "bg-[color:var(--color-gold)] text-[#071a34]" : "glass text-muted hover:border-[color:var(--color-gold)]",
          )}
        >
          {t("filter.all")}
        </button>
        {MONTHS.map((label, index) => {
          const value = index + 1;
          const has = populated.has(value);
          return (
            <button
              key={label}
              type="button"
              disabled={!has}
              onClick={() => setMonth(value)}
              aria-pressed={month === value}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs transition-all duration-300",
                month === value
                  ? "bg-[color:var(--color-gold)] text-[#071a34]"
                  : has
                    ? "glass text-muted hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]"
                    : "cursor-not-allowed border border-[color:var(--line)] text-muted/35",
                isOdia && "font-odia",
              )}
            >
              {pick(label, MONTHS_OR[index])}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {festivals.map((festival, index) => (
            <motion.li
              key={festival.id}
              layout
              initial={{ opacity: 0, y: 34, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(festival)}
                className="group glass ornament shadow-soft relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left"
              >
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <Motif
                    id={festival.id}
                    kind={festival.motif}
                    className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.9), transparent 62%)" }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-[0.65rem] tracking-[0.2em] text-[color:var(--color-gold-2)] uppercase">
                      {festival.monthLabel}
                    </span>
                    <span className="mt-1.5 block text-2xl leading-tight font-light text-white">{festival.name}</span>
                    <span className="font-odia mt-0.5 block text-base text-white/70">{festival.nameOr}</span>
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-xs tracking-[0.16em] text-muted uppercase">{festival.place}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{festival.blurb}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Modal
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open?.name ?? ""}
        subtitle={open ? `${open.nameOr} · ${open.monthLabel}` : undefined}
      >
        {open ? (
          <div className="space-y-7">
            <div className="overflow-hidden rounded-2xl">
              <Motif id={open.id} kind={open.motif} className="aspect-[16/7] w-full" alt={open.name} />
            </div>
            <p className="text-base leading-relaxed">{open.description}</p>
            <section>
              <h3 className="text-xs tracking-[0.2em] text-[color:var(--color-gold)] uppercase">Highlights</h3>
              <ul className="mt-3 space-y-2">
                {open.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-gold)]" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
            <p className="text-sm text-muted">
              <span className="tracking-[0.16em] uppercase">Where</span> · {open.place}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
