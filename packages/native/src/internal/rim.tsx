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

import { useId, useState } from "react";

import { primitives } from "./primitives";
import { material } from "./tokens";

const fill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

/**
 * The corner radius a surface actually shows, from the radius it was given
 * and the box it was laid out in. React Native clamps `borderRadius` to half
 * the shorter side; this is the same clamp, so the rim and the container
 * agree on one shape. A pill radius (9999) on a 350x34 field is 17, not 9999.
 */
export function effectiveGlassRadius(radius: number, width: number, height: number): number {
  return Math.min(radius, width / 2, height / 2);
}

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
 *
 * One shape, one radius. The container's corner is a true pill/semicircle:
 * React Native clamps `borderRadius` to half the shorter side. SVG does NOT
 * clamp that way — it clamps `rx` to half the WIDTH and `ry` to half the
 * HEIGHT independently — so a raw pill radius (9999) drew a wide flat ellipse
 * (rx ~ half the width) inside a pill container. That is the oval the owner
 * saw inside the search field. The rim measures the surface it paints and
 * uses the same effective radius the container shows — `min(radius, half the
 * shorter side)` — so the rim and the container share one shape. Measuring
 * here fixes every caller (the fallback glass, the tab-bar lens, the
 * segmented-control lens) because the rim is the only layer that drew its
 * shape in SVG. Before layout the raw radius is used (one frame); off-device
 * (tests, web preview) there is no layout, so the raw radius is used exactly
 * as before.
 */
export function GlassRim({ radius, rim, highlight }: GlassRimProps) {
  const { Svg, Defs, Rect, LinearGradient, Stop, View, isNative } = primitives();
  const key = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rimId = `rim-${key}`;
  const highlightId = `top-${key}`;
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const effective = size ? effectiveGlassRadius(radius, size.width, size.height) : radius;
  const rx = Math.max(0, effective - 0.5);

  const svg = (
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

  if (!isNative) return svg;
  return (
    <View
      style={fill}
      pointerEvents="none"
      onLayout={(event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setSize((prev) =>
          prev && prev.width === width && prev.height === height ? prev : { width, height },
        );
      }}
    >
      {svg}
    </View>
  );
}
