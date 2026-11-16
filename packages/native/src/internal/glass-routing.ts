// The glass switch — the law of this library.
//
// Every glass surface in every Glacia Native component goes through
// `GlassView`, which routes here. On iOS 26+ `@callstack/liquid-glass` reports
// `isLiquidGlassSupported === true` and the surface is rendered by Apple's
// real `UIGlassEffect` (`LiquidGlassView`). Everywhere else — older iOS,
// Android, Expo Go, or a build without the module — it is Glacia's own
// translucent fallback of identical shape.
//
// The decision is split out from the React component so both branches can be
// exercised in tests: `routerFor` takes the module as an argument, and the
// default export routes on whatever is installed. On a device the argument is
// always the installed module, so the routing logic is unchanged.

declare const require: any;

export interface LiquidGlassModule {
  LiquidGlassView?: any;
  /**
   * The container that merges nearby glass elements into one connected
   * surface. Exported by `@callstack/liquid-glass` alongside the view.
   */
  LiquidGlassContainerView?: any;
  isLiquidGlassSupported?: boolean;
}

/** The routing decision for one glass surface. */
export interface GlassRouter {
  /** True when Apple's real glass renders this surface. */
  supported: boolean;
  /** Apple's `LiquidGlassView`, or null when the fallback renders instead. */
  LiquidGlassView: any;
  /**
   * Apple's `LiquidGlassContainerView` — the surface that merges neighbouring
   * glass — or null when the fallback wrapper renders instead.
   */
  LiquidGlassContainerView: any;
}

/**
 * Reads a liquid-glass module and decides which branch renders.
 *
 * A module only counts as supported when it exports the view *and* reports
 * support; a missing export falls back rather than crashing.
 */
export function routerFor(module: LiquidGlassModule | null | undefined): GlassRouter {
  const view = module?.LiquidGlassView ?? null;
  const container = module?.LiquidGlassContainerView ?? null;
  return {
    // A module that reports support but lacks the container still renders real
    // glass; the container is only needed by GlassContainer, which falls back
    // when it is missing.
    supported: Boolean(module?.isLiquidGlassSupported) && Boolean(view),
    LiquidGlassView: view,
    // The container merges only when the material itself is available; a
    // container without the view would have nothing to merge.
    LiquidGlassContainerView: container,
  };
}

/**
 * Loads `@callstack/liquid-glass` at runtime.
 *
 * Resolved through `require` rather than a static import so the package stays
 * importable where the native module is absent (jsdom tests, web preview).
 * `isLiquidGlassSupported` is a constant baked by the package's own platform
 * resolution: its iOS build reads the native module and answers true only on
 * iOS 26+; the default build answers false.
 */
export function loadLiquidGlass(): LiquidGlassModule | null {
  try {
    const module = require("@callstack/liquid-glass");
    if (module && (module.LiquidGlassView || module.isLiquidGlassSupported !== undefined)) {
      return module as LiquidGlassModule;
    }
    return null;
  } catch {
    return null;
  }
}

/** The installed module's routing decision, computed once per process. */
export function defaultRouter(): GlassRouter {
  return routerFor(loadLiquidGlass());
}
