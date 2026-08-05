"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TEMPLES } from "@/lib/data/temples";
import type { Temple } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";
import { TiltCard } from "@/components/ui/TiltCard";

/** Interactive 3D temple cards with a detail modal. */
export function TempleGallery({ limit }: { limit?: number }) {
  const { t } = useLocale();
  const [open, setOpen] = useState<Temple | null>(null);
  const temples = limit ? TEMPLES.slice(0, limit) : TEMPLES;

  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {temples.map((temple, index) => (
          <motion.li
            key={temple.id}
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="[perspective:1200px]"
          >
            <TiltCard intensity={9} className="h-full rounded-3xl">
              <button
                type="button"
                onClick={() => setOpen(temple)}
                className="glass ornament shadow-soft group relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left"
              >
                <span className="relative block aspect-[3/4] overflow-hidden">
                  <Motif
                    id={temple.id}
                    kind="temple"
                    className="h-full w-full transition-transform duration-[1.3s] ease-out group-hover:scale-110"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.95), rgb(5 14 30 / 0.1) 55%, transparent)" }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-xs tracking-[0.2em] text-[color:var(--color-gold-2)] uppercase">
                      {temple.builtIn}
                    </span>
                    <span className="mt-2 block text-2xl leading-tight font-light text-white">{temple.name}</span>
                    <span className="font-odia mt-0.5 block text-base text-white/70">{temple.nameOr}</span>
                  </span>
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="text-sm leading-relaxed text-muted">{temple.blurb}</span>
                  <span className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <span className="block">
                      <span className="block tracking-[0.14em] text-muted uppercase">Deity</span>
                      <span className="mt-0.5 block">{temple.deity}</span>
                    </span>
                    <span className="block">
                      <span className="block tracking-[0.14em] text-muted uppercase">Height</span>
                      <span className="mt-0.5 block">{temple.height}</span>
                    </span>
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs text-[color:var(--color-gold)]">
                    {t("card.learn")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </button>
            </TiltCard>
          </motion.li>
        ))}
      </ul>

      <Modal
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open?.name ?? ""}
        subtitle={open ? `${open.nameOr} · ${open.district}` : undefined}
      >
        {open ? (
          <div className="space-y-7">
            <div className="overflow-hidden rounded-2xl">
              <Motif id={open.id} kind="temple" className="aspect-[16/7] w-full" alt={open.name} />
            </div>
            <p className="text-base leading-relaxed">{open.description}</p>

            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Style", open.style],
                ["Built", open.builtIn],
                ["Deity", open.deity],
                ["Height", open.height],
                ...open.facts.map((fact) => [fact.label, fact.value] as const),
              ].map(([label, value]) => (
                <div key={String(label)} className="glass rounded-xl p-4">
                  <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{label}</dt>
                  <dd className="mt-1 text-sm">{value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${open.coords[0]},${open.coords[1]}`}
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
