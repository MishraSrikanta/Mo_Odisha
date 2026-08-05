import type { MotifKind } from "@/lib/data/types";
import { hashString, seededRandom } from "@/lib/utils";

/**
 * Generative artwork used wherever a photograph would go.
 *
 * The site ships with no bitmap imagery: every card, gallery tile and hero
 * panel draws a deterministic SVG composed from Odishan visual vocabulary —
 * the Konark wheel, a rekha deula silhouette, sal canopy, lagoon waves, lotus,
 * tribal geometry, flame and loom. Because the seed is derived from the record
 * id, the same subject always renders the same artwork, on server and client
 * alike, and the whole system costs a few hundred bytes instead of megabytes.
 *
 * To use real photography instead, swap this component for `next/image` — every
 * consumer passes an `id`, `kind` and `alt`, which is all a photo needs.
 */

const PALETTES: Record<MotifKind, [string, string, string]> = {
  temple: ["#c08b5c", "#e8b33d", "#0d2a52"],
  wave: ["#0d2a52", "#2f8a63", "#e8b33d"],
  forest: ["#1f5f4a", "#2f8a63", "#e8b33d"],
  wheel: ["#b06a3b", "#e8b33d", "#071a34"],
  lotus: ["#b06a3b", "#f5d67a", "#1f5f4a"],
  tribal: ["#1f5f4a", "#f08a3c", "#d9b08c"],
  flame: ["#b06a3b", "#f08a3c", "#e8b33d"],
  loom: ["#0d2a52", "#d9b08c", "#e8b33d"],
};

type MotifProps = {
  /** Stable identity — the same id always yields the same artwork. */
  id: string;
  kind: MotifKind;
  className?: string;
  /** Decorative by default; pass a label when the artwork carries meaning. */
  alt?: string;
};

export function Motif({ id, kind, className, alt }: MotifProps) {
  const seed = hashString(`${kind}:${id}`);
  const random = seededRandom(seed);
  const [base, accent, deep] = PALETTES[kind];
  const gradientId = `motif-g-${seed}`;
  const glowId = `motif-h-${seed}`;
  const angle = Math.round(random() * 60) + 100;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={alt ? "img" : "presentation"}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={deep} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor={accent} stopOpacity="0.65" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${gradientId})`} />
      <circle cx={80 + random() * 240} cy={40 + random() * 90} r={110} fill={`url(#${glowId})`} />

      <g opacity="0.92">{renderMotif(kind, random, accent, deep)}</g>

      {/* A unifying wash so every motif sits in the same tonal family */}
      <rect width="400" height="300" fill={deep} opacity="0.18" />
    </svg>
  );
}

function renderMotif(kind: MotifKind, random: () => number, accent: string, deep: string) {
  switch (kind) {
    case "wheel":
      return <KonarkWheel random={random} accent={accent} deep={deep} />;
    case "temple":
      return <TempleSkyline random={random} accent={accent} deep={deep} />;
    case "wave":
      return <Waves random={random} accent={accent} deep={deep} />;
    case "forest":
      return <Canopy random={random} accent={accent} deep={deep} />;
    case "lotus":
      return <Lotus accent={accent} deep={deep} />;
    case "tribal":
      return <TribalGrid random={random} accent={accent} deep={deep} />;
    case "flame":
      return <Flame random={random} accent={accent} deep={deep} />;
    case "loom":
      return <Loom random={random} accent={accent} deep={deep} />;
  }
}

