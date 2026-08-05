"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A thin gold reading-progress rule pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[110] h-0.5 origin-left"
    >
      <div
        className="h-full w-full"
        style={{ background: "linear-gradient(90deg, var(--color-copper), var(--color-gold), var(--color-gold-2))" }}
      />
    </motion.div>
  );
}
