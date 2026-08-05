"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A card that tilts toward the pointer in 3D, with a specular highlight that
 * tracks the cursor.
 *
 * Rotation runs through springs so the card eases rather than snapping, and the
 * whole effect is skipped on touch devices — where there is no hover state to
 * respond to — and whenever reduced motion is requested.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. */
  intensity?: number;
  glare?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = fine && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 180, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), spring);

  const glareX = useTransform(px, (value) => `${value * 100}%`);
  const glareY = useTransform(py, (value) => `${value * 100}%`);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, color-mix(in oklab, var(--color-gold) 30%, transparent), transparent 55%)`;

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      whileHover={enabled ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={cn("group relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {glare && enabled ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  );
}
