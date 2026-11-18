import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Button } from "./Button";
import { Text } from "./Text";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

// ---------------------------------------------------------------------------
// SearchBar

export interface SearchBarProps {
  /** Controlled text. Omit and the bar keeps its own. */
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  /** Shows a cancel button beside the field while it holds text or focus. */
  showCancel?: boolean;
  onCancel?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A search field for a bar or a screen header.
 *
 * Distinct from NativeAIInput: that is an AI composer with send semantics, this
 * is ordinary app search — magnifier, themed placeholder, and a clear button
 * once there is something to clear.
 */
export const SearchBar = forwardRef<any, SearchBarProps>(function SearchBar(
  {
    value: valueProp,
    defaultValue = "",
    onChangeText,
    onSubmit,
    placeholder = "Search",
    showCancel = false,
    onCancel,
    accessibilityLabel = "Search",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, TextInput, Pressable } = primitives();

  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;

  const handleChange = (next: string) => {
    if (valueProp === undefined) setInternal(next);
    onChangeText?.(next);
  };

  const clear = () => handleChange("");

  return (
    <View
      ref={ref}
      testID={testID}
      style={[{ flexDirection: "row", alignItems: "center", gap: 8 }, style as ViewStyle]}
      {...props}
    >
      <Glass
        effect="regular"
        surface="field"
        isDark={isDark}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          height: 36,
          borderRadius: radii.pill,
          paddingHorizontal: 12,
        }}
      >
        <RNText accessibilityElementsHidden importantForAccessibility="no" style={{ fontSize: 14, color: theme.muted }}>
          {"\u2315"}
        </RNText>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {!value && placeholder ? (
            // Themed placeholder: the OS default colour ignores the theme.
            <RNText
              pointerEvents="none"
              numberOfLines={1}
              style={{ position: "absolute", left: 0, fontSize: 15, color: theme.muted }}
            >
              {placeholder}
            </RNText>
          ) : null}
          <TextInput
            accessibilityRole="search"
            accessibilityLabel={accessibilityLabel}
            value={value}
            onChangeText={handleChange}
            onSubmitEditing={() => onSubmit?.(value)}
            returnKeyType="search"
            autoCorrect={false}
            placeholder=""
            style={{
              fontSize: 15,
              paddingVertical: 4,
              color: theme.foreground,
              // Transparent: the themed placeholder above provides the hint.
              backgroundColor: "transparent",
            }}
          />
        </View>
        {value.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={clear}
            hitSlop={8}
          >
            <View
              style={{
                width: 16,
                height: 16,
                // A circle from its own size: half the 16pt box.
                borderRadius: 16 / 2,
                backgroundColor: theme.separator,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RNText style={{ fontSize: 10, color: theme.muted }}>{"\u00D7"}</RNText>
            </View>
          </Pressable>
        )}
      </Glass>
      {showCancel && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={() => {
            clear();
            onCancel?.();
          }}
        >
          <RNText style={{ fontSize: 15, color: theme.fill }}>Cancel</RNText>
        </Pressable>
      )}
    </View>
  );
});

// ---------------------------------------------------------------------------
// Chip

export interface ChipProps {
  label: string;
  icon?: ReactNode;
  /** Shows a close affordance; called when it is pressed. */
  onClose?: () => void;
  /** Tapping the chip. Omit to make it a static tag. */
  onPress?: () => void;
  /** Controlled selection. Omit for a plain tag with no selected state. */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A filter or tag pill.
 *
 * Selected state is a glass pill tinted with `glassActive` — the same selected
 * treatment SegmentedControl and TabBar use, rather than a new colour.
 */
export const Chip = forwardRef<any, ChipProps>(function Chip(
  {
    label,
    icon,
    onClose,
    onPress,
    selected: selectedProp,
    defaultSelected = false,
    onSelectedChange,
    disabled = false,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const [held, setHeld] = useState(false);
  const selected = selectedProp !== undefined ? selectedProp : internalSelected;
  const selectable = selectedProp !== undefined || onSelectedChange !== undefined || defaultSelected;

  const handlePress = () => {
    if (disabled) return;
    if (selectable) {
      const next = !selected;
      if (selectedProp === undefined) setInternalSelected(next);
      onSelectedChange?.(next);
    }
    onPress?.();
  };

  const pill = (
    <Glass
      effect="regular"
      surface="control"
      pressed={held}
      isDark={isDark}
      tintColor={selected ? theme.glassActive : undefined}
      interactive={!disabled}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 34,
        paddingHorizontal: 12,
        borderRadius: radii.pill,
        opacity: disabled ? 0.38 : 1,
        ...(style as ViewStyle),
      }}
    >
      {icon ? <View>{icon}</View> : null}
      <RNText
        numberOfLines={1}
        style={{ fontSize: 14, fontWeight: selected ? "600" : "500", color: selected ? theme.foreground : theme.muted }}
      >
        {label}
      </RNText>
      {onClose && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          onPress={onClose}
          hitSlop={8}
        >
          <RNText style={{ fontSize: 11, color: theme.muted }}>{"\u00D7"}</RNText>
        </Pressable>
      )}
    </Glass>
  );

