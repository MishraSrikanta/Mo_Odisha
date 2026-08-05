"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DISTRICTS, DISTRICT_THEMES } from "@/lib/data/districts";
import type { District, DistrictTheme } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { BilingualField } from "@/components/form/BilingualField";
import { Modal } from "@/components/ui/Modal";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

/** Searchable, filterable explorer over all 30 districts. */
export function DistrictExplorer() {
  const { t, pick, isOdia } = useLocale();
  const [query, setQuery] = useState("");
  const [themes, setThemes] = useState<DistrictTheme[]>([]);
  const [open, setOpen] = useState<District | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return DISTRICTS.filter((district) => {
      const matchesTheme = themes.length === 0 || themes.every((theme) => district.themes.includes(theme));
      if (!matchesTheme) return false;
      if (!needle) return true;
      // Search across both scripts and the descriptive fields.
      const haystack = [
        district.name,
        district.nameOr,
        district.headquarters,
        district.knownFor,
        district.festival,
        ...district.attractions,
        ...district.cuisine,
        ...district.people,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, themes]);

  const toggleTheme = (theme: DistrictTheme) =>
    setThemes((current) => (current.includes(theme) ? current.filter((item) => item !== theme) : [...current, theme]));

  const active = themes.length > 0 || query.trim().length > 0;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
        <BilingualField
          label={t("filter.search")}
          value={query}
          onChange={setQuery}
          type="search"
          placeholder="Puri, Similipal, ପଖାଳ…"
          compact
        />

        <div className="flex flex-wrap items-center gap-2 lg:pt-9">
          <button
            type="button"
            onClick={() => setThemes([])}
            aria-pressed={themes.length === 0}
            className={cn(
              "rounded-full px-4 py-2 text-xs transition-all duration-300",
              themes.length === 0
                ? "bg-[color:var(--color-gold)] text-[#071a34]"
                : "glass text-muted hover:border-[color:var(--color-gold)]",
            )}
          >
            {t("filter.all")}
          </button>
          {DISTRICT_THEMES.map((theme) => {
            const on = themes.includes(theme.id);
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => toggleTheme(theme.id)}
                aria-pressed={on}
                className={cn(
                  "rounded-full px-4 py-2 text-xs transition-all duration-300",
                  on
                    ? "bg-[color:var(--color-gold)] text-[#071a34]"
                    : "glass text-muted hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]",
                  isOdia && "font-odia",
                )}
              >
                {pick(theme.label, theme.labelOr)}
              </button>
            );
          })}
          {active ? (
            <button
              type="button"
              onClick={() => {
                setThemes([]);
                setQuery("");
              }}
              className="ml-1 text-xs text-muted underline underline-offset-4 transition-colors hover:text-[color:var(--color-gold)]"
            >
              {t("filter.clear")}
            </button>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-xs tracking-[0.2em] text-muted uppercase">
        {results.length} {t("filter.results")}
      </p>

      {results.length === 0 ? (
        <p className="glass mt-6 rounded-2xl p-10 text-center text-muted">{t("filter.empty")}</p>
      ) : (
        <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((district) => (
              <motion.li
                key={district.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard intensity={6} className="h-full rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpen(district)}
                    className="glass ornament relative flex h-full w-full flex-col rounded-2xl p-5 text-left transition-colors hover:border-[color:var(--color-gold)]/60"
                  >
                    <span className="text-[0.6rem] tracking-[0.2em] text-muted uppercase">{district.region}</span>
                    <span className="mt-2 text-xl leading-tight font-light">{district.name}</span>
                    <span className="font-odia mt-0.5 text-base text-[color:var(--color-gold)]">{district.nameOr}</span>
                    <span className="mt-3 line-clamp-2 text-sm text-muted">{district.knownFor}</span>
                    <span className="mt-4 flex flex-wrap gap-1.5">
                      {district.themes.slice(0, 3).map((theme) => (
                        <span key={theme} className="rounded-full border border-[color:var(--line)] px-2 py-0.5 text-[0.65rem] capitalize">
                          {theme}
                        </span>
                      ))}
                    </span>
                  </button>
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <Modal
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open?.name ?? ""}
        subtitle={open ? `${open.nameOr} · ${t("map.headquarters")}: ${open.headquarters}` : undefined}
      >
        {open ? (
          <div className="space-y-7">
            <p className="text-base leading-relaxed">{open.knownFor}</p>

            <dl className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {[
                [t("map.population"), open.population],
                [t("map.area"), open.area],
                [t("map.headquarters"), open.headquarters],
                [t("map.festival"), open.festival],
              ].map(([label, value]) => (
                <div key={label} className="glass rounded-xl p-3">
                  <dt className="text-[0.6rem] tracking-[0.16em] text-muted uppercase">{label}</dt>
                  <dd className="mt-1 text-sm">{value}</dd>
                </div>
              ))}
            </dl>

            <DetailList title={t("map.attractions")} items={open.attractions} />
            <DetailList title={t("map.cuisine")} items={open.cuisine} />
            <DetailList title={t("map.people")} items={open.people} />

            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(`${open.name} district Odisha`)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-gold)] px-5 py-2.5 text-sm font-medium text-[#071a34]"
            >
              {t("card.map")} ↗
            </a>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs tracking-[0.2em] text-[color:var(--color-gold)] uppercase">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="glass rounded-full px-3 py-1.5 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
