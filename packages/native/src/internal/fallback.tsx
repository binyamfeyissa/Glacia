import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, material, radii } from "./tokens";
import { primitives } from "./primitives";
import { useReducedTransparency } from "./a11y";
import { blurProps, resolveBlurView } from "./blur";
import { SurfaceGlow } from "./glow";
import { isFlatProfile, materialFor, type SurfaceProfile } from "./material";
import { GlassRim } from "./rim";

export interface FallbackGlassProps {
  effect?: "clear" | "regular" | "none";
  /**
   * Which of the web's six lenses this surface is. The profile decides the
   * blur strength, rim brightness and top highlight, so a dialog and a badge
   * no longer share one flat recipe.
   */
  surface?: SurfaceProfile;
  tintColor?: string;
  /** True while the surface is held; fades the specular glow in. */
  pressed?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isDark?: boolean;
  /**
   * Force the solid treatment. Normally read from the system's Reduce
   * Transparency preference; this exists so a test can pin it.
   */
  reducedTransparency?: boolean;
}

const fill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

/** Layout and paint properties that belong to the surface itself. */
const HOISTED = new Set([
  "backgroundColor",
  "shadowColor",
  "shadowOpacity",
  "shadowRadius",
  "shadowOffset",
  "elevation",
]);

/** Merges a style prop into one object; a function style is not resolvable here. */
function flattenStyle(style: any): ViewStyle {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<ViewStyle>((acc, entry) => ({ ...acc, ...flattenStyle(entry) }), {});
  }
  if (typeof style === "function") return {};
  return style as ViewStyle;
}

/**
 * Glacia's own glass surface for every platform where Apple's material is not
 * available: Android, iOS before 26, and Expo Go.
 *
 * The material is the web one, rebuilt in layers, because a single flat View
 * could never read as glass:
 *
 * 1. backdrop blur (`expo-blur` / `@react-native-community/blur` when either
 *    is installed — a real `UIVisualEffectView` on iOS 17),
 * 2. the tint token on top of the blurred backdrop,
 * 3. a painted rim light, brightest on the top edge, so corners read as curved,
 * 4. a soft highlight just inside the top edge,
 * 5. the 0.5px edge line, and
 * 6. a drop shadow on the surface itself (outside the clipped layer).
 *
 * All of that lives in an absolutely-positioned, clipped layer behind the
 * children. The caller's style stays on the outer View, so heights, padding and
 * flex behaviour are byte-identical to the old flat implementation and
 * switching branches never shifts the layout.
 *
 * Reduce Transparency still replaces the whole thing with a solid colour: the
 * preference exists precisely to remove see-through surfaces.
 */
export const FallbackGlassView = forwardRef<any, FallbackGlassProps>(function FallbackGlassView(
  {
    effect = "regular",
    surface = "panel",
    tintColor,
    pressed,
    testID,
    style,
    children,
    isDark = false,
    reducedTransparency,
    ...props
  },
  ref,
) {
  const themeColors = isDark ? colors.dark : colors.light;
  const { View } = primitives();

  // Reduce Transparency means the translucent material is replaced by a solid
  // colour — the point of the preference is to remove see-through surfaces.
  const systemReduced = useReducedTransparency();
  const solid = reducedTransparency ?? systemReduced;

  const flat = flattenStyle(style);
  const radius = typeof flat.borderRadius === "number" ? flat.borderRadius : radii.md;
  const explicitBackground =
    typeof flat.backgroundColor === "string" ? flat.backgroundColor : undefined;

  // `effect="none"` is a deliberate "no surface here" (a ghost button); it
  // paints nothing at all, exactly as before.
  const bare = effect === "none";
  const layered = !solid && !bare;

  const profile = materialFor(surface, bare ? "regular" : effect, isDark);
  const blur = layered ? resolveBlurView() : null;

  const surfaceStyle: ViewStyle = { ...flat };
  for (const key of HOISTED) delete (surfaceStyle as any)[key];
  // The edge is the web's 0.5px inset line. A component that draws only one
  // edge (AppBar's scroll edge) keeps its own widths; a component that asked
  // for a 1px box border is brought back to the hairline.
  const perEdge = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"].some(
    (key) => typeof (flat as any)[key] === "number",
  );
  if (typeof flat.borderWidth === "number") {
    surfaceStyle.borderWidth = Math.min(flat.borderWidth, 0.5);
  } else if (!perEdge) {
    surfaceStyle.borderWidth = 0.5;
  }
  surfaceStyle.borderColor = flat.borderColor ?? themeColors.edge;
  surfaceStyle.borderRadius = radius;

  if (solid) {
    // The solid path is the old single flat view: opaque, no layers, and the
    // caller's own background (a filled button) still wins over the token.
    surfaceStyle.backgroundColor =
      flat.backgroundColor ??
      (effect === "clear" && tintColor ? tintColor : themeColors.glassSolid);
    surfaceStyle.overflow = "hidden";
  } else if (bare) {
    surfaceStyle.backgroundColor = flat.backgroundColor ?? "transparent";
    surfaceStyle.overflow = "hidden";
  } else {
    // Layered material. An opaque background is a filled control, not glass:
    // it still gets a rim so it does not read as a sticker, but no blur tint.
    const opaque = Boolean(explicitBackground);
    const tint = opaque
      ? explicitBackground
      : effect === "clear"
        ? isDark
          ? "rgba(28, 28, 30, 0.35)"
          : "rgba(255, 255, 255, 0.35)"
        : tintColor || themeColors.glass;

    const rim = opaque ? profile.rim * 0.5 : profile.rim;
    const highlight = opaque ? profile.highlight * 0.5 : profile.highlight;
    const blurrable = Boolean(blur) && !opaque;

    const shadowOpacity =
      typeof flat.shadowOpacity === "number" ? flat.shadowOpacity : profile.shadowOpacity;
    const shadowRadius =
      typeof flat.shadowRadius === "number" ? flat.shadowRadius : profile.shadowRadius;
    const shadowHeight =
      typeof flat.shadowOffset?.height === "number"
        ? flat.shadowOffset.height
        : profile.shadowOffsetY;
    // The hint family (badges, tooltips) sits flush with the page on the web.
    const lifts = !isFlatProfile(surface) && shadowOpacity > 0;

    return (
      <View
        ref={ref}
        testID={testID}
        style={[
          surfaceStyle,
          lifts
            ? {
                shadowColor: material.shadowColor,
                shadowOpacity,
                shadowRadius,
                shadowOffset: { width: 0, height: shadowHeight },
                elevation: typeof flat.elevation === "number" ? flat.elevation : profile.elevation,
              }
            : null,
        ]}
        {...props}
      >
        {/* The material layer carries a derived testID so a test can assert on
            the blur/tint/rim stack rather than on the outer layout box. */}
        <View
          testID={testID ? `${testID}-material` : undefined}
          style={[fill, { borderRadius: radius, overflow: "hidden" }]}
          pointerEvents="none"
        >
          {blurrable && blur ? (
            <blur.View
              {...blurProps(blur.kind, profile.blur, isDark)}
              style={[fill, { borderRadius: radius }]}
            />
          ) : null}
          <View
            testID={testID ? `${testID}-tint` : undefined}
            style={[fill, { backgroundColor: tint }]}
          />
          <GlassRim radius={radius} rim={rim} highlight={highlight} />
          {pressed !== undefined ? <SurfaceGlow active={pressed} /> : null}
        </View>
        {children}
      </View>
    );
  }

  return (
    <View ref={ref} testID={testID} style={surfaceStyle} {...props}>
      {children}
    </View>
  );
});