  if (!onPress && !selectable) {
    return (
      <View ref={ref} testID={testID} accessibilityRole="text" accessibilityLabel={label} {...props}>
        {pill}
      </View>
    );
  }

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: selectable ? selected : undefined, disabled }}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    >
      {pill}
    </Pressable>
  );
});

// ---------------------------------------------------------------------------
// FAB

export interface FABProps {
  onPress: () => void;
  /** Required: an icon-only circle has no text to announce. */
  accessibilityLabel: string;
  /** The icon. When a label string is also supplied, the FAB is extended. */
  icon?: ReactNode;
  /** Turns the circle into an extended pill with visible text. */
  label?: string;
  size?: "md" | "lg";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const fabSizes = { md: 56, lg: 64 };

/**
 * The floating action button.
 *
 * The flagship glass circle of the library: a round `Glass` with `interactive`
 * so the material itself responds to touch. The caller positions it; the
 * component does not assume an edge.
 */
export const FAB = forwardRef<any, FABProps>(function FAB(
  {
    onPress,
    accessibilityLabel,
    icon,
    label,
    size = "md",
    disabled = false,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const dimension = fabSizes[size];
  const extended = Boolean(label);

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }: { pressed: boolean }) => ({
        alignSelf: "flex-start",
        opacity: disabled ? 0.38 : pressed ? 0.85 : 1,
      })}
      {...props}
    >
      <Glass
        effect="clear"
        surface="control"
        interactive={!disabled}
        isDark={isDark}
        style={{
          height: dimension,
          width: extended ? undefined : dimension,
          minWidth: dimension,
          borderRadius: extended ? dimension / 2 : dimension / 2,
          paddingHorizontal: extended ? 20 : 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          ...(style as ViewStyle),
        }}
      >
        {icon ? <View>{icon}</View> : null}
        {label ? (
          <RNText style={{ fontSize: 15, fontWeight: "600", color: theme.foreground }} numberOfLines={1}>
            {label}
          </RNText>
        ) : null}
      </Glass>
    </Pressable>
  );
});

// ---------------------------------------------------------------------------
// IconButton

export interface IconButtonProps {
  /** Required: the icon carries no text of its own. */
  accessibilityLabel: string;
  onPress: () => void;
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "glass" | "ghost";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const iconButtonSizes = { sm: 28, md: 36, lg: 44 };

/**
 * An icon-only button on glass.
 *
 * Button takes an icon alongside a label; this is the icon-only form, which
 * every kit ships for toolbars and bar actions.
 */
export const IconButton = forwardRef<any, IconButtonProps>(function IconButton(
  {
    accessibilityLabel,
    onPress,
    icon,
    size = "md",
    variant = "glass",
    disabled = false,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable } = primitives();
  const dimension = iconButtonSizes[size];

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }: { pressed: boolean }) => ({ opacity: disabled ? 0.38 : pressed ? 0.8 : 1 })}
      {...props}
    >
      <Glass
        effect={variant === "ghost" ? "none" : "regular"}
        surface="control"
        interactive={!disabled && variant !== "ghost"}
        isDark={isDark}
        style={{
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: variant === "ghost" ? "transparent" : undefined,
          ...(style as ViewStyle),
        }}
      >
        <View style={{ width: dimension * 0.5, height: dimension * 0.5, alignItems: "center", justifyContent: "center" }}>
          {icon}
        </View>
      </Glass>
    </Pressable>
  );
});

