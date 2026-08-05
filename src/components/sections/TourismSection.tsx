"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DESTINATIONS, TOURISM_CATEGORIES } from "@/lib/data/tourism";
import type { Destination, TourismCategory } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";
import { TiltCard } from "@/components/ui/TiltCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Category filter, immersive destination cards, and a full detail modal. */
export function TourismSection({ limit }: { limit?: number }) {
  const { t, pick, isOdia } = useLocale();
  const [category, setCategory] = useState<TourismCategory | "all">("all");
  const [open, setOpen] = useState<Destination | null>(null);

  const results = useMemo(() => {
    const filtered = category === "all" ? DESTINATIONS : DESTINATIONS.filter((item) => item.category === category);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [category, limit]);

  return (
    <div>
      <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setCategory("all")}
          aria-pressed={category === "all"}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs transition-all duration-300",
            category === "all"
              ? "bg-[color:var(--color-gold)] text-[#071a34]"
              : "glass text-muted hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]",
          )}
        >
          {t("filter.all")}
        </button>
        {TOURISM_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            aria-pressed={category === item.id}
            title={item.blurb}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs transition-all duration-300",
              category === item.id
                ? "bg-[color:var(--color-gold)] text-[#071a34]"
                : "glass text-muted hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]",
              isOdia && "font-odia",
            )}
          >
            {pick(item.label, item.labelOr)}
          </button>
        ))}
      </div>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {results.map((destination) => (
            <motion.div
              key={destination.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <RevealItem className="h-full">
                <DestinationCard destination={destination} onOpen={() => setOpen(destination)} />
              </RevealItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </RevealGroup>

      <DestinationModal destination={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function DestinationCard({ destination, onOpen }: { destination: Destination; onOpen: () => void }) {
  const { t } = useLocale();
  const category = TOURISM_CATEGORIES.find((item) => item.id === destination.category);

  return (
    <TiltCard className="h-full rounded-3xl">
      <article className="glass ornament shadow-soft relative flex h-full flex-col overflow-hidden rounded-3xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Motif
            id={destination.id}
            kind={destination.motif}
            className="h-full w-full scale-105 transition-transform duration-[1.2s] ease-out group-hover:scale-115"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.92), rgb(5 14 30 / 0.15) 55%, transparent)" }}
            aria-hidden="true"
          />
          <span className="absolute top-4 left-4 rounded-full bg-black/40 px-3 py-1 text-[0.65rem] tracking-[0.18em] text-white/90 uppercase backdrop-blur-md">
            {category?.label}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-2xl leading-tight font-light text-white">{destination.name}</h3>
            <p className="font-odia mt-0.5 text-base text-[color:var(--color-gold-2)]">{destination.nameOr}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-sm leading-relaxed text-muted">{destination.blurb}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="tracking-[0.14em] text-muted uppercase">{t("card.location")}</dt>
              <dd className="mt-0.5">{destination.district}</dd>
            </div>
            <div>
              <dt className="tracking-[0.14em] text-muted uppercase">{t("card.season")}</dt>
              <dd className="mt-0.5">{destination.season}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onOpen}
              className="rounded-full bg-[color:var(--color-gold)] px-4 py-2 text-xs font-medium text-[#071a34] transition-transform duration-300 hover:scale-105"
            >
              {t("card.learn")}
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${destination.coords[0]},${destination.coords[1]}`}
              target="_blank"
              rel="noreferrer noopener"
              className="glass rounded-full px-4 py-2 text-xs transition-colors hover:border-[color:var(--color-gold)]"
            >
              {t("card.map")} ↗
            </a>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function DestinationModal({ destination, onClose }: { destination: Destination | null; onClose: () => void }) {
  const { t } = useLocale();

  return (
    <Modal
      open={Boolean(destination)}
      onClose={onClose}
      title={destination?.name ?? ""}
      subtitle={destination ? `${destination.nameOr} · ${destination.district}` : undefined}
    >
      {destination ? (
        <div className="space-y-8">
          <div className="overflow-hidden rounded-2xl">
            <Motif id={destination.id} kind={destination.motif} className="aspect-[16/7] w-full" alt={destination.name} />
          </div>

          <p className="text-base leading-relaxed">{destination.description}</p>

          <section>
            <h3 className="text-xs tracking-[0.2em] text-[color:var(--color-gold)] uppercase">{t("card.facts")}</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              {destination.facts.map((fact) => (
                <div key={fact.label} className="glass rounded-xl p-4">
                  <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{fact.label}</dt>
                  <dd className="mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className="text-xs tracking-[0.2em] text-[color:var(--color-gold)] uppercase">{t("card.gallery")}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {destination.gallery.map((caption, index) => (
                <li key={caption} className="overflow-hidden rounded-xl">
                  <Motif id={`${destination.id}-${index}`} kind={destination.motif} className="aspect-square w-full" />
                  <p className="mt-1.5 text-[0.7rem] leading-snug text-muted">{caption}</p>
                </li>
              ))}
            </ul>
          </section>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${destination.coords[0]},${destination.coords[1]}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-gold)] px-5 py-2.5 text-sm font-medium text-[#071a34]"
          >
            {t("card.map")} ↗
          </a>
        </div>
      ) : null}
    </Modal>
  );
}
