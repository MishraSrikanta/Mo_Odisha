"use client";

import { useEffect, useRef } from "react";
import { AMBIENT_GLYPHS } from "@/lib/odia";
import { LetterFieldSim, STRIDE } from "@/lib/letterFieldSim";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The layer behind the curtain: Odia letters drifting down through depth.
 *
 * Particle maths runs in a Web Worker with the render buffer transferred back
 * and forth, so a few hundred letters with per-particle rotation, glow and
 * parallax cost the main thread nothing but `drawImage` calls. If the worker
 * cannot be constructed (older browsers, strict CSP), the identical simulation
 * runs inline instead — same class, same output.
 */
export function LetterField({ className, density = 1 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let count = 0;

    /** Two sprite sets per glyph: plain, and one with a golden halo baked in. */
    let spritesPlain: HTMLCanvasElement[] = [];
    let spritesGlow: HTMLCanvasElement[] = [];
    const SPRITE_PX = 96;

    const buildSprites = () => {
      const light = getComputedStyle(document.documentElement).getPropertyValue("color-scheme").includes("light");
      const plain = light ? "rgba(70, 58, 46, 0.9)" : "rgba(225, 234, 246, 0.9)";
      const glowInk = light ? "rgba(176, 106, 59, 1)" : "rgba(245, 214, 122, 1)";

      const render = (character: string, color: string, halo: boolean) => {
        const sprite = document.createElement("canvas");
        sprite.width = SPRITE_PX;
        sprite.height = SPRITE_PX;
        const spriteContext = sprite.getContext("2d")!;
        spriteContext.font = `${SPRITE_PX * 0.66}px var(--font-odia), "Noto Sans Oriya", "Kalinga", sans-serif`;
        spriteContext.textAlign = "center";
        spriteContext.textBaseline = "middle";
        if (halo) {
          spriteContext.shadowColor = glowInk;
          spriteContext.shadowBlur = SPRITE_PX * 0.3;
        }
        spriteContext.fillStyle = color;
        spriteContext.fillText(character, SPRITE_PX / 2, SPRITE_PX / 2);
        return sprite;
      };

      spritesPlain = AMBIENT_GLYPHS.map((character) => render(character, plain, false));
      spritesGlow = AMBIENT_GLYPHS.map((character) => render(character, glowInk, true));
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    measure();
    buildSprites();

    // Scale the particle budget to the viewport, then to the caller's density.
    count = Math.round(Math.min(260, Math.max(60, (width * height) / 9000)) * density);
    let buffer: ArrayBuffer | null = new ArrayBuffer(count * STRIDE * Float32Array.BYTES_PER_ELEMENT);

    const drawFrame = (view: Float32Array) => {
      context.clearRect(0, 0, width, height);
      let blurred = false;

      for (let index = 0; index < count; index++) {
        const offset = index * STRIDE;
        const alpha = view[offset + 4];
        if (alpha <= 0.01) continue;

        const size = view[offset + 2];
        const glow = view[offset + 6];
        const wantsBlur = view[offset + 7] > 0.5;

        if (wantsBlur !== blurred) {
          context.filter = wantsBlur ? "blur(1.6px)" : "none";
          blurred = wantsBlur;
        }

        context.globalAlpha = Math.min(1, alpha + glow * 0.5);
        context.translate(view[offset], view[offset + 1]);
        context.rotate(view[offset + 3]);

        const sprites = glow > 0.45 ? spritesGlow : spritesPlain;
        const sprite = sprites[view[offset + 5] % sprites.length];
        context.drawImage(sprite, -size / 2, -size / 2, size, size);

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      context.filter = "none";
      context.globalAlpha = 1;
    };

    if (reduced) {
      // Single static frame — the atmosphere without the motion.
      const sim = new LetterFieldSim({ width, height, count, glyphCount: AMBIENT_GLYPHS.length, seed: 20260401 });
      const view = new Float32Array(buffer);
      sim.step(0, 0, view);
      drawFrame(view);
      return;
    }

    let worker: Worker | null = null;
    let fallbackSim: LetterFieldSim | null = null;
    let frame = 0;
    let last = performance.now();
    let scroll = 0;
    let awaitingFrame = false;
    let disposed = false;

    const onScroll = () => {
      scroll = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    try {
      worker = new Worker(new URL("../../workers/letterField.worker.ts", import.meta.url));
      worker.postMessage({
        type: "init",
        width,
        height,
        count,
        glyphCount: AMBIENT_GLYPHS.length,
        seed: 20260401,
      });
      worker.onmessage = (event: MessageEvent<{ type: "frame"; buffer: ArrayBuffer }>) => {
        if (disposed) return;
        buffer = event.data.buffer;
        awaitingFrame = false;
        drawFrame(new Float32Array(buffer));
      };
    } catch {
      // Worker unavailable — run the same simulation inline.
      worker = null;
      fallbackSim = new LetterFieldSim({ width, height, count, glyphCount: AMBIENT_GLYPHS.length, seed: 20260401 });
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (document.visibilityState !== "visible") return;

      if (worker) {
        // Skip a tick rather than queue up work the worker has not finished.
        if (awaitingFrame || !buffer) return;
        awaitingFrame = true;
        const outgoing = buffer;
        buffer = null;
        worker.postMessage({ type: "tick", dt, scroll, buffer: outgoing }, [outgoing]);
      } else if (fallbackSim && buffer) {
        const view = new Float32Array(buffer);
        fallbackSim.step(dt, scroll, view);
        drawFrame(view);
      }
    };

    frame = requestAnimationFrame(loop);

    const observer = new ResizeObserver(() => {
      measure();
      buildSprites();
      worker?.postMessage({ type: "resize", width, height });
      fallbackSim?.resize(width, height);
    });
    observer.observe(canvas);

    const themeObserver = new MutationObserver(() => buildSprites());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      themeObserver.disconnect();
      worker?.terminate();
    };
  }, [reduced, density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
