/**
 * Particle simulation for the drifting background letters.
 *
 * Deliberately free of DOM and worker APIs so the exact same code runs inside
 * the Web Worker and, if worker construction is unavailable, on the main thread.
 *
 * Render buffer layout — `STRIDE` floats per particle:
 *   0 x   1 y   2 size   3 rotation   4 alpha   5 glyph index   6 glow   7 blur
 */

export const STRIDE = 8;

export type FieldOptions = {
  width: number;
  height: number;
  count: number;
  glyphCount: number;
  seed: number;
};

/** Deterministic PRNG — a reload reproduces the same field. */
function makeRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export class LetterFieldSim {
  private width: number;
  private height: number;
  private glyphCount: number;
  readonly count: number;

  private px: Float32Array;
  private py: Float32Array;
  private depth: Float32Array;
  private speed: Float32Array;
  private size: Float32Array;
  private rotation: Float32Array;
  private spin: Float32Array;
  private baseAlpha: Float32Array;
  private glyph: Float32Array;
  private glowPhase: Float32Array;
  private glowSpeed: Float32Array;
  private sway: Float32Array;
  private blur: Float32Array;

  private random: () => number;
  private elapsed = 0;

  constructor({ width, height, count, glyphCount, seed }: FieldOptions) {
    this.width = width;
    this.height = height;
    this.count = count;
    this.glyphCount = Math.max(1, glyphCount);
    this.random = makeRandom(seed);

    const array = () => new Float32Array(count);
    this.px = array();
    this.py = array();
    this.depth = array();
    this.speed = array();
    this.size = array();
    this.rotation = array();
    this.spin = array();
    this.baseAlpha = array();
    this.glyph = array();
    this.glowPhase = array();
    this.glowSpeed = array();
    this.sway = array();
    this.blur = array();

    for (let index = 0; index < count; index++) this.seed(index, false);
  }

  /** Depth drives everything: far letters are small, dim, slow and blurred. */
  private seed(index: number, fromTop: boolean) {
    const random = this.random;
    const d = random();

    this.depth[index] = d;
    this.px[index] = random() * this.width;
    this.py[index] = fromTop ? -random() * this.height * 0.3 : random() * this.height;
    this.speed[index] = 12 + d * 46;
    this.size[index] = 12 + d * 40;
    this.rotation[index] = random() * Math.PI * 2;
    this.spin[index] = (random() - 0.5) * 0.35;
    this.baseAlpha[index] = 0.08 + d * 0.34;
    this.glyph[index] = Math.floor(random() * this.glyphCount);
    this.glowPhase[index] = random() * Math.PI * 2;
    // Only a minority of letters ever catch the golden light.
    this.glowSpeed[index] = random() < 0.22 ? 0.25 + random() * 0.4 : 0;
    this.sway[index] = 6 + random() * 22;
    this.blur[index] = d < 0.35 ? 1 : 0;
  }

  resize(width: number, height: number) {
    const scaleX = this.width > 0 ? width / this.width : 1;
    this.width = width;
    this.height = height;
    for (let index = 0; index < this.count; index++) this.px[index] *= scaleX;
  }

  /** Advance by `dt` seconds and write the render buffer. */
  step(dt: number, scroll: number, view: Float32Array) {
    this.elapsed += dt;

    for (let index = 0; index < this.count; index++) {
      const d = this.depth[index];

      this.py[index] += this.speed[index] * dt;
      this.rotation[index] += this.spin[index] * dt;
      // Lateral drift, so nothing falls in a straight line.
      this.px[index] += Math.sin(this.elapsed * 0.35 + this.glowPhase[index]) * this.sway[index] * dt;

      // Parallax: nearer letters shift further as the page scrolls.
      const parallax = scroll * (0.12 + d * 0.5);

      if (this.py[index] - parallax > this.height + this.size[index]) {
        this.seed(index, true);
        this.py[index] = -this.size[index];
      }
      if (this.px[index] < -this.size[index]) this.px[index] = this.width + this.size[index];
      if (this.px[index] > this.width + this.size[index]) this.px[index] = -this.size[index];

      // A slow breath on every letter, plus a golden pulse on the chosen few.
      const breath = 0.75 + 0.25 * Math.sin(this.elapsed * 0.6 + this.glowPhase[index]);
      const glow =
        this.glowSpeed[index] > 0
          ? Math.max(0, Math.sin(this.elapsed * this.glowSpeed[index] + this.glowPhase[index]))
          : 0;

      const offset = index * STRIDE;
      view[offset] = this.px[index];
      view[offset + 1] = this.py[index] - parallax;
      view[offset + 2] = this.size[index];
      view[offset + 3] = this.rotation[index];
      view[offset + 4] = this.baseAlpha[index] * breath;
      view[offset + 5] = this.glyph[index];
      view[offset + 6] = glow;
      view[offset + 7] = this.blur[index];
    }
  }
}
