"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DESTINATIONS } from "@/lib/data/tourism";
import { TEMPLES } from "@/lib/data/temples";
import { WILDLIFE } from "@/lib/data/wildlife";
import { ART_FORMS, FESTIVALS } from "@/lib/data/festivals";
import { DISHES } from "@/lib/data/food";
import { GALLERY_THEMES } from "@/lib/data/site";
import type { MotifKind } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { Modal } from "@/components/ui/Modal";
import { FilterChip } from "./CultureGrid";

type GalleryItem = {
  id: string;
  title: string;
  titleOr: string;
  caption: string;
  theme: (typeof GALLERY_THEMES)[number]["id"];
  motif: MotifKind;
};

/** One flat gallery assembled from every dataset on the site. */
function buildItems(): GalleryItem[] {
  const items: GalleryItem[] = [];

  for (const temple of TEMPLES) {
    items.push({
      id: `temple-${temple.id}`,
      title: temple.name,
      titleOr: temple.nameOr,
      caption: temple.blurb,
      theme: "temples",
      motif: "temple",
    });
  }

  for (const destination of DESTINATIONS) {
    const coastal = destination.category === "beaches" || destination.category === "lakes";
    const wild = ["forests", "wildlife", "waterfalls", "eco", "hills"].includes(destination.category);
    items.push({
      id: `place-${destination.id}`,
      title: destination.name,
      titleOr: destination.nameOr,
      caption: destination.blurb,
      theme: coastal ? "coast" : wild ? "forest" : destination.category === "tribal" ? "people" : "temples",
      motif: destination.motif,
    });
  }

  for (const site of WILDLIFE) {
    items.push({
      id: `wild-${site.id}`,
      title: site.name,
      titleOr: site.nameOr,
      caption: site.blurb,
      theme: "forest",
      motif: site.motif,
    });
  }

  for (const form of ART_FORMS) {
    items.push({
      id: `art-${form.id}`,
      title: form.name,
      titleOr: form.nameOr,
      caption: form.blurb,
      theme: "craft",
      motif: form.motif,
    });
  }

  for (const festival of FESTIVALS) {
    items.push({
      id: `fest-${festival.id}`,
      title: festival.name,
      titleOr: festival.nameOr,
      caption: festival.blurb,
      theme: "festival",
      motif: festival.motif,
    });
  }

  for (const dish of DISHES) {
    items.push({
      id: `dish-${dish.id}`,
      title: dish.name,
      titleOr: dish.nameOr,
      caption: dish.blurb,
      theme: "people",
      motif: dish.kind === "sweet" ? "lotus" : "loom",
    });
  }

  return items;
}

export function GalleryWall() {
  const { t, pick, isOdia } = useLocale();
  const [theme, setTheme] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);

  const all = useMemo(buildItems, []);
  const items = useMemo(
    () => (theme === "all" ? all : all.filter((item) => item.theme === theme)),
    [all, theme],
  );

  const current = index !== null ? items[index] : null;
  const step = (delta: number) => {
    if (index === null) return;
    setIndex((index + delta + items.length) % items.length);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={theme === "all"} onClick={() => setTheme("all")} label={t("filter.all")} />
        {GALLERY_THEMES.map((item) => (
          <FilterChip
            key={item.id}
            active={theme === item.id}
            onClick={() => setTheme(item.id)}
            label={pick(item.label, item.labelOr)}
            odia={isOdia}
          />
        ))}
      </div>

      <p aria-live="polite" className="mt-6 text-xs tracking-[0.2em] text-muted uppercase">
        {items.length} {t("filter.results")}
      </p>

      <motion.ul layout className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>li]:mb-4 [&>li]:break-inside-avoid">
        <AnimatePresence mode="popLayout">
          {items.map((item, itemIndex) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setIndex(itemIndex)}
                className="group shadow-soft relative block w-full overflow-hidden rounded-2xl"
                aria-label={`${item.title} — ${t("card.gallery")}`}
              >
                <span
                  className="block overflow-hidden"
                  style={{ aspectRatio: itemIndex % 5 === 0 ? "3/4" : itemIndex % 3 === 0 ? "1/1" : "4/3" }}
                >
                  <Motif
                    id={item.id}
                    kind={item.motif}
                    className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                </span>
                <span
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.92), transparent 65%)" }}
                  aria-hidden="true"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block text-sm leading-tight font-medium text-white">{item.title}</span>
                  <span className="font-odia mt-0.5 block text-sm text-[color:var(--color-gold-2)]">{item.titleOr}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Modal
        open={current !== null}
        onClose={() => setIndex(null)}
        title={current?.title ?? ""}
        subtitle={current?.titleOr}
        footer={
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => step(-1)}
              className="glass rounded-full px-5 py-2 text-sm transition-colors hover:border-[color:var(--color-gold)]"
            >
              ← {t("common.back")}
            </button>
            <span className="text-xs text-muted">
              {(index ?? 0) + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              className="glass rounded-full px-5 py-2 text-sm transition-colors hover:border-[color:var(--color-gold)]"
            >
              {t("card.explore")} →
            </button>
          </div>
        }
      >
        {current ? (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-2xl">
              <Motif id={current.id} kind={current.motif} className="aspect-[16/9] w-full" alt={current.title} />
            </div>
            <p className="text-base leading-relaxed">{current.caption}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
