// The painted rim: light caught on the curved edge of a glass surface.
//
// This is the layer that makes a rounded corner *read* as rounded. The web
// engine paints a rim gradient into every glass element (brightest along the
// top edge, fading down the sides, nearly gone at the bottom), plus a soft
// highlight just inside the top. The fallback only had a uniform 8% edge line,
// which is why the owner described the corners as "not fully curved".
//
// Drawn in SVG because that is what the package already uses for its charts
// and share the same resolver: no new native dependency, and it works
// identically on iOS and Android.

import { useId } from "react";

import { primitives } from "./primitives";
import { material } from "./tokens";

const fill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

export interface GlassRimProps {
  /** The surface's corner radius, so the rim follows the shape. */
  radius: number;
  /** Alpha of the brightest (top) part of the rim. */
  rim: number;
  /** Alpha of the highlight inside the top edge. */
  highlight: number;
}

/**
 * The rim light and top highlight of one surface.
 *
 * Both are stacked stops of a vertical gradient in the same colour: the eye
 * reads the brightest edge as a lit curve and the falloff as the curve turning
 * away from the light.
 */
export function GlassRim({ radius, rim, highlight }: GlassRimProps) {
  const { Svg, Defs, Rect, LinearGradient, Stop } = primitives();
  const key = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rimId = `rim-${key}`;
  const highlightId = `top-${key}`;
  // SVG clamps rx/ry to half the side, so a pill radius simply becomes a pill.
  const rx = Math.max(0, radius - 0.5);

  return (
    <Svg width="100%" height="100%" style={fill} pointerEvents="none">
      <Defs>
        <LinearGradient id={rimId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={material.rimColor} stopOpacity={rim} />
          <Stop offset="0.55" stopColor={material.rimColor} stopOpacity={rim * 0.35} />
          <Stop offset="1" stopColor={material.rimColor} stopOpacity={rim * 0.08} />
        </LinearGradient>
        <LinearGradient id={highlightId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={material.rimColor} stopOpacity={highlight} />
          <Stop offset="1" stopColor={material.rimColor} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect
        x={0.5}
        y={0.5}
        width="99%"
        height="99%"
        rx={rx}
        ry={rx}
        fill="none"
        stroke={`url(#${rimId})`}
        strokeWidth={1}
      />
      <Rect
        x={1}
        y={1}
        width="98%"
        height="40%"
        rx={Math.max(0, rx - 1)}
        ry={Math.max(0, rx - 1)}
        fill={`url(#${highlightId})`}
      />
    </Svg>
  );
}
