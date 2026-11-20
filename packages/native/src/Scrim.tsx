import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface ScrimProps {
  /** Which screen edge the scrim hugs — and therefore which way the blur ramps. Default `"bottom"`. */
  edge?: "top" | "bottom" | "left" | "right";
  /** Thickness of the scrim along its axis, dp. Default 160. */
  size?: number;
  /** Blur radius at the outer edge, dp. Default 24. */
  radius?: number;
  /**
   * Fraction of the scrim over which the ramp completes, measured from the
   * content side. Past it the blur holds at full `radius`. Default 0.7.
   */
  reach?: number;
  /** Optional wash over the blur — e.g. the bar surface colour at low alpha. */
  tint?: string;
  /** Android: which provider(s) to read. Same semantics as the glass view. */
  providerId?: string;
  /** Extra positioning/size overrides, applied after the edge placement. */
  style?: StyleProp<ViewStyle>;
  /** Content over the scrim — a tab bar, a toolbar. Laid out edge-aligned, untouched. */
  children?: ReactNode;
}

/**
 * A scroll-edge scrim — ported from the engine's `LiquidGlassScrim`, the design
 * Binyam approved on real devices this week (edge-hugging blur ramp).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved ramp. Without one — Expo Go, below every tier, or Reduce Transparency —
 * the fallback floor renders the same scrim with a solid wash, so content is
 * never lost behind an invisible scrim.
 */
export const Scrim = forwardRef<any, ScrimProps>(function Scrim(
  {
    edge = "bottom",
    size = 160,
    radius = 24,
    reach = 0.7,
    tint,
    providerId,
    style,
    children,
    ...props
  },
  ref,
) {
  const isDark = useIsDark();
  const themeColors = isDark ? colors.dark : colors.light;
  const { View } = primitives();
  const capabilities = glassCapabilities();
  const EngineScrim = loadEngineControl("Scrim");

  if (EngineScrim && capabilities.supported) {
    const EngineScrimComponent = EngineScrim;
    return (
      <EngineScrimComponent
        edge={edge}
        size={size}
        radius={radius}
        reach={reach}
        tint={tint}
        providerId={providerId}
        style={style}
      >
        {children}
      </EngineScrimComponent>
    );
  }

  // Fallback floor: solid scrim at the content edge, full geometry.
  const scrimStyle: ViewStyle = {
    position: "absolute",
    ...(edge === "top"
      ? { top: 0, left: 0, right: 0, height: size }
      : edge === "bottom"
        ? { bottom: 0, left: 0, right: 0, height: size }
        : edge === "left"
          ? { left: 0, top: 0, bottom: 0, width: size }
          : { right: 0, top: 0, bottom: 0, width: size }),
    backgroundColor: tint ?? themeColors.scrim,
    ...(style as ViewStyle),
  };
  return <View ref={ref} style={scrimStyle} {...(props as any)}>{children}</View>;
});
