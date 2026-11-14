// React Native component resolution.
//
// The package never imports `react-native` or `react-native-svg` statically:
// both ship Flow-typed sources that a plain JS bundler (and the jsdom test
// environment) cannot parse. Resolving them at runtime keeps the package
// importable everywhere, matching how GlassView already locates the native
// liquid glass module.

declare const require: any;

/** Minimal shapes of the RN primitives the charts use. */
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
  /** React Native's ScrollView, or null when it is unavailable. */
  getScrollView: () => any;
  /** React Native's BackHandler, or null outside a native runtime. */
  getBackHandler: () => any;
}

/**
 * Resolves the primitives, falling back to pass-through DOM elements so the
 * package can be rendered in a non-native environment (tests, web preview)
 * without throwing.
 */
function resolve(): RNPrimitives {
  let View: any;
  let Text: any;
  let Pressable: any;
  let svg: any = null;
  let rn: any = null;

  try {
    rn = require("react-native");
    View = rn.View;
    Text = rn.Text;
    Pressable = rn.Pressable;
  } catch {
    // Non-native environment: render simple elements instead.
  }

  try {
    svg = require("react-native-svg");
  } catch {
    svg = null;
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
        accessibilityState,
        onPress,
        numberOfLines,
        onChangeText,
        value,
        editable,
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
        editable: _editable,
        ...rest
      } = props ?? {};
      const { createElement } = require("react");

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
        progressbar: "progressbar",
        tablist: "tablist",
        switch: "switch",
        slider: "slider",
        heading: "heading",
      };
      // "none" means presentational: emit no role rather than a misleading one.
      if (accessibilityRole && accessibilityRole !== "none") {
        domProps.role = ROLE_MAP[accessibilityRole] ?? "text";
      }

      if (accessibilityLabel != null) domProps["aria-label"] = accessibilityLabel;
      if (numberOfLines != null) domProps["data-lines"] = numberOfLines;
      if (nativeID != null) domProps.id = nativeID;

      if (accessibilityState) {
        const state = accessibilityState;
        if (state.checked !== undefined) domProps["aria-checked"] = state.checked;
        if (state.selected !== undefined) domProps["aria-selected"] = state.selected;
        if (state.expanded !== undefined) domProps["aria-expanded"] = state.expanded;
        if (state.disabled !== undefined) domProps["aria-disabled"] = state.disabled;
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

      if (onPress) {
        if (tag === "button" || tag === "input") domProps.onClick = onPress;
        else {
          // A non-button element needs to be operable from the keyboard too.
          domProps.onClick = onPress;
          if (domProps.role === "button" || domProps.role === "checkbox" || domProps.role === "radio") {
            domProps.tabIndex = 0;
          }
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
      const { children, visible, onRequestClose, ...rest } = props ?? {};
      if (!visible) return null;
      const { createElement } = require("react");
      return createElement(tag, { style: toDomStyle(rest.style) }, children);
    };

  /** An image that reads its remote source in the DOM preview. */
  function imageFallback(props: any) {
    const { source, accessibilityLabel, style } = props ?? {};
    const { createElement } = require("react");
    return createElement("img", {
      src: source?.uri,
      alt: accessibilityLabel ?? "",
      style: toDomStyle(style),
    });
  }

  const SvgComponent = svg?.default ?? fallback("svg");
  const SvgText = svg?.Text ?? fallback("text");

  return {
    View: View ?? fallback("div"),
    Text: Text ?? fallback("span"),
    Pressable: Pressable ?? fallback("button"),
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
    getScrollView: () => rn?.ScrollView ?? null,
    getBackHandler,
    SvgText,
  };
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
      merged[key] =
        typeof value === "number" && LENGTH_PROPS.has(key) ? `${value}px` : value;
    }
  }
  return merged;
}

let cache: RNPrimitives | null = null;

/** The resolved primitives, computed once per process. */
export function primitives(): RNPrimitives {
  if (!cache) cache = resolve();
  return cache;
}
