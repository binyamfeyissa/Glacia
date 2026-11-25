import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

/**
 * The web control scale the port keeps: 28 / 34 / 44, one horizontal padding and
 * one type size for every button — the engine's own sizing table is the design
 * source, and this is its Glacia-name translation.
 */
const ENGINE_BUTTON_SIZES = { sm: 28, md: 34, lg: 44 } as const;

/**
 * The same names in the engine's vocabulary (`small` / `regular` / `large`).
 * `Button` used to keep `size` to itself — it only set the capsule height —
 * so the engine always rendered the regular label and `size="sm"` could not
 * shrink a label into a narrow capsule (bank's 4-button row: "Request" needs
 * ~61pt of text at 17pt, so it truncated to "Reque…" inside its ~80pt capsule).
 */
const ENGINE_SIZE_NAMES = { sm: "small", md: "regular", lg: "large" } as const;

export interface ButtonProps {
  variant?: "glass" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  shape?: "capsule" | "circle";
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  interactive?: boolean;
  pressLight?: number;
  adaptive?: boolean;
  tint?: string;
  height?: number;
  icon?: ReactNode;
  accessibilityLabel: string;
  accessibilityState?: Record<string, any>;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isDark?: boolean;
  testID?: string;
  children?: ReactNode;
}

/**
 * A pressable button on Glacia's glass — ported from the engine's
 * `LiquidGlassButton` (expo-liquid-glass-ui), the design Binyam approved on real
 * devices this week.
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved design, geometry and press behaviour. Without one — Expo Go, below
 * every tier, or Reduce Transparency — the fallback floor renders the same
 * geometry with a solid surface, so the button is never invisible.
 */
export const Button = forwardRef<any, ButtonProps>(function Button(
  {
    variant = "glass",
    size = "md",
    shape = "capsule",
    disabled = false,
    loading = false,
    onPress,
    onLongPress,
    interactive = true,
    pressLight,
    adaptive = false,
    tint,
    height,
    icon,
    accessibilityLabel,
    accessibilityState,
    style,
    contentStyle,
    textStyle,
    isDark: isDarkProp,
    testID,
    children,
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { Pressable, View, Text: RNText } = primitives();
  const capabilities = glassCapabilities();
  const EngineButton = loadEngineControl("Button");
  const height_ = height ?? ENGINE_BUTTON_SIZES[size];

  // A ghost button wears no surface; the engine has no none-variant, so the
  // fallback floor renders the bare control.
  if (variant === "ghost") {
    return (
      <GhostButton
        ref={ref}
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        height={height_}
        isDark={isDark}
        testID={testID}
        onPress={onPress}
      >
        {children}
      </GhostButton>
    );
  }

  if (EngineButton && capabilities.supported) {
    const EngineButtonComponent = EngineButton;
    return (
      <EngineButtonComponent
        ref={ref}
        onPress={disabled || loading ? undefined : onPress}
        onLongPress={disabled || loading ? undefined : onLongPress}
        disabled={disabled || loading}
        loading={loading}
        interactive={interactive}
        pressLight={pressLight}
        adaptive={adaptive}
        tint={tint ?? (variant === "filled" ? themeColors.fill : undefined)}
        height={height_}
        size={ENGINE_SIZE_NAMES[size]}
        icon={icon}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled, ...accessibilityState }}
        style={style}
        // `size="sm"` has to fit a ~80pt capsule (bank's 4-button row): the
        // engine's small size alone (15pt label, 14pt/side padding) still needs
        // ~83pt for "Request" — measured 50.7pt at 14pt regular in run-8 shot 01,
        // scaled to 15pt semibold — so sm tightens the label to 14pt and the
        // side padding to 12pt here: ~76pt all-in, inside the capsule with room
        // to spare. The engine's own small table is untouched (chips use it
        // directly). Caller styles still win: they merge after these defaults.
        contentStyle={size === "sm" ? [{ paddingHorizontal: 12 }, contentStyle] : contentStyle}
        textStyle={size === "sm" ? [{ fontSize: 14 }, textStyle] : textStyle}
        variant={variant === "filled" ? "regular" : "regular"}
        shape={shape}
      >
        {children}
      </EngineButtonComponent>
    );
  }

  // Fallback floor: solid surface, full geometry and states.
  return (
    <FallbackButton
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      height={height_}
      isDark={isDark}
      testID={testID}
      variant={variant}
      tint={tint ?? themeColors.fill}
      onPress={onPress}
      style={style}
      contentStyle={contentStyle}
    >
      {children}
    </FallbackButton>
  );
});

export interface GhostButtonProps {
  ref?: any;
  accessibilityLabel: string;
  disabled?: boolean;
  height?: number;
  isDark?: boolean;
  testID?: string;
  onPress?: () => void;
  children?: ReactNode;
}

const GhostButton = forwardRef<any, GhostButtonProps>(function GhostButton(
  { accessibilityLabel, disabled = false, height = ENGINE_BUTTON_SIZES.md, isDark, testID, onPress, children },
  ref,
) {
  const { Pressable, View, Text: RNText } = primitives();
  const themeColors = isDark ? colors.dark : colors.light;
  const radius = height / 2;
  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
    >
      <View
        style={{
          height,
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.38 : 1,
        }}
      >
        <View style={{ height: height - 8, justifyContent: "center", alignItems: "center", flex: 1 }}>
          {typeof children === "string" ? (
            <RNText style={{ fontSize: 14, fontWeight: "400", color: themeColors.foreground }}>{children}</RNText>
          ) : (
            children
          )}
        </View>
      </View>
    </Pressable>
  );
});

export interface FallbackButtonProps {
  ref?: any;
  accessibilityLabel: string;
  disabled?: boolean;
  height?: number;
  isDark?: boolean;
  testID?: string;
  variant?: "glass" | "filled" | "ghost";
  tint?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const FallbackButton = forwardRef<any, FallbackButtonProps>(function FallbackButton(
  { accessibilityLabel, disabled = false, height = ENGINE_BUTTON_SIZES.md, isDark, testID, variant = "glass", tint, onPress, style, contentStyle, children },
  ref,
) {
  const themeColors = isDark ? colors.dark : colors.light;
  const { Pressable, View, Text: RNText } = primitives();
  const radius = height / 2;
  const solid = variant !== "ghost";
  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={style}
    >
      <View
        style={{
          height,
          borderRadius: radius,
          backgroundColor: solid ? tint ?? themeColors.fill : "transparent",
          opacity: disabled ? 0.38 : 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={[{ height: height - 8, justifyContent: "center", alignItems: "center", flex: 1 }, contentStyle]}>
          {typeof children === "string" ? (
            <RNText style={{ fontSize: 14, fontWeight: "400", color: themeColors.onTint }}>{children}</RNText>
          ) : (
            children
          )}
        </View>
      </View>
    </Pressable>
  );
});
