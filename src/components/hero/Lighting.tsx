"use client";

import { useMemo } from "react";
import { seededRandom } from "@/lib/utils";

/**
 * Volumetric lighting and ambient dust.
 *
 * Pure CSS transforms and opacity only — every layer stays on the compositor,
 * so this costs no main-thread time even while the curtain simulation runs.
 * Positions come from a seeded PRNG so server and client markup match.
 */

export function LightRays({ className = "" }: { className?: string }) {
  const rays = useMemo(() => {
    const random = seededRandom(4211);
    return Array.from({ length: 7 }, (_, index) => ({
      id: index,
      left: 6 + random() * 88,
      width: 3 + random() * 9,
      tilt: -18 + random() * 36,
      delay: random() * -22,
      duration: 16 + random() * 16,
      opacity: 0.06 + random() * 0.14,
    }));
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {rays.map((ray) => (
        <span
          key={ray.id}
          className="absolute -top-1/4 h-[150%] origin-top will-change-transform"
          style={{
            left: `${ray.left}%`,
            width: `${ray.width}rem`,
            transform: `rotate(${ray.tilt}deg)`,
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--color-gold) 55%, transparent), transparent 72%)",
            filter: "blur(28px)",
            opacity: ray.opacity,
            animation: `ray-drift ${ray.duration}s ease-in-out ${ray.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes ray-drift {
          0%, 100% { transform: translate3d(-2%, 0, 0) rotate(var(--tilt, 0deg)) scaleY(1); opacity: 0.35; }
          50% { transform: translate3d(3%, 0, 0) rotate(var(--tilt, 0deg)) scaleY(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function DustMotes({ count = 46, className = "" }: { count?: number; className?: string }) {
  const motes = useMemo(() => {
    const random = seededRandom(90210);
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: random() * 100,
      top: random() * 100,
      size: 1 + random() * 2.6,
      delay: random() * -30,
      duration: 14 + random() * 22,
      drift: -30 + random() * 60,
      opacity: 0.2 + random() * 0.6,
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {motes.map((mote) => (
        <span
          key={mote.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            background: "var(--color-gold-2)",
            boxShadow: "0 0 6px color-mix(in oklab, var(--color-gold) 70%, transparent)",
            opacity: mote.opacity,
            ["--drift" as string]: `${mote.drift}px`,
            animation: `mote-float ${mote.duration}s linear ${mote.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes mote-float {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translate3d(var(--drift), -110px, 0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** The slow, breathing halo that sits behind the curtain. */
export function StageGlow({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/3 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-gold) 30%, transparent) 0%, color-mix(in oklab, var(--color-copper) 14%, transparent) 38%, transparent 68%)",
          filter: "blur(40px)",
          animation: "stage-breathe 11s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes stage-breathe {
          0%, 100% { transform: translate3d(-50%, -50%, 0) scale(1); opacity: 0.75; }
          50% { transform: translate3d(-50%, -50%, 0) scale(1.12); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
