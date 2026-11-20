import { forwardRef, useState } from "react";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { hapticSelection } from "./internal/haptics";
import { useIsDark } from "./internal/motion";

export interface ChipProps {
  label: string;
  icon?: ReactNode | ((state: any) => ReactNode);
  onPress?: () => void;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A filter or tag pill — ported from the engine's `LiquidGlassChip`, whose
 * selected state wears the accent as a wash with a white label.
 */
export const Chip = forwardRef<any, ChipProps>(function Chip(
  {
    label,
    icon,
    onPress,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    disabled = false,
    style,
    isDark: isDarkProp,
    testID,
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { Pressable, View, Text: RNText } = primitives();
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selected = selectedProp !== undefined ? selectedProp : internalSelected;
  const selectable = selectedProp !== undefined || onSelectedChange !== undefined || defaultSelected;
  const interactive = Boolean(onPress) || selectable;
  const capabilities = glassCapabilities();
  const EngineChip = loadEngineControl("Chip");

  const handlePress = () => {
    if (disabled) return;
    if (selectable) {
      const next = !selected;
      if (selectedProp === undefined) setInternalSelected(next);
      onSelectedChange?.(next);
    }
    onPress?.();
  };

  // A tag with no affordance and no selection is a static label, not a button.
  if (!interactive) {
    const height = 34;
    const radius = height / 2;
    return (
      <Glass
        effect="regular"
        surface="control"
        isDark={isDark}
        tintColor={selected ? themeColors.glassActive : undefined}
        interactive={false}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          height,
          paddingHorizontal: 12,
          borderRadius: radius,
          opacity: disabled ? 0.38 : 1,
          ...(style as ViewStyle),
        }}
        testID={testID}
      >
        {icon ? <View>{typeof icon === "function" ? null : icon}</View> : null}
        <RNText
          numberOfLines={1}
          style={{
            fontSize: 14,
            fontWeight: selected ? "600" : "500",
            color: selected ? themeColors.foreground : themeColors.muted,
          }}
        >
          {label}
        </RNText>
      </Glass>
    );
  }

  if (EngineChip && capabilities.supported) {
    const EngineChipComponent = EngineChip;
    return <EngineChipComponent label={label} icon={icon} selected={selected} onPress={disabled ? undefined : handlePress} disabled={disabled} accentColor={themeColors.info} tint={selected ? themeColors.glassActive : undefined} style={style} testID={testID} />;
  }

  // Fallback floor: solid pill, full geometry and states.
  const height = 34;
  const radius = height / 2;
  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : handlePress}
    >
      <View
        style={{
          height,
          borderRadius: radius,
          backgroundColor: selected ? themeColors.glassActive : "transparent",
          borderWidth: 0.5,
          borderColor: themeColors.edge,
          opacity: disabled ? 0.38 : 1,
          paddingHorizontal: 12,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 6,
        }}
      >
        {icon ? <View>{typeof icon === "function" ? null : icon}</View> : null}
        <RNText
          style={{
            fontSize: 14,
            fontWeight: selected ? "600" : "500",
            color: selected ? themeColors.foreground : themeColors.muted,
          }}
        >
          {label}
        </RNText>
      </View>
    </Pressable>
  );
});
