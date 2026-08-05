"use client";

import { useCallback, useEffect, useRef } from "react";
import { CURTAIN_GLYPHS } from "@/lib/odia";
import { clamp } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A curtain woven from Odia letters, simulated as cloth.
 *
 * Why Canvas 2D rather than WebGL: the glyphs must be rendered by the system's
 * Odia font (there is no reliable way to ship a shaped Odia atlas to every
 * browser), so we rasterise each letter once into a sprite and then blit it.
 * That turns thousands of `fillText` calls into thousands of `drawImage` calls,
 * which the compositor handles on the GPU and which stays at 60 fps on mid-range
 * hardware — with none of the font-shaping problems a WebGL text path brings.
 *
 * The simulation is a mass-spring lattice:
 *   • every node is tethered to its rest position (the curtain hangs straight),
 *   • structural springs to the right and lower neighbours propagate ripples,
 *   • the top row is pinned, as if to a rod,
 *   • velocity is damped each step, which gives inertia that settles naturally.
 *
 * Pointer forces are applied as accelerations rather than position writes, so
 * the cloth never snaps — it accelerates, overshoots, and oscillates back.
 */

type Pointer = {
  x: number;
  y: number;
  px: number;
  py: number;
  active: boolean;
  dragging: boolean;
};

/** Above this many nodes we widen the spacing instead — keeps the step cheap. */
const MAX_NODES = 3000;

const PHYSICS = {
  /** Fixed timestep. Decoupling from rAF keeps the feel identical at 60 and 144 Hz. */
  step: 1 / 60,
  maxSubSteps: 3,
  /** Tether to rest position. */
  anchor: 26,
  /** Structural spring between neighbours — this is what carries the ripple. */
  link: 46,
  damping: 3.4,
  pointerRadius: 170,
  pointerForce: 2600,
  dragForce: 26,
  clickRadius: 340,
  clickImpulse: 620,
  /** Ambient breeze so the curtain is never completely still. */
  windAmplitude: 13,
  windSpeed: 0.42,
  maxDisplacement: 90,
};

