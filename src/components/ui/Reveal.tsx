"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export type RevealVariant = "fade" | "up" | "down" | "left" | "right" | "blur" | "scale";

const VARIANTS: Record<RevealVariant, Variants> = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  up: { hidden: { opacity: 0, y: 44 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -34 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -56 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 56 }, visible: { opacity: 1, x: 0 } },
  blur: { hidden: { opacity: 0, filter: "blur(16px)", y: 26 }, visible: { opacity: 1, filter: "blur(0px)", y: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
};

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "span";
};

/**
 * Scroll-triggered entrance. Uses Framer's IntersectionObserver under
 * `whileInView` and plays once. Falls back to plain content when the visitor
 * prefers reduced motion — no opacity transition to sit through.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 0.8,
  className,
  amount = 0.25,
  as = "div",
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={VARIANTS[variant]}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

/**
 * Container that staggers its direct `RevealItem` children.
 * Children must be `RevealItem`s for the stagger to reach them.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variant = "up",
  duration = 0.7,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={VARIANTS[variant]} transition={{ duration, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
