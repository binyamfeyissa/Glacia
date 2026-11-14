// React Native component resolution.
//
// The package never imports `react-native` or `react-native-svg` statically:
// both ship Flow-typed sources that a plain JS bundler (and the jsdom test
// environment) cannot parse. Resolving them at runtime keeps the package
// importable everywhere, matching how GlassView locates the native liquid
// glass module.
//
// Every component in the package builds its structure from these primitives.
// On a device the resolver returns React Native's own View/Text/Pressable/…
// and react-native-svg's elements. The DOM stand-ins further down exist only
// for the case where React Native is genuinely absent: a jsdom test run or a
// web preview. They are the single place in the package allowed to emit DOM
// host elements, and their whole job is translating React Native props into
// DOM ones.

declare const require: any;

/** Minimal shapes of the React Native primitives the package uses. */
export interface RNPrimitives {
  View: any;
  Text: any;
  Pressable: any;
  Svg: any;
  G: any;
  Line: any;
  Path: any;
  Circle: any;
  Rect: any;
  Polygon: any;
  SvgText: any;
  TextInput: any;
  Modal: any;
  Image: any;
  /** React Native's Animated API, or a no-op animation shim off-device. */
  Animated: any;
  /** React Native's Easing curves, used with Animated.spring. */
  Easing: any;
  /** React Native's ScrollView, or null when it is unavailable. */
  getScrollView: () => any;
  /** React Native's BackHandler, or null outside a native runtime. */
  getBackHandler: () => any;
  /** True when the returned primitives are React Native's own. */
  isNative: boolean;
  /** React Native's PanResponder, or a DOM stand-in off-device. */
  PanResponder: any;
  /** React Native's useColorScheme, or null outside a native runtime. */
  useColorScheme: (() => "light" | "dark" | null | undefined) | null;
}

/**
 * Resolves the primitives, falling back to pass-through DOM elements so the
 * package can be rendered in a non-native environment (tests, web preview)
 * without throwing.
 */
