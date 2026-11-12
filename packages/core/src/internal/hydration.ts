// One shared answer to "has React hydrated yet?" for the glass engine.
//
// The engine writes attributes (data-rim, data-refracting) and inline custom
// properties (--gl-rim, --gl-filter) straight onto React-owned nodes. React
// diffs those nodes against its own render output on every commit, so a write
// that lands before hydration finishes is reported as a hydration mismatch.
//
// Nothing here is about refractions looking right; it is only about timing, so
// it lives in its own module to keep auto-glass and refraction from importing
// each other in a cycle.

let pending = true;
const queue: Array<() => void> = [];

function release(): void {
  if (!pending) return;
  pending = false;
  for (const run of queue.splice(0)) run();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "complete") {
    // Nothing left to wait for, but still let React's first commit land.
    setTimeout(release, 0);
  } else {
    // `load` fires after React has finished hydrating the initial tree.
    window.addEventListener("load", () => setTimeout(release, 0), { once: true });
  }
}

/** True while React may still be hydrating the initial HTML. */
export function isHydrating(): boolean {
  return pending;
}

/**
 * Runs `effect` once hydration has finished, or immediately if it already has.
 * Every engine write that mutates a React-rendered node goes through this.
 */
export function onceHydrated(effect: () => void): void {
  if (pending) {
    queue.push(effect);
    return;
  }
  effect();
}
