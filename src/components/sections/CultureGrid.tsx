"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CULTURE, CULTURE_GROUPS } from "@/lib/data/culture";
import type { CultureEntry } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

/** Culture explorer — filter by discipline, open any entry into a modal. */
export function CultureGrid({ limit }: { limit?: number }) {
  const { t, pick, isOdia } = useLocale();
  const [group, setGroup] = useState<string>("all");
  const [open, setOpen] = useState<CultureEntry | null>(null);

  const entries = useMemo(() => {
    const filtered = group === "all" ? CULTURE : CULTURE.filter((entry) => entry.group === group);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [group, limit]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={group === "all"} onClick={() => setGroup("all")} label={t("filter.all")} />
        {CULTURE_GROUPS.map((item) => (
          <FilterChip
            key={item.id}
            active={group === item.id}
            onClick={() => setGroup(item.id)}
            label={pick(item.label, item.labelOr)}
            odia={isOdia}
          />
        ))}
      </div>

      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => (
            <motion.li
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(entry)}
                className="group glass ornament shadow-soft relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left transition-colors hover:border-[color:var(--color-gold)]/60"
              >
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <Motif
                    id={entry.id}
                    kind={entry.motif}
                    className="h-full w-full transition-transform duration-[1.1s] ease-out group-hover:scale-110"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.85), transparent 60%)" }}
                    aria-hidden="true"
                  />
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-[0.6rem] tracking-[0.22em] text-[color:var(--color-gold)] uppercase">
                    {entry.group}
                  </span>
                  <span className="mt-2 text-xl leading-tight font-light">{entry.name}</span>
                  <span className="font-odia mt-0.5 text-base text-muted">{entry.nameOr}</span>
                  <span className="mt-3 text-sm leading-relaxed text-muted">{entry.blurb}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs text-[color:var(--color-gold)]">
                    {t("card.learn")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
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
        subtitle={open?.nameOr}
      >
        {open ? (
          <div className="space-y-7">
            <div className="overflow-hidden rounded-2xl">
              <Motif id={open.id} kind={open.motif} className="aspect-[16/7] w-full" alt={open.name} />
            </div>
            <p className="text-base leading-relaxed">{open.description}</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              {open.facts.map((fact) => (
                <div key={fact.label} className="glass rounded-xl p-4">
                  <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{fact.label}</dt>
                  <dd className="mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  label,
  odia = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  odia?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-4 py-2 text-xs transition-all duration-300",
        active
          ? "bg-[color:var(--color-gold)] text-[#071a34]"
          : "glass text-muted hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]",
        odia && "font-odia",
      )}
    >
      {label}
    </button>
  );
}
