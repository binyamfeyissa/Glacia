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
