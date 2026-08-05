"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DISHES } from "@/lib/data/food";
import type { Dish } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";
import { FilterChip } from "./CultureGrid";

const KINDS: { id: Dish["kind"] | "all"; label: string; labelOr: string }[] = [
  { id: "all", label: "All", labelOr: "ସମସ୍ତ" },
  { id: "staple", label: "Staples", labelOr: "ମୁଖ୍ୟ ଖାଦ୍ୟ" },
  { id: "curry", label: "Curries", labelOr: "ତରକାରୀ" },
  { id: "snack", label: "Snacks", labelOr: "ଜଳଖିଆ" },
  { id: "sweet", label: "Sweets", labelOr: "ମିଠା" },
  { id: "prasad", label: "Prasad", labelOr: "ପ୍ରସାଦ" },
];

/** Recipe-card gallery: flip-style hover, full detail in a modal. */
export function FoodSection({ limit }: { limit?: number }) {
  const { pick, isOdia } = useLocale();
  const [kind, setKind] = useState<Dish["kind"] | "all">("all");
  const [open, setOpen] = useState<Dish | null>(null);

  const dishes = useMemo(() => {
    const filtered = kind === "all" ? DISHES : DISHES.filter((dish) => dish.kind === kind);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [kind, limit]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {KINDS.map((item) => (
          <FilterChip
            key={item.id}
            active={kind === item.id}
            onClick={() => setKind(item.id)}
            label={pick(item.label, item.labelOr)}
            odia={isOdia}
          />
        ))}
      </div>

      <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {dishes.map((dish, index) => (
            <motion.li
              key={dish.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(dish)}
                className="group glass ornament shadow-soft relative flex h-full w-full flex-col overflow-hidden rounded-3xl text-left"
              >
                <span className="relative block aspect-square overflow-hidden">
                  <Motif
                    id={dish.id}
                    kind={dish.kind === "sweet" ? "lotus" : dish.kind === "prasad" ? "temple" : "loom"}
                    className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <span
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.9), transparent 70%)" }}
                    aria-hidden="true"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[0.6rem] tracking-[0.16em] text-white/90 uppercase backdrop-blur-md">
                    {dish.kind}
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-lg leading-tight font-light">{dish.name}</span>
                  <span className="font-odia mt-0.5 text-base text-[color:var(--color-gold)]">{dish.nameOr}</span>
                  <span className="mt-3 text-sm leading-relaxed text-muted">{dish.blurb}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.name ?? ""} subtitle={open?.nameOr}>
        {open ? (
          <div className="space-y-7">
            <div className="overflow-hidden rounded-2xl">
              <Motif id={open.id} kind={open.kind === "sweet" ? "lotus" : "loom"} className="aspect-[16/7] w-full" />
            </div>
            <p className="text-base leading-relaxed">{open.description}</p>

            <section>
              <h3 className="text-xs tracking-[0.2em] text-[color:var(--color-gold)] uppercase">Ingredients</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {open.ingredients.map((ingredient) => (
                  <li key={ingredient} className="glass rounded-full px-3 py-1.5 text-sm">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="glass rounded-xl p-4">
                <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">Served with</dt>
                <dd className="mt-1 text-sm">{open.servedWith}</dd>
              </div>
              <div className="glass rounded-xl p-4">
                <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">Region</dt>
                <dd className="mt-1 text-sm">{open.region}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
