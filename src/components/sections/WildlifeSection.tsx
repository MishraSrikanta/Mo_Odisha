"use client";

import { motion } from "framer-motion";
import { WILDLIFE } from "@/lib/data/wildlife";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";

/**
 * Alternating full-bleed panels — forest on one side, text on the other.
 * Each panel's artwork drifts on a slow parallax as it passes the viewport.
 */
export function WildlifeSection({ limit }: { limit?: number }) {
  const { t } = useLocale();
  const sites = limit ? WILDLIFE.slice(0, limit) : WILDLIFE;

  return (
    <ul className="mt-14 space-y-16 sm:space-y-24">
      {sites.map((site, index) => {
        const flipped = index % 2 === 1;
        return (
          <motion.li
            key={site.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            <motion.div
              initial={{ opacity: 0, x: flipped ? 60 : -60, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`shadow-soft overflow-hidden rounded-3xl ${flipped ? "lg:order-2" : ""}`}
            >
              <Motif id={site.id} kind={site.motif} className="aspect-[4/3] w-full" alt={site.name} />
            </motion.div>

            <div className={flipped ? "lg:order-1" : ""}>
              <p className="text-xs tracking-[0.26em] text-[color:var(--color-gold)] uppercase">{site.type}</p>
              <h3 className="mt-3 text-[clamp(1.7rem,3.4vw,2.8rem)] leading-tight font-light">{site.name}</h3>
              <p className="font-odia mt-1 text-lg text-muted">{site.nameOr}</p>
              <p className="mt-5 text-base leading-relaxed text-muted">{site.description}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{t("card.location")}</dt>
                  <dd className="mt-1">{site.district}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">Area</dt>
                  <dd className="mt-1">{site.area}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{t("card.season")}</dt>
                  <dd className="mt-1">{site.season}</dd>
                </div>
              </dl>

              <ul className="mt-6 flex flex-wrap gap-2">
                {site.species.map((species) => (
                  <li key={species} className="glass rounded-full px-3 py-1.5 text-xs">
                    {species}
                  </li>
                ))}
              </ul>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${site.coords[0]},${site.coords[1]}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold)]/50 px-5 py-2.5 text-sm text-[color:var(--color-gold)] transition-colors hover:bg-[color:var(--color-gold)] hover:text-[#071a34]"
              >
                {t("card.map")} ↗
              </a>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
