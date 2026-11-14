import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Separator } from "./Display";
import { colors, radii, toneColor, type Tone } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

// ---------------------------------------------------------------------------
// Toast

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastProps {
  /** Controlled visibility. Omit it and the toast keeps its own state. */
  visible?: boolean;
  defaultVisible?: boolean;
  onDismiss?: () => void;
  message: string;
  /** One optional action, e.g. Undo. */
  action?: ToastAction;
  /** A leading icon (an SVG node the caller supplies). */
  icon?: ReactNode;
  /**
   * Milliseconds before it dismisses itself. 0 keeps it until dismissed.
   * The timer is cleared on unmount as well as on dismiss.
   */
  duration?: number;
  tone?: Tone | "neutral";
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A transient message on a glass pill.
 *
 * A toast is not a dialog: it never blocks the screen, so it renders in place
 * and lets touches through to what is underneath. It dismisses itself after
 * `duration` unless it is controlled or `duration` is 0.
 */
export const Toast = forwardRef<any, ToastProps>(function Toast(
  {
    visible: visibleProp,
    defaultVisible = false,
    onDismiss,
    message,
    action,
    icon,
    duration = 4000,
    tone = "neutral",
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

  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const visible = visibleProp !== undefined ? visibleProp : internalVisible;

  const dismiss = () => {
    if (visibleProp === undefined) setInternalVisible(false);
    onDismiss?.();
  };

  // The timer lives and dies with the toast. A ref keeps the latest dismiss
  // closure out of the effect's dependencies, so a parent re-render does not
  // restart the countdown.
  const dismissRef = useRef(dismiss);
  dismissRef.current = dismiss;

  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timer = setTimeout(() => dismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [visible, duration]);

  const { value: enter, animated } = useSpring(visible ? 1 : 0, "snappy");
  const rise = animated ? enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) : 0;
  const fade = animated ? enter.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) : 1;

  if (!visible) return null;

  const accent = tone === "neutral" ? theme.foreground : toneColor(theme, tone);

  return (
    <View
      ref={ref}
      testID={testID}
      pointerEvents="box-none"
      style={{ alignItems: "center", ...(style as ViewStyle) }}
      {...props}
    >
      {/* The pill's entrance: it rises and fades in on the springs token. */}
      <Entrance animated={animated} rise={rise} fade={fade}>
      <Glass
        effect="regular"
        isDark={isDark}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: radii.pill,
          maxWidth: 420,
          borderColor: tone === "neutral" ? theme.edge : accent,
        }}
      >
        {icon ? <View>{icon}</View> : null}
        <RNText
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={{ fontSize: 14, color: theme.foreground, flexShrink: 1 }}
        >
          {message}
        </RNText>
        {action && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
            style={{ paddingHorizontal: 4 }}
          >
            <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.fill }}>
              {action.label}
            </RNText>
          </Pressable>
        )}
      </Glass>
      </Entrance>
    </View>
  );
});

/**
 * Applies the toast's entrance motion around the pill.
 *
 * A thin wrapper because animated styles must land on an Animated.View, while
 * the pill itself is a Glass — wrapping keeps both honest.
 */
