import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { defaultRouter } from "./internal/glass-routing";
import { primitives } from "./internal/primitives";

export interface GlassProviderProps {
  /**
   * The content whose backdrop the glass behind it samples. On Android this is
   * the single direct child of the provider — the one content child — and glass
   * views are its siblings, never its children.
   */
  children?: ReactNode;
  /** Layout style of the recording container, if any. */
  style?: StyleProp<ViewStyle>;
  /**
   * Pairs this provider with the glass views that read its backdrop. Defaults to
   * the engine's `"default"`.
   */
  providerId?: string;
  isDark?: boolean;
  /** Passed through to the underlying container so tests can find it. */
  testID?: string;
  [prop: string]: any;
}

/**
 * Marks the content that should show through the glass.
 *
 * The engine's provider records the backdrop for the glass views that read it.
 * On Android it is the backdrop source itself — content sits inside it as its
 * one direct child and glass views are its siblings, never inside it, so a glass
 * can never end up refracting its own output. On iOS and on platforms without a
 * glass renderer it renders a plain view, so it is safe to wrap unconditionally.
 *
 * On iOS the default is whole-window capture; the scoped `GlassBackdrop` provider
 * arrives with the strip-cache work (§6 of the rebuild brief).
 */
export const GlassProvider = forwardRef<any, GlassProviderProps>(function GlassProvider(
  { children, style, providerId, isDark, testID, ...props },
  ref,
) {
  const decision = defaultRouter();

  if (decision.supported && decision.LiquidGlassProvider) {
    const LiquidGlassProvider = decision.LiquidGlassProvider;
    return (
      <LiquidGlassProvider ref={ref} providerId={providerId} style={style} {...props}>
        {children}
      </LiquidGlassProvider>
    );
  }

  const { View } = primitives();
  return (
    <View ref={ref} testID={testID} style={style} {...props}>
      {children}
    </View>
  );
});