function resolve(): RNPrimitives {
  let rn: any = null;
  let svg: any = null;

  try {
    rn = require("react-native");
  } catch {
    // Non-native environment: the DOM stand-ins below take over.
  }

  try {
    svg = require("react-native-svg");
  } catch {
    svg = null;
  }

  // On a device the SVG elements are required: the DOM <svg> stand-ins would
  // crash in a real app ("View config not found"), so say so loudly instead of
  // silently degrading to something that cannot run.
  if (rn && !svg) {
    console.error(
      "[glacia-native] react-native-svg is required by the Glacia charts but could not be " +
        "resolved. Install it as a dependency of your app (npx expo install react-native-svg). " +
        "Charts will not render until it is available.",
    );
  }

  /**
   * Adapts React Native props to the DOM preview used when RN is absent.
   * Without this, `accessibilityRole` and `onPress` reach the DOM untranslated
   * and the element is neither reachable nor clickable in tests.
   */
  const fallback = (tag: string) =>
    function Primitive(props: any) {
      const {
        children,
        style,
        accessibilityRole,
        accessibilityLabel,
        accessible,
        accessibilityState,
        accessibilityValue,
        onPress,
        numberOfLines,
        onChangeText,
        value,
        editable: editableProp,
        nativeID,
        disabled,
        keyboardType: _keyboardType,
        returnKeyType: _returnKeyType,
        onSubmitEditing: _onSubmitEditing,
        secureTextEntry: _secureTextEntry,
        autoCapitalize: _autoCapitalize,
        autoCorrect: _autoCorrect,
        multiline,
        onFocus: _onFocus,
        onBlur: _onBlur,
        testID,
        // Gesture handlers from PanResponder.panHandlers are plain DOM events
        // off-device; let them reach the element so a drag is exercisable.
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
        onLayout: _onLayout,
        onAccessibilityAction,
        accessibilityActions: _accessibilityActions,
        ...rest
      } = props ?? {};
      const { createElement } = require("react");
      const editable = editableProp;

      // RN accepts unitless numbers where the DOM requires "px"; convert the
      // length properties so the preview lays out instead of throwing.
      const domProps: any = { style: toDomStyle(style), ...rest };

      // RN roles that already exist in ARIA pass straight through.
      const ROLE_MAP: Record<string, string> = {
        button: "button",
        checkbox: "checkbox",
        radio: "radio",
        radiogroup: "radiogroup",
        alert: "alert",
        text: "text",
        link: "link",
        image: "img",
        tab: "tab",
        tablist: "tablist",
        progressbar: "progressbar",
        switch: "switch",
        slider: "slider",
        adjustable: "slider",
        heading: "heading",
      };
      // "none" means presentational: emit no role rather than a misleading one.
      if (accessibilityRole && accessibilityRole !== "none") {
        domProps.role = ROLE_MAP[accessibilityRole] ?? "text";
      }

      if (accessibilityLabel != null) domProps["aria-label"] = accessibilityLabel;
      // RN's `accessible` groups children into one element; a role carries the
      // same meaning in the DOM, so it is dropped rather than emitted raw.
      if (accessible !== undefined && !domProps.role) domProps.role = "group";
      if (numberOfLines != null) domProps["data-lines"] = numberOfLines;
      if (nativeID != null) domProps.id = nativeID;
      if (testID != null) domProps["data-testid"] = testID;

      if (accessibilityState) {
        const state = accessibilityState;
        if (state.checked !== undefined) domProps["aria-checked"] = state.checked;
        if (state.selected !== undefined) domProps["aria-selected"] = state.selected;
        if (state.expanded !== undefined) domProps["aria-expanded"] = state.expanded;
        if (state.disabled !== undefined) domProps["aria-disabled"] = state.disabled;
      }

      if (accessibilityValue) {
        const value = accessibilityValue;
        if (value.min !== undefined) domProps["aria-valuemin"] = value.min;
        if (value.max !== undefined) domProps["aria-valuemax"] = value.max;
        if (value.now !== undefined) domProps["aria-valuenow"] = value.now;
        if (value.text !== undefined) domProps["aria-valuetext"] = value.text;
      }

      // Inputs: bridge the RN controlled-value contract to the DOM one.
      if (tag === "input") {
        // A multiline field must be a real textarea: an <input> cannot wrap.
        if (multiline) {
          tag = "textarea";
          if (typeof numberOfLines === "number") domProps.rows = numberOfLines;
        }
      }

      if (tag === "input" || tag === "textarea") {
        if (value != null) domProps.value = value;
        if (onChangeText) {
          domProps.onChange = (event: any) => onChangeText(event.target.value);
        }
        if (editable === false || disabled) domProps.disabled = true;
      }

      // Accessibility actions are React Native's; off-device they are exposed
      // as a handler so a test can drive them, matching the role translation.
      if (onAccessibilityAction) domProps.onAccessibilityAction = onAccessibilityAction;
      if (onMouseDown) domProps.onMouseDown = onMouseDown;
      if (onMouseMove) domProps.onMouseMove = onMouseMove;
      if (onMouseUp) domProps.onMouseUp = onMouseUp;
      if (onMouseLeave) domProps.onMouseLeave = onMouseLeave;

      if (onPress && !disabled) {
        // Any element hosting a press handler needs a DOM click to fire it.
        // A disabled control gets no handler at all, mirroring React Native's
        // Pressable, which swallows the press rather than calling it through.
        domProps.onClick = onPress;
        if (
          domProps.role === "button" ||
          domProps.role === "checkbox" ||
          domProps.role === "radio" ||
          domProps.role === "switch" ||
          domProps.role === "tab" ||
          domProps.role === "slider"
        ) {
          domProps.tabIndex = 0;
        }
      }
      if (disabled) domProps["aria-disabled"] = true;

      return createElement(tag, domProps, children);
    };

  /** Resolves React Native's BackHandler, or null off-device. */
  const getBackHandler = () => rn?.BackHandler ?? null;

  /**
   * A Modal that only mounts its children while visible.
   *
   * The generic fallback would render the content regardless of `visible`,
   * which would surface every closed dialog in the DOM preview.
   */
  const modalFallback = (tag: string) =>
    function Primitive(props: any) {
      const { children, visible, onRequestClose: _onRequestClose, ...rest } = props ?? {};
      if (!visible) return null;
      const { createElement } = require("react");
      return createElement(tag, { style: toDomStyle(rest.style) }, children);
    };

  /** An image that reads its remote source in the DOM preview. */
  function imageFallback(props: any) {
    const { source, accessibilityLabel, style, onError } = props ?? {};
    const { createElement } = require("react");
    return createElement("img", {
      src: source?.uri,
      alt: accessibilityLabel ?? "",
      style: toDomStyle(style),
      // A broken source must reach the component the same way it does on a
      // device, or a fallback (initials, placeholder) can never render.
      onError,
    });
  }

  const SvgComponent = svg?.default ?? fallback("svg");
  const SvgText = svg?.Text ?? fallback("text");

  return {
    View: rn?.View ?? fallback("div"),
    Text: rn?.Text ?? fallback("span"),
    Pressable: rn?.Pressable ?? fallback("button"),
    Svg: SvgComponent,
    G: svg?.G ?? fallback("g"),
    Line: svg?.Line ?? fallback("line"),
    Path: svg?.Path ?? fallback("path"),
    Circle: svg?.Circle ?? fallback("circle"),
    Rect: svg?.Rect ?? fallback("rect"),
    Polygon: svg?.Polygon ?? fallback("polygon"),
    // TextInput is not an SVG primitive, but resolving it here keeps every
    // component on one runtime-resolution path instead of two.
    TextInput: rn?.TextInput ?? fallback("input"),
    // Modal is resolved the same way so dialogs degrade to a plain overlay
    // outside a native runtime instead of failing to mount.
    Modal: rn?.Modal ?? modalFallback("div"),
    Image: rn?.Image ?? imageFallback,
    // Animated comes from the same module; off-device the shim below keeps
    // Animated.View/Value/spring from throwing in the DOM preview.
    Animated: rn?.Animated ?? animationShim(require("react")),
    Easing: rn?.Easing ?? easingShim(),
    getScrollView: () => rn?.ScrollView ?? null,
    getBackHandler,
    SvgText,
    isNative: Boolean(rn?.View),
    PanResponder: rn?.PanResponder ?? panResponderShim(),
    useColorScheme: rn?.useColorScheme ?? null,
  };
}

