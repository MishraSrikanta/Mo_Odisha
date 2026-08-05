"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { DISTRICTS, MAP_GRID } from "@/lib/data/districts";
import type { District } from "@/lib/data/types";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Interactive district map, drawn as a schematic tile grid.
 *
 * A deliberate choice over traced boundary paths: a tile map keeps every
 * district the same size and therefore equally clickable — Malkangiri gets the
 * same target as Ganjam — while columns still run west-to-east and rows
 * north-to-south, so the spatial reading survives. It is also keyboard
 * navigable and readable at any zoom, which a 30-path boundary SVG is not.
 */

const TILE = 100;
const GAP = 10;

const REGION_TINT: Record<District["region"], string> = {
  coastal: "var(--color-deep-2)",
  central: "var(--color-copper)",
  north: "var(--color-forest)",
  south: "var(--color-saffron)",
  west: "var(--color-sand-2)",
};

export function OdishaMap({ onSelect }: { onSelect?: (district: District) => void }) {
  const { t, pick, isOdia } = useLocale();
  const [hovered, setHovered] = useState<District | null>(null);
  const [selected, setSelected] = useState<District | null>(null);

  const width = MAP_GRID.cols * (TILE + GAP) + GAP;
  const height = MAP_GRID.rows * (TILE + GAP) + GAP;

  const active = selected ?? hovered;

  const regions = useMemo(
    () => [
      { id: "north", label: "North" },
      { id: "west", label: "West" },
      { id: "central", label: "Central" },
      { id: "coastal", label: "Coastal" },
      { id: "south", label: "South" },
    ] as const,
    [],
  );

  const choose = (district: District) => {
    setSelected(district);
    onSelect?.(district);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div>
        <div className="glass shadow-soft relative overflow-hidden rounded-3xl p-4 sm:p-6">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full"
            role="group"
            aria-label="Districts of Odisha"
          >
            <defs>
              <filter id="tile-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {DISTRICTS.map((district, index) => {
              const x = GAP + (district.cell.col - 1) * (TILE + GAP);
              const y = GAP + (district.cell.row - 1) * (TILE + GAP);
              const isActive = active?.id === district.id;
              const isSelected = selected?.id === district.id;

              return (
                <motion.g
                  key={district.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.018, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onHoverStart={() => setHovered(district)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => choose(district)}
                  style={{ cursor: "pointer", transformOrigin: `${x + TILE / 2}px ${y + TILE / 2}px` }}
                  whileHover={{ scale: 1.07 }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${district.name} ${t("map.district")}`}
                  onFocus={() => setHovered(district)}
                  onBlur={() => setHovered(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      choose(district);
                    }
                  }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={TILE}
                    height={TILE}
                    rx="18"
                    fill={REGION_TINT[district.region]}
                    fillOpacity={isActive ? 0.5 : 0.22}
                    stroke={isSelected ? "var(--color-gold)" : "var(--line)"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isActive ? "url(#tile-glow)" : undefined}
                  />
                  <text
                    x={x + TILE / 2}
                    y={y + TILE / 2 - 6}
                    textAnchor="middle"
                    fontSize="13"
                    fill="var(--fg)"
                    opacity={isActive ? 1 : 0.85}
                    style={{ pointerEvents: "none" }}
                  >
                    {shorten(district.name)}
                  </text>
                  <text
                    x={x + TILE / 2}
                    y={y + TILE / 2 + 16}
                    textAnchor="middle"
                    fontSize="15"
                    fill="var(--color-gold)"
                    opacity={isActive ? 1 : 0.6}
                    style={{ pointerEvents: "none", fontFamily: "var(--font-odia)" }}
                  >
                    {district.nameOr}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
          {regions.map((region) => (
            <span key={region.id} className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: REGION_TINT[region.id], opacity: 0.8 }}
                aria-hidden="true"
              />
              {region.label}
            </span>
          ))}
          <span className="ml-auto">{t("map.hint")}</span>
        </div>
      </div>

      <div className="lg:sticky lg:top-28">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.article
              key={active.id}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass shadow-soft ornament relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              <p className="text-xs tracking-[0.28em] text-[color:var(--color-gold)] uppercase">{t("map.district")}</p>
              <h3 className="mt-2 text-3xl leading-tight font-light">{active.name}</h3>
              <p className="font-odia mt-1 text-xl text-muted">{active.nameOr}</p>

              <p className={cn("mt-5 text-sm leading-relaxed", isOdia && "font-odia")}>{active.knownFor}</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
                <Stat label={t("map.headquarters")} value={active.headquarters} />
                <Stat label={t("map.population")} value={active.population} />
                <Stat label={t("map.area")} value={active.area} />
                <Stat label={t("map.festival")} value={active.festival} />
              </dl>

              <Group title={t("map.attractions")} items={active.attractions} />
              <Group title={t("map.cuisine")} items={active.cuisine} />
              <Group title={t("map.people")} items={active.people} />

              <div className="mt-6 flex flex-wrap gap-2">
                {active.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-[color:var(--color-gold)]/40 px-3 py-1 text-xs text-[color:var(--color-gold)] capitalize"
                  >
                    {pick(theme, theme)}
                  </span>
                ))}
              </div>
            </motion.article>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass grid min-h-[22rem] place-items-center rounded-3xl p-8 text-center"
            >
              <div>
                <span className="font-odia block text-5xl text-[color:var(--color-gold)] opacity-50">ଓ</span>
                <p className="mt-4 text-sm text-muted">{t("map.select")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function Group({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item} className="glass rounded-full px-2.5 py-1 text-xs">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Keep tile labels legible — long names get an ellipsis rather than overflow. */
function shorten(name: string) {
  return name.length > 12 ? `${name.slice(0, 11)}…` : name;
}
