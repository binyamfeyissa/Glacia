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
        size={size}
      >
        {children}
      </EngineIconButtonComponent>
    );
  }

  // Fallback floor: solid circle, full geometry, on the fallback material.
  const radius = dimension / 2;
  return (
    <Glass
      effect="regular"
      surface="control"
      isDark={isDark}
      tintColor={tint}
      style={style}
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
        />
      </Pressable>
    </Glass>
  );
});