/**
 * A stand-in for React Native's Animated API off-device.
 *
 * `Animated.Value` keeps the value it was given and `spring` snaps to the
 * target immediately, so the preview renders the settled state instead of
 * animating against a requestAnimationFrame loop that jsdom does not drive.
 */
function animationShim(reactModule: any): any {
  class Value {
    private current: number;
    constructor(initial: number) {
      this.current = initial;
    }
    setValue(next: number) {
      this.current = next;
    }
    interpolate(config: any) {
      const input = config?.inputRange;
      const output = config?.outputRange;
      if (!input || !output || input.length !== output.length) return this.current;
      for (let i = 0; i < input.length - 1; i += 1) {
        if (this.current <= input[i + 1]) {
          const span = input[i + 1] - input[i] || 1;
          const ratio = (this.current - input[i]) / span;
          return output[i] + (output[i + 1] - output[i]) * ratio;
        }
      }
      return output[output.length - 1];
    }
  }

  function AnimatedView(props: any) {
    const { style, children, ...rest } = props ?? {};
    return reactModule.createElement(
      "div",
      { style: toDomStyle(resolveAnimatedStyle(style)), ...rest },
      children,
    );
  }

  return {
    Value,
    View: AnimatedView,
    Text: AnimatedView,
    spring: (value: any, config: any) => {
      value?.setValue?.(config?.toValue ?? 0);
      return { start: (callback?: any) => callback?.({ finished: true }), stop: () => {} };
    },
    timing: (value: any, config: any) => {
      value?.setValue?.(config?.toValue ?? 0);
      return { start: (callback?: any) => callback?.({ finished: true }), stop: () => {} };
    },
  };
}