function Entrance({
  animated,
  rise,
  fade,
  children,
}: {
  animated: boolean;
  rise: any;
  fade: any;
  children: ReactNode;
}) {
  const { Animated } = primitives();
  if (!animated) return <>{children}</>;
  return (
    <Animated.View style={{ transform: [{ translateY: rise }], opacity: fade }}>
      {children}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Banner

export interface BannerProps {
  title?: string;
  message: string;
  tone?: Tone;
  /** A leading icon node. */
  icon?: ReactNode;
  /** Shows a dismiss button when provided. */
  onDismiss?: () => void;
  /** A single inline action, e.g. Retry. */
  action?: ToastAction;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * An inline alert.
 *
 * Unlike AlertDialog it is not modal and not an overlay: it sits in the layout
 * and pushes the content below it down. The surface is glass with the tone's
 * colour as its edge, so the tone reads at a glance without turning the whole
 * panel into a solid block of colour.
 */
export const Banner = forwardRef<any, BannerProps>(function Banner(
  { title, message, tone = "info", icon, onDismiss, action, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();
  const accent = toneColor(theme, tone);

  return (
    <Glass
      ref={ref}
      effect="regular"
      isDark={isDark}
      testID={testID}
      style={{ borderRadius: radii.md, borderColor: accent, ...(style as ViewStyle) }}
      {...props}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12 }}>
        {icon ? <View style={{ paddingTop: 1 }}>{icon}</View> : null}
        <View style={{ flex: 1, gap: 2 }}>
          {title && (
            <RNText
              accessibilityRole="heading"
              style={{ fontSize: 14, fontWeight: "600", color: theme.foreground }}
            >
              {title}
            </RNText>
          )}
          <RNText accessibilityRole="alert" style={{ fontSize: 13, color: theme.muted, lineHeight: 18 }}>
            {message}
          </RNText>
          {action && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={{ alignSelf: "flex-start", paddingTop: 6 }}
            >
              <RNText style={{ fontSize: 13, fontWeight: "600", color: accent }}>
                {action.label}
              </RNText>
            </Pressable>
          )}
        </View>
        {onDismiss && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            onPress={onDismiss}
            hitSlop={8}
            style={{ padding: 2 }}
          >
            <RNText style={{ fontSize: 15, color: theme.muted }}>{"\u00D7"}</RNText>
          </Pressable>
        )}
      </View>
    </Glass>
  );
});

// ---------------------------------------------------------------------------
// List

