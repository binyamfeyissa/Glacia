// The glass switch — the law of this library.
//
// Every glass surface in every Glacia Native component goes through the package
// surface, which routes here. The decision now comes from the engine vendored
// into this package (`src/engine` — a copy of
// https://github.com/capthndsme/expo-liquid-glass-ui, MIT), not from an external
// `@callstack/liquid-glass` package: the rebuild patches the engine's iOS capture
// code, which a dependency could not receive.
//
// The decision is split out of the React component so both branches can be
// exercised in tests: `routerFor` takes the module as an argument, and the
// default export routes on whatever the vendored engine reports. On a device
// the argument is always the vendored engine module, so the routing logic is
// unchanged; only its source moved.

declare const require: any;

/**
 * The vendored engine's glass module, as the parts Glacia switches on.
 *
 * Mirrors the engine's public surface: the glass view, the merge container, the
 * backdrop provider, the stacked-glass primitive, and the capability flags the
 * renderer tier machinery fills in.
 */
export interface LiquidGlassModule {
  LiquidGlassView?: any;
  /**
   * The container that merges nearby glass elements into one connected
   * surface. The engine names it `LiquidGlassContainer`; the older bridge
   * package called it `LiquidGlassContainerView`. Both accepted.
   */
  LiquidGlassContainer?: any;
  LiquidGlassContainerView?: any;
  /**
   * Marks the content that should show through the glass (the Android backdrop
   * source). Present on the engine module; unused off the Android tier.
   */
  LiquidGlassProvider?: any;
  LiquidGlassStack?: any;
  /** The engine's mount gate: native (iOS 26+), Metal (iOS 16.4–25), AGSL (Android 13+). */
  supportsGlass?: boolean;
  /** Legacy spelling of the mount gate, from the older bridge package. */
  isLiquidGlassSupported?: boolean;
  /** Whether Apple's real `UIGlassEffect` is available (iOS 26+). */
  supportsNativeGlass?: boolean;
}

/** The routing decision for one glass surface. */
export interface GlassRouter {
  /** True when a glass renderer can render at all — native, Metal or AGSL. */
  supported: boolean;
  /** The engine's `LiquidGlassView`, or null when the fallback renders instead. */
  LiquidGlassView: any;
  /**
   * The engine's container that merges neighbouring glass, or null when the
   * fallback wrapper renders instead. Exposed under the historical field name so
   * the rest of the package keeps reading one decision.
   */
  LiquidGlassContainerView: any;
  /** The engine's backdrop provider, or null. */
  LiquidGlassProvider: any;
  /** The engine's stacked-glass primitive, or null. */
  LiquidGlassStack: any;
}

/**
 * Reads a liquid-glass module and decides which branch renders.
 *
 * A module only counts as supported when it exports the view *and* reports
 * support; a missing export falls back rather than crashing. Below every glass
 * tier the answer is `false`, which is what routes the surface to Glacia's
 * fallback floor.
 */
export function routerFor(module: LiquidGlassModule | null | undefined): GlassRouter {
  const view = module?.LiquidGlassView ?? null;
  const container = module?.LiquidGlassContainer ?? module?.LiquidGlassContainerView ?? null;
  const provider = module?.LiquidGlassProvider ?? null;
  const stack = module?.LiquidGlassStack ?? null;
  const supported =
    Boolean(module?.LiquidGlassView) &&
    (module?.supportsGlass ?? module?.isLiquidGlassSupported ?? false) === true;

  return {
    supported,
    LiquidGlassView: view,
    LiquidGlassContainerView: container,
    LiquidGlassProvider: provider,
    LiquidGlassStack: stack,
  };
}

/**
 * Loads the vendored glass engine.
 *
 * Resolved through `require` rather than a static import so the package stays
 * importable where the native module is absent (jsdom tests, web preview). The
 * engine's `supportsGlass` is a constant of the installed build — its iOS build
 * reads the native module and answers true only on iOS 26+, its Android build
 * answers for the AGSL tier — so loading it is how the verdict is learned.
 */
const ENGINE_MODULE_ID = "../engine";

function requireEngineModule(): any | null {
  const scope = globalThis as any;
  const req = typeof require === "function" ? require : scope.require;
  if (typeof req !== "function") return null;
  try {
    const module = req(ENGINE_MODULE_ID);
    return module ?? null;
  } catch {
    // The engine (or its native module) is not resolvable here: unsupported.
    return null;
  }
}

/** The installed engine's routing decision, computed once per process. */
export function defaultRouter(): GlassRouter {
  return routerFor(loadLiquidGlass());
}

/** The installed engine's glass module, or null when it cannot be loaded. */
export function loadLiquidGlass(): LiquidGlassModule | null {
  const module = requireEngineModule();
  if (module && (module.LiquidGlassView || module.supportsGlass !== undefined)) {
    return module as LiquidGlassModule;
  }
  return null;
}

/**
 * The capability verdicts Glacia switches on.
 */
export interface GlassCapabilities {
  /** Whether any glass renderer (Apple's native, the Metal renderer, AGSL) exists. */
  supported: boolean;
  /** Whether Apple's own `UIGlassEffect` exists — iOS 26+ only. */
  native: boolean;
}

/** Reads the capability verdicts from an explicit module, or from the engine. */
export function readCapabilities(module?: LiquidGlassModule | null): GlassCapabilities {
  const resolved = module !== undefined ? module : loadLiquidGlass();
  const supported = Boolean(resolved?.LiquidGlassView)
    ? (resolved?.supportsGlass ?? resolved?.isLiquidGlassSupported ?? false) === true
    : false;
  return { supported, native: resolved?.supportsNativeGlass === true };
}

/**
 * Whether any glass renderer is available on this device — the mount gate.
 *
 * Resolves instead of blocking: the caller renders either the glass surface or
 * the fallback floor from this, and the floor is the safe answer, so the check
 * must always be able to finish. When no renderer verdict has arrived the
 * absence *is* the verdict — unsupported — and the fallback floor renders.
 */
export function supportsGlass(module?: LiquidGlassModule | null): Promise<boolean> {
  const capabilities = readCapabilities(module);
  return Promise.resolve(capabilities.supported);
}

/**
 * Whether Apple's own glass material (`UIGlassEffect`) is available — iOS 26+.
 * The narrower question behind the mount gate; the renderer tier machinery picks
 * Metal or AGSL below that.
 */
export function supportsNativeGlass(module?: LiquidGlassModule | null): boolean {
  const resolved = module !== undefined ? module : loadLiquidGlass();
  return resolved?.supportsNativeGlass === true;
}
