"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ART_FORMS } from "@/lib/data/festivals";
import type { ArtForm } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";

/** Masonry-ish gallery of traditional art forms. */
export function ArtsGallery({ limit }: { limit?: number }) {
  const { t } = useLocale();
  const [open, setOpen] = useState<ArtForm | null>(null);
  const forms = limit ? ART_FORMS.slice(0, limit) : ART_FORMS;

  return (
    <div>
      <ul className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid">
        {forms.map((form, index) => (
          <motion.li
            key={form.id}
            initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(form)}
              className="group glass ornament shadow-soft relative block w-full overflow-hidden rounded-3xl text-left"
            >
              <span className="relative block overflow-hidden" style={{ aspectRatio: index % 3 === 1 ? "3/4" : "4/3" }}>
                <Motif
                  id={form.id}
                  kind={form.motif}
                  className="h-full w-full transition-transform duration-[1.3s] ease-out group-hover:scale-110"
                />
                <span
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.92), transparent 58%)" }}
                  aria-hidden="true"
                />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-[0.62rem] tracking-[0.2em] text-[color:var(--color-gold-2)] uppercase">
                    {form.medium}
                  </span>
                  <span className="mt-1.5 block text-xl leading-tight font-light text-white">{form.name}</span>
                  <span className="font-odia mt-0.5 block text-base text-white/70">{form.nameOr}</span>
                </span>
              </span>
              <span className="block p-5">
                <span className="block text-sm leading-relaxed text-muted">{form.blurb}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-xs text-[color:var(--color-gold)]">
                  {t("card.learn")}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.name ?? ""} subtitle={open?.nameOr}>
        {open ? (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl">
              <Motif id={open.id} kind={open.motif} className="aspect-[16/7] w-full" alt={open.name} />
            </div>
            <p className="text-base leading-relaxed">{open.description}</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="glass rounded-xl p-4">
                <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">Medium</dt>
                <dd className="mt-1 text-sm">{open.medium}</dd>
              </div>
              <div className="glass rounded-xl p-4">
                <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">Origin</dt>
                <dd className="mt-1 text-sm">{open.origin}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