export interface ListItemProps {
  /** An avatar, icon or other leading node. */
  leading?: ReactNode;
  /** The row's main text. */
  title: string;
  /** Secondary line under the title. */
  description?: string;
  /** A value text, a control, or any trailing node. */
  trailing?: ReactNode;
  /** Draws a chevron when the row is tappable and nothing else trails it. */
  chevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * One row of a List.
 *
 * The row is a Pressable when it has an `onPress`, and inert otherwise, which
 * is what the platform expects: a row that does nothing should not announce
 * itself as a button. The chevron is decoration and is hidden from screen
 * readers, since the row's own role already says it is tappable.
 */
export const ListItem = forwardRef<any, ListItemProps>(function ListItem(
  {
    leading,
    title,
    description,
    trailing,
    chevron,
    onPress,
    disabled = false,
    selected = false,
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

  const interactive = Boolean(onPress) && !disabled;
  const showChevron = interactive && chevron !== false && trailing === undefined;

  const content = (
    <>
      {leading ? <View style={{ marginRight: 12 }}>{leading}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <RNText
          numberOfLines={1}
          style={{ fontSize: 16, color: theme.foreground, fontWeight: "400" }}
        >
          {title}
        </RNText>
        {description ? (
          <RNText numberOfLines={2} style={{ fontSize: 13, color: theme.muted, lineHeight: 17 }}>
            {description}
          </RNText>
        ) : null}
      </View>
      {trailing ? <View style={{ marginLeft: 8 }}>{trailing}</View> : null}
      {showChevron ? (
        <RNText accessibilityElementsHidden importantForAccessibility="no" style={{ marginLeft: 6, fontSize: 17, color: theme.muted }}>
          {"\u203A"}
        </RNText>
      ) : null}
    </>
  );

  const rowStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: selected ? theme.glassActive : "transparent",
    opacity: disabled ? 0.38 : 1,
    ...(style as ViewStyle),
  };

  if (!interactive) {
    return (
      <View ref={ref} testID={testID} accessibilityRole="text" accessibilityState={{ disabled }} style={rowStyle} {...props}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={description ? `${title}, ${description}` : title}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => ({ ...rowStyle, opacity: pressed ? 0.7 : rowStyle.opacity })}
      {...props}
    >
      {content}
    </Pressable>
  );
});

export interface ListProps {
  children?: ReactNode;
  /** Renders the rows on one glass panel with separators between them. */
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A grouped list of rows — the backbone of settings and profile screens.
 *
 * With `inset`, the rows sit on one glass panel with hairline separators, which
 * is the shape iOS settings screens use. The separators are drawn by the
 * caller's ListItem spacing rather than by nesting glass inside glass.
 */
export const List = forwardRef<any, ListProps>(function List(
  { children, inset = false, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const { View } = primitives();

  const rows = Array.isArray(children) ? children.filter(Boolean) : children == null ? [] : [children];

  const body = (
    <View style={{ gap: 2 }}>
      {rows.map((row, index) => (
        <View key={index}>
          {index > 0 ? <Separator isDark={isDark} inset={inset ? 14 : 0} /> : null}
          {row}
        </View>
      ))}
    </View>
  );

  if (!inset) {
    return (
      <View ref={ref} testID={testID} style={style} {...props}>
        {body}
      </View>
    );
  }

  return (
    <Glass
      ref={ref}
      effect="regular"
      isDark={isDark}
      testID={testID}
      style={{ borderRadius: radii.md, overflow: "hidden", ...(style as ViewStyle) }}
      {...props}
    >
      {body}
    </Glass>
  );
});

/** A titled group of rows, e.g. "Account" above its settings. */
export interface ListSectionProps {
  header?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

export const ListSection = forwardRef<any, ListSectionProps>(function ListSection(
  { header, children, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText } = primitives();

  return (
    <View ref={ref} testID={testID} style={[{ gap: 6 }, style as ViewStyle]} {...props}>
      {header ? (
        <RNText
          accessibilityRole="heading"
          style={{
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: theme.muted,
            paddingHorizontal: 14,
          }}
        >
          {header}
        </RNText>
      ) : null}
      <List inset isDark={isDark}>
        {children}
      </List>
    </View>
  );
});

// ---------------------------------------------------------------------------
// Accordion

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
  /** Controlled open sections. Omit for uncontrolled. */
  openSections?: string[];
  defaultOpenSections?: string[];
  onOpenSectionsChange?: (open: string[]) => void;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * Expandable sections.
 *
 * The header is a Pressable reporting `expanded`; the panel is measured with
 * the height the content reports and animated on the springs token, so the
 * reveal is a real transition rather than an instant jump.
 */
export const Accordion = forwardRef<any, AccordionProps>(function Accordion(
  {
    sections,
    multiple = false,
    openSections: openProp,
    defaultOpenSections = [],
    onOpenSectionsChange,
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

  const [internalOpen, setInternalOpen] = useState<string[]>(defaultOpenSections);
  const open = openProp !== undefined ? openProp : internalOpen;

  const toggle = (value: string) => {
    const isOpen = open.includes(value);
    let next: string[];
    if (isOpen) next = open.filter((item) => item !== value);
    else next = multiple ? [...open, value] : [value];
    if (openProp === undefined) setInternalOpen(next);
    onOpenSectionsChange?.(next);
  };

  return (
    <Glass
      ref={ref}
      effect="regular"
      isDark={isDark}
      testID={testID}
      style={{ borderRadius: radii.md, overflow: "hidden", ...(style as ViewStyle) }}
      {...props}
    >
      {sections.map((section, index) => {
        const expanded = open.includes(section.value);
        return (
          <View key={section.value}>
            {index > 0 ? <Separator isDark={isDark} /> : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={section.title}
              accessibilityState={{ expanded }}
              onPress={() => toggle(section.value)}
              style={{ paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <RNText style={{ fontSize: 15, fontWeight: "500", color: theme.foreground }}>
                  {section.title}
                </RNText>
                {section.description ? (
                  <RNText style={{ fontSize: 13, color: theme.muted }}>{section.description}</RNText>
                ) : null}
              </View>
              <RNText
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{ fontSize: 13, color: theme.muted, marginLeft: 8 }}
              >
                {expanded ? "\u2303" : "\u2304"}
              </RNText>
            </Pressable>
            {expanded ? (
              <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>{section.content}</View>
            ) : null}
          </View>
        );
      })}
    </Glass>
  );
});
