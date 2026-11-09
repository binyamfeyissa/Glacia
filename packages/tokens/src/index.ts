import tokensData from "./tokens.json" with { type: "json" };

export const tokens = tokensData;

export type Effect = "clear" | "regular" | "none";
export type Size = "sm" | "md" | "lg";
export type Variant = "filled" | "glass" | "ghost";
export type Radius = "sm" | "md" | "lg" | "xl" | "pill";

export interface GlassPropsBase {
  /**
   * The liquid glass material style:
   * - 'regular': Frosted, optimal contrast and readability (default)
   * - 'clear': High transparency for floating controls over moving backdrop
   * - 'none': Disables glass effect, renders fallback solid/tinted surface
   */
  effect?: Effect;
  /**
   * Custom tint color applied to the glass substrate.
   */
  tintColor?: string;
  /**
   * Whether the glass reacts to pointer/touch interactions (e.g., lens lighting).
   */
  interactive?: boolean;
  /**
   * Disabled state for controls.
   */
  disabled?: boolean;
}

export const radii = {
  sm: { px: "8px", number: 8 },
  md: { px: "14px", number: 14 },
  lg: { px: "20px", number: 20 },
  xl: { px: "28px", number: 28 },
  pill: { px: "9999px", number: 9999 },
} as const;

export const springs = {
  gentle: { stiffness: 170, damping: 26, mass: 1 },
  snappy: { stiffness: 300, damping: 28, mass: 1 },
  bouncy: { stiffness: 400, damping: 20, mass: 1 },
} as const;

export const colors = tokensData.colors;
