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

export const colors = {
  light: {
    foreground: "#000000E0",
    muted: "#3C3C4399",
    glass: "rgba(255, 255, 255, 0.6)",
    glassActive: "rgba(236, 236, 240, 0.85)",
    edge: "rgba(0, 0, 0, 0.08)",
    fill: "#0088FF",
    destructive: "#FF3B30",
  },
  dark: {
    foreground: "#FFFFFF",
    muted: "#EBEBF599",
    glass: "rgba(40, 40, 40, 0.62)",
    glassActive: "rgba(70, 70, 70, 0.62)",
    edge: "rgba(255, 255, 255, 0.08)",
    fill: "#0091FF",
    destructive: "#FF4245",
  },
};
