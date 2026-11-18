// The specular press highlight, painted as a radial glow.
//
// The web material fades a 240px radial white highlight in under the finger
// for 220ms whenever a glass control is held. That is what makes a press feel
// like touching a lens rather than a flat sticker. The fallback had only an
// opacity dip, so controls never looked held.
//
// The glow lives inside the clipped material layer, so it follows the same
// radius as the surface and can never spill outside it.

import { useId } from "react";

import { useSpring } from "./motion";
import { primitives } from "./primitives";
import { material } from "./tokens";

const fill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

export interface SurfaceGlowProps {
  /** True while the surface is held. */
  active: boolean;
}

/**
 * A radial highlight that fades in while `active`.
 *
 * Motion uses the package's spring tokens and respects Reduce Motion: with the
 * preference on, the glow appears at its end state rather than fading.
 */
export function SurfaceGlow({ active }: SurfaceGlowProps) {
  const { Svg, Defs, RadialGradient, Stop, Rect, Animated } = primitives();
  const { value, animated } = useSpring(active ? 1 : 0, "snappy");
  const gradientId = `glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const painting = (
    <Svg width="100%" height="100%" style={fill} pointerEvents="none">
      <Defs>
        <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={material.rimColor} stopOpacity={material.glow} />
          <Stop offset="1" stopColor={material.rimColor} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );

  // Off-device there is no Animated API; the settled state is what a preview
  // should show, exactly as `useSpring` documents.
  if (!animated) {
    return (
      <Animated.View style={[fill, { opacity: active ? 1 : 0 }]} pointerEvents="none">
        {painting}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[fill, { opacity: value }]} pointerEvents="none">
      {painting}
    </Animated.View>
  );
}
