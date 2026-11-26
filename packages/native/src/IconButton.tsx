import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface IconButtonProps {
  icon: ReactNode | ((state: any) => ReactNode);
  onPress?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  tint?: string;
  accessibilityLabel: string;
  accessibilityState?: Record<string, any>;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
  children?: ReactNode;
}

const SIZES = { sm: 32, md: 38, lg: 44 } as const;

/**
 * The glyph size a render-function icon is handed, per button size — the
 * engine's own small / regular / large icon sizes (18 / 22 / 24), so the
 * fallback hands a function the same size the engine does.
 */
const ICON_SIZES = { sm: 18, md: 22, lg: 24 } as const;

/**
 * The same names in the engine's vocabulary (`small` / `regular` / `large`).
 * The engine reads BUTTON_SIZES[size] with no fallback, so passing the
 * library's `sm` / `md` / `lg` straight through resolves to undefined and
 * throws the moment the engine mounts. The fallback never saw this because
 * the engine never mounted — 0.6.3 mounts it, so the map is load-bearing.
 */
const ENGINE_SIZE_NAMES = { sm: "small", md: "regular", lg: "large" } as const;

/**
 * An icon button on Glacia's glass — ported from the engine's
 * `LiquidGlassIconButton`, which extends the engine button's design with a
 * required accessibility label (a bare circle of glass has no text to read).
 */
export const IconButton = forwardRef<any, IconButtonProps>(function IconButton(
  {
    icon,
    onPress,
    disabled = false,
    size = "md",
    tint,
    accessibilityLabel,
    accessibilityState,
    style,
    isDark: isDarkProp,
    testID,
    children,
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { Pressable, View } = primitives();
  const capabilities = glassCapabilities();
  const EngineIconButton = loadEngineControl("IconButton");
  const dimension = SIZES[size];

  if (EngineIconButton && capabilities.supported) {
    const EngineIconButtonComponent = EngineIconButton;
    return (
      <EngineIconButtonComponent
        ref={ref}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        icon={icon}
        tint={tint}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled, ...accessibilityState }}
        style={style}
        size={ENGINE_SIZE_NAMES[size]}
      >
        {children}
      </EngineIconButtonComponent>
    );
  }

  // Fallback floor: solid circle, full geometry, on the fallback material.
  // The icon renders centred in the circle. A render function is handed the
  // same { color, size } the engine hands it — white on a tint, the scheme's
  // foreground otherwise, at the button's glyph size. A plain element renders
  // as given. (The circle used to be self-closing, so the icon never painted:
  // the solid blue circles with no glyphs.)
  // The shell is a circle, like the fill inside it: the Glass style carries
  // borderRadius = dimension/2, so the shell's corner arc and the fill's edge
  // are the same curve. Without it the shell defaulted to radii.md (14) — a
  // rounded square around a circle — and its corners stuck out past the fill
  // at the diagonals (the halo). A caller's own borderRadius still wins.
  const radius = dimension / 2;
  const iconColor = tint != null ? themeColors.onTint : themeColors.foreground;
  const iconNode =
    typeof icon === "function"
      ? icon({ color: iconColor, size: ICON_SIZES[size] })
      : icon;
  return (
    <Glass
      effect="regular"
      surface="control"
      isDark={isDark}
      tintColor={tint}
      style={[{ borderRadius: radius }, style]}
      testID={testID}
    >
      <Pressable
        ref={ref}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        style={style as ViewStyle}
      >
        <View
          style={{
            width: dimension,
            height: dimension,
            borderRadius: radius,
            backgroundColor: tint ?? themeColors.fill,
            opacity: disabled ? 0.38 : 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconNode}
        </View>
      </Pressable>
    </Glass>
  );
});
