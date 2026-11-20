import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface SheetProps {
  /** Up while `true`; slides away when it turns `false`. */
  visible: boolean;
  /**
   * Called when the sheet wants to go — dragged down past 30 % of its height,
   * flung down, or the dim behind it tapped. The app flips `visible`; the sheet
   * never hides itself.
   */
  onDismiss?: () => void;
  /** The sheet's height, dp. Defaults to 420. */
  height?: number;
  /** Top corner radius, continuous. Defaults to 28. */
  cornerRadius?: number;
  /** Shows the grab handle. Defaults to `true`. */
  handle?: boolean;
  /** Opacity of the black dim behind the sheet at full height; `0` for none. Defaults to 0.25. */
  dim?: number;
  /** A tap on the dim dismisses. Defaults to `true`. */
  dismissOnTap?: boolean;
  /** Surface wash. */
  tint?: string;
  variant?: "regular" | "clear";
  /** The sheet frame — positioned absolutely at the bottom of its parent. */
  style?: StyleProp<ViewStyle>;
  /** The content view, under the handle. */
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isDark?: boolean;
  /** Passed to the sheet so it is testable. */
  testID?: string;
}

/**
 * A bottom sheet — ported from the engine's `LiquidGlassSheet`, the design
 * Binyam approved on real devices this week (28dp top corners, 36x5 grab handle,
 * dismissed past 30 % of its height or on a dim tap).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved material, handle and dismissal behaviour. Without one — Expo Go, below
 * every tier, or Reduce Transparency — the fallback floor renders the same panel
 * with a solid surface and the same dismissal affordances, so the sheet is never
 * invisible.
 */
export const Sheet = forwardRef<any, SheetProps>(function Sheet(
  {
    visible,
    onDismiss,
    height = 420,
    cornerRadius = 28,
    handle = true,
    dim = 0.25,
    dismissOnTap = true,
    tint,
    variant = "regular",
    style,
    contentStyle,
    children,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View } = primitives();
  const capabilities = glassCapabilities();
  const EngineSheet = loadEngineControl("Sheet");

  if (!visible) return null;

  if (EngineSheet && capabilities.supported) {
    const EngineSheetComponent = EngineSheet;
    return (
      <EngineSheetComponent
        visible={visible}
        onDismiss={onDismiss}
        height={height}
        cornerRadius={cornerRadius}
        handle={handle}
        dim={dim}
        dismissOnTap={dismissOnTap}
        tint={tint}
        variant={variant}
        style={style}
        contentStyle={contentStyle}
      >
        {children}
      </EngineSheetComponent>
    );
  }

  // Fallback floor: dim + solid panel at the bottom, same geometry.
  const panelStyle: ViewStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height,
    borderTopLeftRadius: cornerRadius,
    borderTopRightRadius: cornerRadius,
    overflow: "hidden",
    backgroundColor: tint ?? themeColors.surface,
    ...(style as ViewStyle),
  };
  return (
    <>
      {dim > 0 ? (
        <View
          testID={testID ? `${testID}-dim` : undefined}
          pointerEvents="box-none"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: themeColors.scrim }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => {
            if (dismissOnTap) onDismiss?.();
          }}
        />
      ) : null}
      <View style={panelStyle} testID={testID}>
        {handle ? (
          <View style={{ width: 36, height: 5, borderRadius: 2.5, alignSelf: "center", marginTop: 8 }} />
        ) : null}
        <View style={contentStyle}>{children}</View>
      </View>
    </>
  );
});