// ---------------------------------------------------------------------------
// AppBar

export interface AppBarAction {
  /** Announced to screen readers; the icon is decorative. */
  accessibilityLabel: string;
  icon: ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

export interface AppBarProps {
  title: string;
  /** Optional second line under the title. */
  subtitle?: string;
  /** A back or menu action at the leading edge. */
  leading?: AppBarAction;
  /** Actions at the trailing edge. */
  actions?: AppBarAction[];
  /**
   * The caller's safe-area inset above the bar. Glacia takes it as a prop
   * rather than adding a native insets dependency: on a device the app already
   * knows its insets, and passing a number keeps this component dependency-free.
   */
  topInset?: number;
  /**
   * Whether content has scrolled under the bar.
   *
   * iOS bars sit quiet at the top of a screen and gain a defined edge once
   * content passes beneath them, so the bar reads as a layer over the content
   * rather than as part of it. Wire this to a ScrollView's scroll offset — see
   * the component's documentation for the two-line version.
   */
  scrolled?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * The top bar.
 *
 * A glass bar across the top of the screen with a leading action, a title and
 * trailing actions — the counterpart to the existing bottom TabBar.
 *
 * `scrolled` mirrors iOS 26's scroll-edge effect. At the top of the screen the
 * bar is quiet: its bottom edge is invisible and the glass blends into the
 * content above it. Once content has scrolled under it, the edge token becomes
 * visible and the surface reads as a distinct layer — the change iOS makes when
 * a navigation bar starts floating over scrolled content.
 *
 * ```
 * const [scrolled, setScrolled] = useState(false);
 * <ScrollView onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 8)}
 *             scrollEventThrottle={16}>{...}</ScrollView>
 * <AppBar title="Inbox" scrolled={scrolled} />
 * ```
 */
export const AppBar = forwardRef<any, AppBarProps>(function AppBar(
  {
    title,
    subtitle,
    leading,
    actions,
    topInset = 0,
    scrolled = false,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();
  const actionCount = actions?.length ?? 0;

  const renderAction = (action: AppBarAction, key: string) => (
    <Pressable
      key={key}
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel}
      accessibilityState={{ disabled: action.disabled }}
      disabled={action.disabled}
      onPress={action.disabled ? undefined : action.onPress}
      hitSlop={6}
      style={{ padding: 6, opacity: action.disabled ? 0.38 : 1 }}
    >
      {action.icon}
    </Pressable>
  );

  return (
    <Glass
      ref={ref}
      effect="regular"
      surface="rail"
      isDark={isDark}
      testID={testID}
      style={{
        borderRadius: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        // Quiet at the top of a screen, defined once content is under it: the
        // bottom edge is the difference iOS draws on a scrolled navigation bar.
        ...(scrolled ? { borderBottomWidth: 0.5, borderBottomColor: theme.edge } : { borderBottomWidth: 0 }),
        ...(style as ViewStyle),
      }}
      {...props}
    >
      <View
        style={{
          paddingTop: topInset,
          paddingHorizontal: 8,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          minHeight: 44 + topInset,
        }}
      >
        {leading ? renderAction(leading, "leading") : <View style={{ width: 8 }} />}
        <View style={{ flex: 1, paddingHorizontal: 4 }}>
          <RNText
            accessibilityRole="header"
            numberOfLines={1}
            style={{ fontSize: 17, fontWeight: "600", color: theme.foreground }}
          >
            {title}
          </RNText>
          {subtitle ? (
            <RNText numberOfLines={1} style={{ fontSize: 12, color: theme.muted }}>
              {subtitle}
            </RNText>
          ) : null}
        </View>
        {actions && actionCount > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {actions.map((action, index) => renderAction(action, `action-${index}`))}
          </View>
        ) : null}
      </View>
    </Glass>
  );
});

// ---------------------------------------------------------------------------
// FABGroup

export interface FABGroupAction {
  /** A leading node, typically an SVG icon the caller supplies. */
  icon: ReactNode;
  /** The action's name, shown on its mini button. */
  label: string;
  onPress: () => void;
}

export interface FABGroupProps {
  /** The actions, listed top to bottom as they appear when expanded. */
  actions: FABGroupAction[];
  /** The icon on the main button. Rotates 45° while open. */
  icon: ReactNode;
  /** The icon on the main button while open. Defaults to the closed one. */
  closeIcon?: ReactNode;
  /** Controlled open state. Omit and the group keeps its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The main button's accessible name. */
  accessibilityLabel?: string;
  size?: "md" | "lg";
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

// The main button's size, and the mini buttons' — both from the size scale so
// a mini button is never a hand-tuned multiple of the main one.
const fabGroupSizes = {
  md: { main: 56, mini: 44 },
  lg: { main: 64, mini: 52 },
};

/**
 * A main button that expands into a stack of labelled mini buttons.
 *
 * The pattern Paper calls `FAB.Group`: one floating button stands in for a set
 * of actions until it is opened, then the actions appear above it, each on its
 * own glass pill with a label. A scrim behind them takes the next press and
 * closes the group, which is how a floating action set gets out of the way
 * without a dismissal button.
 *
 * The mini buttons rise on the bouncy spring with a small stagger, and the main
 * button's icon rotates 45° — both settle instantly under Reduce Motion.
 *
 * **Merging is an iOS 26+ visual effect.** This component is one glass surface
 * plus one per action; to have them blend into a single connected surface, put
 * the group inside a `GlassContainer` on iOS 26. It works standalone — nothing
 * depends on the container — and that composition is left to the caller rather
 * than forced, because a group outside a container is the correct rendering on
 * every other platform anyway.
 */
export const FABGroup = forwardRef<any, FABGroupProps>(function FABGroup(
  {
    actions,
    icon,
    closeIcon,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    accessibilityLabel = "More actions",
    size = "md",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable, Animated } = primitives();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  // The stack's rise is one value: 0 closed, 1 open. The mini buttons ride it
  // with their own stagger, so they follow the lead rather than all snapping
  // at once.
  const { value: rise, animated } = useSpring(open ? 1 : 0, "bouncy");

  const { main: dimension, mini } = fabGroupSizes[size];
  const closeFirst = closeIcon ?? icon;

  const rotate = animated ? rise.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) : open ? "45deg" : "0deg";

  return (
    <View ref={ref} testID={testID} style={style} {...props}>
      {open ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close actions"
          onPress={() => setOpen(false)}
          style={{ position: "absolute", top: -2000, left: -2000, right: -2000, bottom: -2000, backgroundColor: theme.scrim }}
        />
      ) : null}

      <View style={{ alignItems: "flex-end", gap: 10 }}>
        {open
          ? actions.map((action, index) => {
              // Later actions sit higher, so the first is nearest the button.
              const order = actions.length - 1 - index;
              const translateY = animated
                ? rise.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24 + order * 18, 0],
                  })
                : 0;
              const opacity = animated ? rise.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] }) : 1;

              const pill = (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  onPress={() => {
                    setOpen(false);
                    action.onPress();
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Glass
                    effect="regular"
                    surface="control"
                    isDark={isDark}
                    style={{ borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 }}
                  >
                    <RNText style={{ fontSize: 13, fontWeight: "600", color: theme.foreground }} numberOfLines={1}>
                      {action.label}
                    </RNText>
                  </Glass>
                  <Glass
                    effect="regular"
                    surface="control"
                    isDark={isDark}
                    style={{
                      width: mini,
                      height: mini,
                      borderRadius: mini / 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {action.icon}
                  </Glass>
                </Pressable>
              );

              if (!animated) {
                return (
                  <View key={`${action.label}-${index}`}>{pill}</View>
                );
              }

              return (
                <Animated.View
                  key={`${action.label}-${index}`}
                  style={{ transform: [{ translateY }], opacity }}
                >
                  {pill}
                </Animated.View>
              );
            })
          : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen(!open)}
        >
          <Glass
            effect="clear"
            surface="control"
            interactive
            isDark={isDark}
            style={{
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {animated ? (
              <Animated.View style={{ transform: [{ rotate }] }}>{open ? closeFirst : icon}</Animated.View>
            ) : (
              <View>{open ? closeFirst : icon}</View>
            )}
          </Glass>
        </Pressable>
      </View>
    </View>
  );
});