/** The twenty-four-spoke chariot wheel of Konark. */
function KonarkWheel({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  const cx = 200;
  const cy = 190 + random() * 30;
  const r = 130;
  const spokes = Array.from({ length: 24 }, (_, index) => {
    const theta = (index / 24) * Math.PI * 2;
    return {
      x1: cx + Math.cos(theta) * 34,
      y1: cy + Math.sin(theta) * 34,
      x2: cx + Math.cos(theta) * (r - 16),
      y2: cy + Math.sin(theta) * (r - 16),
    };
  });

  return (
    <g stroke={accent} fill="none">
      <circle cx={cx} cy={cy} r={r} strokeWidth="6" opacity="0.9" />
      <circle cx={cx} cy={cy} r={r - 16} strokeWidth="2" opacity="0.55" />
      <circle cx={cx} cy={cy} r={34} strokeWidth="4" opacity="0.9" />
      <circle cx={cx} cy={cy} r={12} fill={accent} stroke="none" opacity="0.9" />
      {spokes.map((spoke, index) => (
        <line key={index} {...spoke} strokeWidth={index % 2 ? 1.4 : 3} opacity={index % 2 ? 0.45 : 0.85} />
      ))}
      {Array.from({ length: 24 }, (_, index) => {
        const theta = ((index + 0.5) / 24) * Math.PI * 2;
        return (
          <circle
            key={`stud-${index}`}
            cx={cx + Math.cos(theta) * (r - 8)}
            cy={cy + Math.sin(theta) * (r - 8)}
            r="3"
            fill={deep}
            stroke="none"
            opacity="0.6"
          />
        );
      })}
    </g>
  );
}

/** Rekha deula towers — the curvilinear Kalinga spire. */
function TempleSkyline({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  const towers = [
    { x: 90, h: 150 + random() * 30, w: 54 },
    { x: 200, h: 210 + random() * 40, w: 76 },
    { x: 305, h: 130 + random() * 30, w: 48 },
  ];

  return (
    <g>
      {towers.map((tower, index) => {
        const base = 285;
        const top = base - tower.h;
        const half = tower.w / 2;
        // A curvilinear profile: vertical at the base, curving inward at the top.
        const path = `M ${tower.x - half} ${base}
          C ${tower.x - half} ${base - tower.h * 0.55}, ${tower.x - half * 0.42} ${top + 34}, ${tower.x - half * 0.3} ${top + 16}
          L ${tower.x + half * 0.3} ${top + 16}
          C ${tower.x + half * 0.42} ${top + 34}, ${tower.x + half} ${base - tower.h * 0.55}, ${tower.x + half} ${base} Z`;
        return (
          <g key={index} opacity={index === 1 ? 1 : 0.72}>
            <path d={path} fill={deep} opacity="0.55" />
            <path d={path} fill="none" stroke={accent} strokeWidth="2.4" />
            {/* Amalaka and kalasa finial */}
            <ellipse cx={tower.x} cy={top + 12} rx={half * 0.44} ry="7" fill={accent} opacity="0.95" />
            <line x1={tower.x} y1={top + 5} x2={tower.x} y2={top - 12} stroke={accent} strokeWidth="3" />
            <circle cx={tower.x} cy={top - 16} r="5" fill={accent} />
            {/* Horizontal bhumi courses */}
            {Array.from({ length: 6 }, (_, band) => {
              const y = top + 30 + band * ((tower.h - 40) / 6);
              const inset = half * (0.34 + (band / 6) * 0.62);
              return (
                <line
                  key={band}
                  x1={tower.x - inset}
                  y1={y}
                  x2={tower.x + inset}
                  y2={y}
                  stroke={accent}
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            })}
          </g>
        );
      })}
      <rect x="0" y="283" width="400" height="17" fill={deep} opacity="0.55" />
    </g>
  );
}

/** Layered lagoon and sea. */
function Waves({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  const bands = Array.from({ length: 6 }, (_, index) => ({
    y: 120 + index * 30,
    amp: 10 + random() * 16,
    offset: random() * 120,
    opacity: 0.2 + index * 0.11,
  }));

  return (
    <g>
      <circle cx={310} cy={70} r={34} fill={accent} opacity="0.75" />
      {bands.map((band, index) => {
        let path = `M -20 ${band.y}`;
        for (let x = -20; x <= 420; x += 40) {
          path += ` Q ${x + 20} ${band.y + (x % 80 === 0 ? -band.amp : band.amp)}, ${x + 40} ${band.y}`;
        }
        path += ` L 420 320 L -20 320 Z`;
        return <path key={index} d={path} fill={index > 3 ? deep : accent} opacity={band.opacity} />;
      })}
    </g>
  );
}

/** Sal forest canopy in receding planes. */
function Canopy({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  const layers = [
    { y: 190, count: 9, scale: 0.7, opacity: 0.35 },
    { y: 226, count: 7, scale: 1, opacity: 0.6 },
    { y: 268, count: 5, scale: 1.35, opacity: 0.9 },
  ];

  return (
    <g>
      <circle cx={90} cy={64} r={30} fill={accent} opacity="0.7" />
      {layers.map((layer, layerIndex) => (
        <g key={layerIndex} opacity={layer.opacity} fill={layerIndex === 2 ? deep : accent}>
          {Array.from({ length: layer.count }, (_, index) => {
            const x = ((index + 0.5) / layer.count) * 420 - 10 + (random() - 0.5) * 24;
            const h = (48 + random() * 40) * layer.scale;
            const w = (26 + random() * 18) * layer.scale;
            return (
              <path
                key={index}
                d={`M ${x} ${layer.y - h} C ${x - w} ${layer.y - h * 0.35}, ${x - w * 0.7} ${layer.y}, ${x} ${layer.y}
                    C ${x + w * 0.7} ${layer.y}, ${x + w} ${layer.y - h * 0.35}, ${x} ${layer.y - h} Z`}
              />
            );
          })}
        </g>
      ))}
      <rect x="0" y="266" width="400" height="34" fill={deep} opacity="0.7" />
    </g>
  );
}

/** Eight-petalled lotus — the pattachitra border flower. */
function Lotus({ accent, deep }: { accent: string; deep: string }) {
  const cx = 200;
  const cy = 160;
  const petals = Array.from({ length: 16 }, (_, index) => {
    const theta = (index / 16) * Math.PI * 2;
    const outer = index % 2 === 0 ? 118 : 86;
    return { theta, outer, key: index };
  });

  return (
    <g>
      {petals.map(({ theta, outer, key }) => {
        const tipX = cx + Math.cos(theta) * outer;
        const tipY = cy + Math.sin(theta) * outer;
        const leftX = cx + Math.cos(theta - 0.19) * outer * 0.5;
        const leftY = cy + Math.sin(theta - 0.19) * outer * 0.5;
        const rightX = cx + Math.cos(theta + 0.19) * outer * 0.5;
        const rightY = cy + Math.sin(theta + 0.19) * outer * 0.5;
        return (
          <path
            key={key}
            d={`M ${cx} ${cy} Q ${leftX} ${leftY}, ${tipX} ${tipY} Q ${rightX} ${rightY}, ${cx} ${cy} Z`}
            fill={key % 2 === 0 ? accent : deep}
            opacity={key % 2 === 0 ? 0.75 : 0.5}
            stroke={accent}
            strokeWidth="1"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="26" fill={deep} opacity="0.8" />
      <circle cx={cx} cy={cy} r="26" fill="none" stroke={accent} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="10" fill={accent} />
    </g>
  );
}

/** Saora-inspired geometry: chevrons, dots and dividing bands. */
function TribalGrid({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  const rows = 5;
  const cols = 9;

  return (
    <g stroke={accent} fill="none" strokeWidth="2">
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const x = 24 + col * 42;
          const y = 46 + row * 52;
          const variant = Math.floor(random() * 3);
          if (variant === 0) {
            return <path key={`${row}-${col}`} d={`M ${x - 14} ${y + 12} L ${x} ${y - 12} L ${x + 14} ${y + 12}`} opacity="0.85" />;
          }
          if (variant === 1) {
            return <circle key={`${row}-${col}`} cx={x} cy={y} r="9" opacity="0.7" />;
          }
          return (
            <path
              key={`${row}-${col}`}
              d={`M ${x - 12} ${y - 12} L ${x + 12} ${y + 12} M ${x + 12} ${y - 12} L ${x - 12} ${y + 12}`}
              opacity="0.6"
            />
          );
        }),
      )}
      {Array.from({ length: rows + 1 }, (_, index) => (
        <line key={`band-${index}`} x1="0" y1={20 + index * 52} x2="400" y2={20 + index * 52} stroke={deep} opacity="0.35" strokeWidth="1" />
      ))}
    </g>
  );
}

/** Lamp flame — festival and arati. */
function Flame({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  const flames = Array.from({ length: 5 }, (_, index) => ({
    x: 70 + index * 65,
    h: 70 + random() * 46,
    o: 0.5 + random() * 0.5,
  }));

  return (
    <g>
      {flames.map((flame, index) => (
        <g key={index} opacity={flame.o}>
          <path
            d={`M ${flame.x} ${230 - flame.h}
                C ${flame.x + 22} ${230 - flame.h * 0.5}, ${flame.x + 16} ${230}, ${flame.x} ${232}
                C ${flame.x - 16} ${230}, ${flame.x - 22} ${230 - flame.h * 0.5}, ${flame.x} ${230 - flame.h} Z`}
            fill={accent}
          />
          <path
            d={`M ${flame.x} ${228 - flame.h * 0.55}
                C ${flame.x + 10} ${228 - flame.h * 0.24}, ${flame.x + 7} ${230}, ${flame.x} ${231}
                C ${flame.x - 7} ${230}, ${flame.x - 10} ${228 - flame.h * 0.24}, ${flame.x} ${228 - flame.h * 0.55} Z`}
            fill={deep}
            opacity="0.55"
          />
          <ellipse cx={flame.x} cy={244} rx="26" ry="12" fill={deep} opacity="0.75" />
          <ellipse cx={flame.x} cy={244} rx="26" ry="12" fill="none" stroke={accent} strokeWidth="1.6" />
        </g>
      ))}
      <rect x="0" y="256" width="400" height="44" fill={deep} opacity="0.6" />
    </g>
  );
}

/** Ikat weave — warp, weft and the feathered edge of bandha. */
function Loom({ random, accent, deep }: { random: () => number; accent: string; deep: string }) {
  return (
    <g>
      {Array.from({ length: 26 }, (_, index) => (
        <line
          key={`warp-${index}`}
          x1={index * 16}
          y1="0"
          x2={index * 16}
          y2="300"
          stroke={accent}
          strokeWidth={index % 4 === 0 ? 3 : 1}
          opacity={index % 4 === 0 ? 0.55 : 0.22}
        />
      ))}
      {Array.from({ length: 14 }, (_, index) => (
        <line
          key={`weft-${index}`}
          x1="0"
          y1={index * 22 + 8}
          x2="400"
          y2={index * 22 + 8}
          stroke={deep}
          strokeWidth={index % 3 === 0 ? 5 : 2}
          opacity={index % 3 === 0 ? 0.5 : 0.25}
        />
      ))}
      {Array.from({ length: 7 }, (_, index) => {
        const cx = 40 + index * 55;
        const cy = 90 + (index % 3) * 62;
        const size = 16 + random() * 10;
        return (
          <path
            key={`motif-${index}`}
            d={`M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z`}
            fill={accent}
            opacity="0.7"
            stroke={deep}
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}
