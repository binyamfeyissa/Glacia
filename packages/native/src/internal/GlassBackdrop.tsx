import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { primitives } from "./primitives";
import { loadBackdropScope } from "./glass-routing";

export interface GlassBackdropProps {
  /**
   * The scroll view inside this subtree whose content the glass photographs in
   * content coordinates. Usually left out: the first scroll view found in the
   * subtree is the one tracked, which is what a list screen wants.
   */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  [prop: string]: any;
}

/**
 * A bounded backdrop scope for glass that sits over scrolling content.
 *
 * Inside a `GlassBackdrop`, glass photographs the scroll content in CONTENT
 * coordinates rather than photographing the window. A pane dragged over a list
 * then keeps refracting the right rows while it moves, instead of showing a
 * still frame of where the list used to be until the finger lifts.
 *
 * **iOS 16.4–25 with Metal only.** iOS 26+ uses Apple's own glass, which reads
 * the live window and needs no scope; Android has its own provider contract
 * and this component is a plain wrapper there; below the floor it is the
 * fallback surface and a plain wrapper here. On every platform it lays out its
 * children exactly once, so wrapping is free where it does nothing.
 *
 * The scope is a hint, not a guarantee. Sticky headers, parallax, nested
 * scrollers, video and async image loads do not fit the content-space model;
 * the renderer detects what it can and falls back to fresh window captures for
 * that scope rather than showing stale rows.
 */
export const GlassBackdrop = forwardRef<any, GlassBackdropProps>(
  function GlassBackdrop({ children, style, testID, ...props }, ref) {
    const { View } = primitives();

    const NativeView = loadBackdropScope();

    // No native scope (iOS 26+, Android, web, Expo Go): a wrapper that changes
    // nothing, so the same tree runs everywhere.
    if (!NativeView) {
      return (
        <View ref={ref} style={style} testID={testID} {...props}>
          {children}
        </View>
      );
    }

    return (
      <NativeView ref={ref} style={style} testID={testID} {...props}>
        {children}
      </NativeView>
    );
  },
);
