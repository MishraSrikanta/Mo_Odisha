/// <reference lib="webworker" />

import { LetterFieldSim } from "@/lib/letterFieldSim";

/**
 * Thin worker shell around `LetterFieldSim`.
 *
 * The render buffer is transferred in both directions (ping-pong), so no
 * particle data is ever copied and the main thread does nothing but draw.
 */

type Incoming =
  | { type: "init"; width: number; height: number; count: number; glyphCount: number; seed: number }
  | { type: "resize"; width: number; height: number }
  | { type: "tick"; dt: number; scroll: number; buffer: ArrayBuffer };

let sim: LetterFieldSim | null = null;

self.onmessage = (event: MessageEvent<Incoming>) => {
  const message = event.data;

  if (message.type === "init") {
    sim = new LetterFieldSim(message);
    return;
  }

  if (message.type === "resize") {
    sim?.resize(message.width, message.height);
    return;
  }

  if (message.type === "tick") {
    if (sim) sim.step(message.dt, message.scroll, new Float32Array(message.buffer));
    (self as unknown as Worker).postMessage({ type: "frame", buffer: message.buffer }, [message.buffer]);
  }
};
