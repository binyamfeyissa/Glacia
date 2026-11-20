// Wave 2 — Accordion.
//
// The donor's disclosure behaviour: one section open at a time unless `multiple`,
// a controlled list when `openSections` is passed, and headers that announce
// their expanded state. Dressed on the family's glass surface with the same
// hairlines and type steps as the rest of the library.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

export interface AccordionSection {
  /** Stable identity for the section. */
  value: string;
  title: string;
  /** Optional second line in the header. */
  description?: string;
  content: ReactNode;
}

export interface AccordionProps {
  sections: AccordionSection[];
  /** Allow several sections open at once. */
  multiple?: boolean;
  openSections?: string[];
  defaultOpenSections?: string[];
  onOpenSectionsChange?: (open: string[]) => void;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

export function Accordion({
  sections,
  multiple = false,
  openSections,
  defaultOpenSections,
  onOpenSectionsChange,
  style,
  isDark: isDarkProp,
  testID,
}: AccordionProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const [internal, setInternal] = useState<string[]>(defaultOpenSections ?? []);
  const open = openSections !== undefined ? openSections : internal;

  const toggle = (value: string) => {
    const isOpen = open.includes(value);
    let next: string[];
    if (multiple) {
      next = isOpen ? open.filter((entry) => entry !== value) : [...open, value];
    } else {
      next = isOpen ? [] : [value];
    }
    if (openSections === undefined) setInternal(next);
    onOpenSectionsChange?.(next);
  };

  return (
    <Glass
      effect="regular"
      surface="panel"
      isDark={isDark}
      testID={testID}
      style={[{ borderRadius: radii.lg, overflow: "hidden" }, style]}
    >
      {sections.map((section, index) => (
        <AccordionRow
          key={section.value}
          section={section}
          open={open.includes(section.value)}
          onPress={() => toggle(section.value)}
          first={index === 0}
          isDark={isDark}
          borderColor={theme.separator}
          foreground={theme.foreground}
          muted={theme.muted}
        />
      ))}
    </Glass>
  );
}

function AccordionRow({
  section,
  open,
  onPress,
  first,
  isDark,
  borderColor,
  foreground,
  muted,
}: {
  section: AccordionSection;
  open: boolean;
  onPress: () => void;
  first: boolean;
  isDark: boolean;
  borderColor: string;
  foreground: string;
  muted: string;
}) {
  const { View, Pressable, Text: RNText } = primitives();
  const { value: progress, animated } = useSpring(open ? 1 : 0, "snappy");
  const rotation = animated
    ? progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] })
    : open
      ? "90deg"
      : "0deg";

  return (
    <View
      style={
        first
          ? null
          : { borderTopWidth: 0.5, borderTopColor: borderColor }
      }
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={section.title}
        accessibilityState={{ expanded: open }}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <View style={{ flex: 1 }}>
          <RNText style={{ ...typeScale.body, fontWeight: "600", color: foreground }}>
            {section.title}
          </RNText>
          {section.description ? (
            <RNText style={{ ...typeScale.caption, color: muted, marginTop: 2 }}>
              {section.description}
            </RNText>
          ) : null}
        </View>
        <AnimatedChevron rotation={rotation} color={muted} />
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{section.content}</View>
      ) : null}
    </View>
  );
}

function AnimatedChevron({ rotation, color }: { rotation: any; color: string }) {
  const { Animated, Text: RNText } = primitives();
  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <RNText style={{ fontSize: 13, color }}>▸</RNText>
    </Animated.View>
  );
}