export function OdiaCurtain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<Pointer>({ x: -9999, y: -9999, px: -9999, py: -9999, active: false, dragging: false });
  const reduced = usePrefersReducedMotion();

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointer = pointerRef.current;
    pointer.px = pointer.active ? pointer.x : event.clientX - rect.left;
    pointer.py = pointer.active ? pointer.y : event.clientY - rect.top;
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false;
    pointerRef.current.dragging = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let spacing = 0;
    let count = 0;
    let dpr = 1;

    // Node state kept in flat typed arrays — no per-node object allocation.
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let restX = new Float32Array(0);
    let restY = new Float32Array(0);
    let glyph = new Uint8Array(0);
    let phase = new Float32Array(0);

    /** Pre-rasterised glyphs: [calm, glowing] for every letter in the set. */
    let spritesCalm: HTMLCanvasElement[] = [];
    let spritesGlow: HTMLCanvasElement[] = [];
    let spriteSize = 0;

    const readInk = () => {
      const styles = getComputedStyle(document.documentElement);
      const light = styles.getPropertyValue("color-scheme").includes("light");
      return {
        calm: light ? "rgba(90, 74, 58, 0.55)" : "rgba(226, 214, 196, 0.42)",
        glow: light ? "rgba(176, 106, 59, 0.95)" : "rgba(245, 214, 122, 0.95)",
        halo: light ? "rgba(232, 179, 61, 0.5)" : "rgba(232, 179, 61, 0.85)",
      };
    };

    const buildSprites = () => {
      const ink = readInk();
      spriteSize = Math.ceil(spacing * 1.6 * dpr);
      const fontSize = Math.round(spacing * 0.86 * dpr);
      const font = `${fontSize}px var(--font-odia), "Noto Sans Oriya", "Kalinga", sans-serif`;

      const render = (character: string, color: string, glowColor?: string) => {
        const sprite = document.createElement("canvas");
        sprite.width = spriteSize;
        sprite.height = spriteSize;
        const spriteContext = sprite.getContext("2d")!;
        spriteContext.font = font;
        spriteContext.textAlign = "center";
        spriteContext.textBaseline = "middle";
        if (glowColor) {
          spriteContext.shadowColor = glowColor;
          spriteContext.shadowBlur = fontSize * 0.55;
        }
        spriteContext.fillStyle = color;
        spriteContext.fillText(character, spriteSize / 2, spriteSize / 2);
        return sprite;
      };

      spritesCalm = CURTAIN_GLYPHS.map((character) => render(character, ink.calm));
      spritesGlow = CURTAIN_GLYPHS.map((character) => render(character, ink.glow, ink.halo));
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Denser weave on large screens, coarser on phones — then widen the
      // spacing until the node count fits the budget.
      spacing = width < 640 ? 34 : width < 1280 ? 38 : 42;
      do {
        cols = Math.ceil(width / spacing) + 1;
        rows = Math.ceil(height / spacing) + 1;
        if (cols * rows <= MAX_NODES) break;
        spacing += 2;
      } while (spacing < 90);

      count = cols * rows;
      x = new Float32Array(count);
      y = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      restX = new Float32Array(count);
      restY = new Float32Array(count);
      glyph = new Uint8Array(count);
      phase = new Float32Array(count);

      const offsetX = (width - (cols - 1) * spacing) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          // A shallow catenary drape: the middle of each row hangs lower.
          const drape = Math.sin((col / Math.max(1, cols - 1)) * Math.PI) * spacing * 0.28;
          restX[index] = offsetX + col * spacing;
          restY[index] = row * spacing + drape;
          x[index] = restX[index];
          y[index] = restY[index];
          // Walk the varnamala across the grid so the curtain reads as a chart.
          glyph[index] = (row * 7 + col) % CURTAIN_GLYPHS.length;
          phase[index] = (col * 0.6 + row * 0.35) % (Math.PI * 2);
        }
      }

      buildSprites();
    };

    const applyPointer = () => {
      const pointer = pointerRef.current;
      if (!pointer.active) return;

      const radius = PHYSICS.pointerRadius;
      const radiusSq = radius * radius;
      const dragX = pointer.x - pointer.px;
      const dragY = pointer.y - pointer.py;

      // Only walk the rows and columns the pointer can actually reach.
      const minCol = clamp(Math.floor((pointer.x - radius) / spacing) - 1, 0, cols - 1);
      const maxCol = clamp(Math.ceil((pointer.x + radius) / spacing) + 1, 0, cols - 1);
      const minRow = clamp(Math.floor((pointer.y - radius) / spacing) - 1, 0, rows - 1);
      const maxRow = clamp(Math.ceil((pointer.y + radius) / spacing) + 1, 0, rows - 1);

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const index = row * cols + col;
          const dx = x[index] - pointer.x;
          const dy = y[index] - pointer.y;
          const distanceSq = dx * dx + dy * dy;
          if (distanceSq > radiusSq) continue;

          const distance = Math.sqrt(distanceSq) || 0.0001;
          const falloff = 1 - distance / radius;
          const push = (falloff * falloff * PHYSICS.pointerForce) / distance;

          vx[index] += dx * push * PHYSICS.step;
          vy[index] += dy * push * PHYSICS.step;

          // Dragging drags the cloth along with the cursor — the stretch.
          vx[index] += dragX * falloff * PHYSICS.dragForce * PHYSICS.step;
          vy[index] += dragY * falloff * PHYSICS.dragForce * PHYSICS.step;
        }
      }
    };

    const ripple = (originX: number, originY: number, strength: number) => {
      const radius = PHYSICS.clickRadius;
      const radiusSq = radius * radius;
      for (let index = 0; index < count; index++) {
        const dx = x[index] - originX;
        const dy = y[index] - originY;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq > radiusSq) continue;
        const distance = Math.sqrt(distanceSq) || 0.0001;
        const falloff = 1 - distance / radius;
        const impulse = (falloff * falloff * strength) / distance;
        vx[index] += dx * impulse;
        vy[index] += dy * impulse;
      }
    };

    const simulate = (dt: number, time: number) => {
      const { anchor, link, damping, windAmplitude, windSpeed, maxDisplacement } = PHYSICS;

      // Structural springs. Each node pulls on its right and lower neighbour,
      // which is what turns a local poke into a travelling wave.
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;

          if (col + 1 < cols) {
            const other = index + 1;
            const dx = x[other] - x[index];
            const dy = y[other] - y[index];
            const distance = Math.hypot(dx, dy) || 0.0001;
            const force = ((distance - spacing) * link) / distance;
            const fx = dx * force * dt;
            const fy = dy * force * dt;
            vx[index] += fx;
            vy[index] += fy;
            vx[other] -= fx;
            vy[other] -= fy;
          }

          if (row + 1 < rows) {
            const other = index + cols;
            const dx = x[other] - x[index];
            const dy = y[other] - y[index];
            const distance = Math.hypot(dx, dy) || 0.0001;
            const force = ((distance - spacing) * link) / distance;
            const fx = dx * force * dt;
            const fy = dy * force * dt;
            vx[index] += fx;
            vy[index] += fy;
            vx[other] -= fx;
            vy[other] -= fy;
          }
        }
      }

      for (let index = 0; index < count; index++) {
        // The top row is pinned to the rod.
        if (index < cols) {
          x[index] = restX[index];
          y[index] = restY[index];
          vx[index] = 0;
          vy[index] = 0;
          continue;
        }

        const breeze = Math.sin(time * windSpeed + phase[index]) * windAmplitude;
        const targetX = restX[index] + breeze;
        const targetY = restY[index] + Math.cos(time * windSpeed * 0.7 + phase[index]) * windAmplitude * 0.28;

        vx[index] += (targetX - x[index]) * anchor * dt;
        vy[index] += (targetY - y[index]) * anchor * dt;

        const decay = Math.exp(-damping * dt);
        vx[index] *= decay;
        vy[index] *= decay;

        x[index] += vx[index] * dt;
        y[index] += vy[index] * dt;

        // Hard clamp so an aggressive drag can never tear the weave apart.
        const dx = x[index] - restX[index];
        const dy = y[index] - restY[index];
        const displacement = Math.hypot(dx, dy);
        if (displacement > maxDisplacement) {
          const scale = maxDisplacement / displacement;
          x[index] = restX[index] + dx * scale;
          y[index] = restY[index] + dy * scale;
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const half = spriteSize / (2 * dpr);
      const drawSize = spriteSize / dpr;
      let currentAlpha = -1;

      for (let index = 0; index < count; index++) {
        const dx = x[index] - restX[index];
        const dy = y[index] - restY[index];
        const displacement = Math.hypot(dx, dy);
        const excitement = Math.min(displacement / 46, 1);

        // Quantise alpha so long runs of neighbouring letters share one
        // canvas state change instead of one each.
        const alpha = Math.round((0.34 + excitement * 0.62) * 20) / 20;
        if (alpha !== currentAlpha) {
          context.globalAlpha = alpha;
          currentAlpha = alpha;
        }

        const sprite = excitement > 0.35 ? spritesGlow[glyph[index]] : spritesCalm[glyph[index]];
        context.drawImage(sprite, x[index] - half, y[index] - half, drawSize, drawSize);
      }

      context.globalAlpha = 1;
    };

    layout();

    if (reduced) {
      // No simulation loop at all — render the resting weave once.
      draw();
      const observer = new ResizeObserver(() => {
        layout();
        draw();
      });
      observer.observe(canvas);
      return () => observer.disconnect();
    }

    let frame = 0;
    let last = performance.now();
    let accumulator = 0;
    let elapsed = 0;
    let visible = true;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible) {
        last = now;
        return;
      }

      // Cap the delta so a backgrounded tab does not resume with a huge step.
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      accumulator += delta;

      let steps = 0;
      while (accumulator >= PHYSICS.step && steps < PHYSICS.maxSubSteps) {
        elapsed += PHYSICS.step;
        applyPointer();
        simulate(PHYSICS.step, elapsed);
        accumulator -= PHYSICS.step;
        steps += 1;
      }
      if (steps === PHYSICS.maxSubSteps) accumulator = 0;

      const pointer = pointerRef.current;
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      draw();
    };

    frame = requestAnimationFrame(loop);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.dragging = true;
      ripple(event.clientX - rect.left, event.clientY - rect.top, PHYSICS.clickImpulse);
    };
    const onPointerUp = () => {
      pointerRef.current.dragging = false;
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    const observer = new ResizeObserver(() => layout());
    observer.observe(canvas);

    // Re-rasterise the glyph sprites when the colour theme flips.
    const themeObserver = new MutationObserver(() => buildSprites());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
      style={{ touchAction: "pan-y" }}
    />
  );
}
