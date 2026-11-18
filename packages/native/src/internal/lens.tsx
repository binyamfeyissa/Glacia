// The selected lens: one raised surface, without a second glass material.
//
// Every selected thing in the fallback — a list row, a menu option, a chosen
// weekday, the tab bar's indicator — is the web's "lens": the selected tint,
// lifted by a shadow, with the same painted rim as the surfaces around it.
//
// It cannot be a `Glass`. Glass inside a glass panel is glass-on-glass, which
// the material rules forbid, and the surfaces these sit in are already glass.
// So the lens is painted directly: tint, shadow, rim. Same look, no stacking.

import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, material, radii } from "./tokens";
import { primitives } from "./primitives";
import { GlassRim } from "./rim";

const fill = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 } as const;

/**
 * How far a lens sits above its row.
 *
 * Shallower than a panel's shadow: a lens is inside a surface that already
 * floats, so it needs contact, not altitude.
 */
export function lensShadow(isDark?: boolean): ViewStyle {
  return {
    shadowColor: material.shadowColor,
    shadowOpacity: isDark ? 0 : 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  } as ViewStyle;
}

/**
 * The rim of a lens, on its own.
 *
 * For indicators that are already animated views and cannot become a
 * `SelectedLens`: they keep their own transform, and this paints the light on
 * top of whatever tint they already have.
 */
export function LensRim({ radius, isDark }: { radius: number; isDark?: boolean }) {
  const { View } = primitives();
  const rim = (isDark ? material.rim.dark : material.rim.light) * 0.66;
  return (
    <View style={{ ...fill, overflow: "hidden", borderRadius: radius }} pointerEvents="none">
      <GlassRim radius={radius} rim={rim} highlight={material.highlight * 0.7} />
    </View>
  );
}

export interface SelectedLensProps {
  /** The lens shape. A circle is simply a radius of half the side. */
  radius: number;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  testID?: string;
}

/**
 * A selected state, drawn as the web's lens.
 *
 * Rendered as an absolutely positioned overlay so it never changes the layout
 * of the row it marks: parents keep their padding and press handling, and the
 * content paints above it by sibling order.
 */
export function SelectedLens({ radius, isDark, style, children, testID }: SelectedLensProps) {
  const { View } = primitives();
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View
      testID={testID}
      pointerEvents="none"
      style={[
        {
          borderRadius: radius,
          backgroundColor: theme.glassActive,
          ...lensShadow(isDark),
        },
        style as ViewStyle,
      ]}
    >
      {/* A tighter rim than a panel's: small surfaces catch less light. */}
      <LensRim radius={radius} isDark={isDark} />
      {children}
    </View>
  );
}

/** The lens overlay for a row: inset from the panel's edges, full width inside. */
export function rowLensStyle(radius: number, inset = 6): ViewStyle {
  return {
    position: "absolute",
    top: 2,
    bottom: 2,
    left: inset,
    right: inset,
    borderRadius: radius,
  };
}

/** A pill lens filling its own box, for indicators pinned to a control. */
export const lensFill = { ...fill, borderRadius: radii.pill } as const;