/**
 * A stand-in for React Native's PanResponder off-device.
 *
 * It runs the handler hooks on DOM pointer events so a drag written against
 * PanResponder is still exercisable in the preview and in tests. On a device
 * the resolver returns React Native's own implementation.
 */
function panResponderShim(): any {
  return {
    create: (config: any) => {
      let granted = false;
      const start = (event: any) => {
        if (!config?.onStartShouldSetPanResponder?.(event, gesture(event))) return;
        granted = true;
        config?.onPanResponderGrant?.(event, gesture(event));
      };
      const move = (event: any) => {
        if (!granted) {
          if (!config?.onMoveShouldSetPanResponder?.(event, gesture(event))) return;
          granted = true;
          config?.onPanResponderGrant?.(event, gesture(event));
        }
        config?.onPanResponderMove?.(event, gesture(event));
      };
      const end = (event: any) => {
        if (!granted) return;
        granted = false;
        config?.onPanResponderRelease?.(event, gesture(event));
      };
      return {
        panHandlers: {
          onMouseDown: start,
          onMouseMove: move,
          onMouseUp: end,
        },
      };
    },
  };
}

/** Reads a touch position the way React Native's gesture object does. */
function gesture(event: any): any {
  const target = event?.currentTarget;
  const rect = target?.getBoundingClientRect?.();
  const x = event?.clientX ?? 0;
  const y = event?.clientY ?? 0;
  const locationX = rect ? x - rect.left : x;
  const locationY = rect ? y - rect.top : y;
  if (event && !event.nativeEvent) {
    event.nativeEvent = { locationX, locationY, pageX: x, pageY: y };
  }
  return { dx: 0, dy: 0, moveX: x, moveY: y, x0: x, y0: y, vx: 0, vy: 0 };
}

/** Stand-in for React Native's Easing curves. */
function easingShim(): any {
  const identity = (t: number) => t;
  return {
    out: (fn: (t: number) => number) => fn,
    inOut: (fn: (t: number) => number) => fn,
    linear: identity,
    ease: identity,
    quad: identity,
    bezier: () => identity,
  };
}

/** Reads a style value that may be an Animated.Value after the shim resolved it. */
function resolveAnimatedStyle(style: any): any {
  if (!style) return style;
  const list = Array.isArray(style) ? style : [style];
  const merged: Record<string, any> = {};
  for (const entry of list) {
    if (!entry) continue;
    Object.assign(merged, entry);
  }
  return merged;
}

const LENGTH_PROPS = new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "fontSize",
  "borderRadius",
  "gap",
]);

/** Converts an RN style object to DOM-compatible CSS. */
function toDomStyle(style: any): any {
  if (!style) return style;
  const list = Array.isArray(style) ? style : [style];
  const merged: Record<string, any> = {};

  for (const entry of list) {
    if (!entry) continue;
    for (const [key, value] of Object.entries(entry)) {
      if (value == null) continue;
      // Animated values resolve to plain numbers off-device.
      const resolved =
        typeof (value as any)?.interpolate === "function" ? (value as any).__getValue?.() : value;
      merged[key] =
        typeof resolved === "number" && LENGTH_PROPS.has(key) ? `${resolved}px` : resolved;
    }
  }
  return merged;
}

/**
 * Records an element's width for gesture maths when the environment has no
 * layout events (the DOM preview). A device never needs it: React Native
 * reports width through `onLayout`.
 */
export function measurePreviewWidth(node: any, widthRef: { current: number }) {
  if (!node || typeof node.getBoundingClientRect !== "function") return;
  const width = node.getBoundingClientRect().width;
  if (width > 0) widthRef.current = width;
}

let cache: RNPrimitives | null = null;

/** The resolved primitives, computed once per process. */
export function primitives(): RNPrimitives {
  if (!cache) cache = resolve();
  return cache;
}
