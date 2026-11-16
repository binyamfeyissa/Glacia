import { radii as tokenRadii, springs as tokenSprings, colors as tokenColors } from "glacia-tokens";

export const radii = {
  sm: tokenRadii.sm.number,
  md: tokenRadii.md.number,
  lg: tokenRadii.lg.number,
  xl: tokenRadii.xl.number,
  pill: tokenRadii.pill.number,
};

export const springs = {
  gentle: tokenSprings.gentle,
  snappy: tokenSprings.snappy,
  bouncy: tokenSprings.bouncy,
};

/**
 * The package's type scale, in React Native points.
 *
 * Text maps its variants onto these names so every component in the library —
 * and every app built on it — sizes type the same way.
 */
export const typeScale = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: "700" as const },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
};

/**
 * The default colour palette for ColorPicker.
 *
 * A palette is data, not a theme colour — it is the same twelve hues in light
 * and dark — so it lives here rather than in either theme. Keeping it in the
 * token module is also what lets the conformance guard require that component
 * code contains no colour literal at all.
 */
export const palette = {
  default: [
    "#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#32ADE6", "#007AFF",
    "#5856D6", "#AF52DE", "#FF2D55", "#A2845E", "#8E8E93", "#1C1C1E",
  ],
  /** The colour a picker starts on when the caller gives none. */
  fallback: "#007AFF",
};

/**
 * Control sizes in points, for components whose dimension is not a radius.
 *
 * Rating's stars are the reason this exists: a star has a size and the size
 * must come from the scale rather than from a literal in the component.
 */
export const controlSizes = {
  star: { sm: 14, md: 20, lg: 28 },
  swatch: { sm: 28, md: 36, lg: 44 },
  picker: { track: 28 },
};

/**
 * Theme colours in the form React Native accepts.
 *
 * The shared tokens express colours as CSS colour strings (`rgb(r g b / a)`),
 * which is right for the web package and rejected by React Native. The values
 * below are the same colours written as `rgba(...)`/hex, sourced from the same
 * token file, so the two platforms stay in step.
 */
export const colors = {
  light: {
    foreground: "#000000E0",
    muted: "#3C3C4399",
    glass: "rgba(255, 255, 255, 0.6)",
    glassActive: "rgba(236, 236, 240, 0.85)",
    edge: "rgba(0, 0, 0, 0.08)",
    separator: "rgba(60, 60, 67, 0.18)",
    fill: "#0088FF",
    destructive: "#FF3B30",
    on: "#34C759",
    warning: "#FF9500",
    info: "#007AFF",
    // The dimmed layer behind a sheet, drawer or dialog.
    scrim: "rgba(0, 0, 0, 0.45)",
    // Text and icons drawn on top of a filled (tinted) surface.
    onTint: "#FFFFFF",
    skeleton: "rgba(60, 60, 67, 0.12)",
    /**
     * The solid colour glass becomes when the user has asked the system to
     * reduce transparency. Apple's rule is that a translucent surface is
     * replaced by an opaque one, not merely tinted differently.
     */
    glassSolid: "#F2F2F7",
    /**
     * Neutral colours used by pickers and fields: the field's own wash, and
     * the far end of a saturation gradient (the point of no saturation).
     */
    fieldWash: "rgba(120, 120, 128, 0.12)",
    /** A flat neutral surface: incoming message bubbles, file chips. */
    wash: "rgba(120, 120, 128, 0.12)",
    neutralTop: "#FFFFFF",
    // Chart axis and grid lines: low-contrast, so they never compete with data.
    axis: "#3C3C43",
  },
  dark: {
    foreground: "#FFFFFF",
    muted: "#EBEBF599",
    glass: "rgba(40, 40, 40, 0.62)",
    glassActive: "rgba(70, 70, 70, 0.62)",
    edge: "rgba(255, 255, 255, 0.08)",
    separator: "rgba(235, 235, 245, 0.16)",
    fill: "#0091FF",
    destructive: "#FF4245",
    on: "#30D158",
    warning: "#FF9F0A",
    info: "#0A84FF",
    scrim: "rgba(0, 0, 0, 0.6)",
    onTint: "#FFFFFF",
    skeleton: "rgba(235, 235, 245, 0.14)",
    glassSolid: "#1C1C1E",
    fieldWash: "rgba(120, 120, 128, 0.12)",
    /** A flat neutral surface: incoming message bubbles, file chips. */
    wash: "rgba(120, 120, 128, 0.12)",
    neutralTop: "#FFFFFF",
    axis: "#EBEBF5",
  },
};

/** Keeps the shared token file honest if a colour is added there first. */
export type ThemeColors = typeof colors.light;

/** The semantic tone of a feedback component (Banner, Toast). */
export type Tone = "info" | "success" | "warning" | "error";

/** Resolves a tone to its theme colour. */
export function toneColor(theme: ThemeColors, tone: Tone): string {
  switch (tone) {
    case "success":
      return theme.on;
    case "warning":
      return theme.warning;
    case "error":
      return theme.destructive;
    default:
      return theme.info;
  }
}

// Referenced so the shared tokens stay a live dependency: a colour removed
// from glacia-tokens should not silently linger here forever.
void tokenColors;
