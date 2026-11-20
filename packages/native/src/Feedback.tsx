import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Separator } from "./Separator";
import { colors, radii, toneColor, type Tone } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { SelectedLens, rowLensStyle } from "./internal/lens";
import { hapticSelection } from "./internal/haptics";

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
        surface="overlay"
        isDark={isDark}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: radii.lg,
          maxWidth: 400,
          minWidth: 280,
          // A toast floats above everything; without a shadow it is a label.
          shadowOpacity: 0.12,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 10 },
          borderColor: tone === "neutral" ? theme.edge : accent,
        }}
      >
        {icon ? <View>{icon}</View> : null}
        <RNText
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={{ fontSize: 13, color: theme.foreground, flexShrink: 1 }}
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
// ToastViewport

/** One message in a ToastViewport's queue. */
export interface ToastItem {
  /** A stable identity. Required, because the queue reorders and dismisses. */
  id: string;
  message: string;
  action?: ToastAction;
  icon?: ReactNode;
  tone?: Tone | "neutral";
  /** Milliseconds before it dismisses itself. 0 keeps it until dismissed. */
  duration?: number;
}

export interface ToastViewportProps {
  /** The messages to show. The oldest are dropped when more than 3 arrive. */
  toasts: ToastItem[];
  /** Called when one leaves, by timer, by swipe or by its action. */
  onDismiss: (id: string) => void;
  /** How many are visible at once. Extras wait in order. Defaults to 3. */
  max?: number;
  /** Where the stack sits. */
  position?: "top" | "bottom";
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A queue of toasts, stacked the way Sonner stacks them.
 *
 * Three at a time is the practical limit: beyond that the messages stop being
 * read and start covering the screen. Extras wait in the order they arrived, so
 * no message is lost and the newest is never hidden behind a backlog.
 *
 * Each toast is independently dismissible — its own timer, its own action, and
 * a swipe up. Swiping one up removes only that one.
 *
 * The single `Toast` keeps working unchanged: this is the host for when an app
 * has several messages at once, not a replacement. A caller that shows one
 * message continues to use `Toast` directly.
 */
export const ToastViewport = forwardRef<any, ToastViewportProps>(function ToastViewport(
  { toasts, onDismiss, max = 3, position = "bottom", style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, PanResponder } = primitives();

  // The visible window is the newest `max`, so a burst shows the latest
  // messages rather than a stale backlog. Earlier ones remain queued in the
  // caller's array and appear as the visible ones leave.
  //
  // A host is often rendered for the whole life of a screen and simply has no
  // messages yet, so an absent queue means empty rather than a crash.
  const visible = (toasts ?? []).slice(0, Math.max(0, max));

  return (
    <View
      ref={ref}
      testID={testID}
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        gap: 8,
        ...(position === "top" ? { top: 16 } : { bottom: 16 }),
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {visible.map((toast) => (
        <SwipeableToast
          key={toast.id}
          toast={toast}
          isDark={isDark}
          onDismiss={() => onDismiss(toast.id)}
          theme={theme}
        />
      ))}
    </View>
  );
});

/**
 * One toast inside the viewport, with the swipe-up dismissal.
 *
 * Wrapping the existing Toast would have meant threading the gesture through
 * its props, so the viewport renders the same pill with the gesture attached —
 * the styling lives in one place (`Toast`), and this adds only the drag.
 */
function SwipeableToast({
  toast,
  isDark,
  onDismiss,
  theme,
}: {
  toast: ToastItem;
  isDark: boolean;
  onDismiss: () => void;
  theme: any;
}) {
  const { View, Text: RNText, Pressable, PanResponder, Animated } = primitives();
  const [lift, setLift] = useState(0);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  const duration = toast.duration ?? 4000;
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => dismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const panResponder = useMemo(() => {
    if (!PanResponder?.create) return null;
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_event: any, gesture: any) =>
        // Only an upward swipe removes a toast; downward drags are ignored.
        gesture.dy < -8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_event: any, gesture: any) => setLift(Math.min(0, gesture.dy)),
      onPanResponderRelease: (_event: any, gesture: any) => {
        // A quick flick or a long drag removes it; anything less springs back.
        if (gesture.dy < -40 || gesture.vy < -0.5) {
          dismissRef.current();
        } else {
          setLift(0);
        }
      },
      onPanResponderTerminate: () => setLift(0),
    });
  }, [PanResponder]);

  const tone = toast.tone ?? "neutral";
  const accent = tone === "neutral" ? theme.foreground : toneColor(theme, tone);

  const pill = (
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
      {toast.icon ? <View>{toast.icon}</View> : null}
      <RNText
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={{ fontSize: 14, color: theme.foreground, flexShrink: 1 }}
      >
        {toast.message}
      </RNText>
      {toast.action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={toast.action.label}
          onPress={() => {
            toast.action?.onPress();
            onDismiss();
          }}
          style={{ paddingHorizontal: 4 }}
        >
          <RNText style={{ fontSize: 14, fontWeight: "600", color: theme.fill }}>
            {toast.action.label}
          </RNText>
        </Pressable>
      ) : null}
    </Glass>
  );

  return (
    <View
      style={{ transform: [{ translateY: lift }], opacity: lift === 0 ? 1 : Math.max(0.4, 1 + lift / 120) }}
      {...(panResponder ? panResponder.panHandlers : {})}
    >
      {pill}
    </View>
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
      surface="overlay"
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

/** One action revealed by swiping a row. */
export interface ListSwipeAction {
  label: string;
  /** A leading node, typically an SVG icon the caller supplies. */
  icon?: ReactNode;
  /** The action's tint. Defaults to the theme's fill. */
  color?: string;
  onPress: () => void;
}

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
  /** Actions revealed by swiping right (towards the trailing edge). */
  swipeActions?: ListSwipeAction[];
  /** Actions revealed by swiping left. */
  leadingSwipeActions?: ListSwipeAction[];
  /** Width allotted to each revealed action button. */
  swipeActionWidth?: number;
  /** Turns the swipe gesture off, leaving the row's `onPress` only. */
  swipeable?: boolean;
  /** Opt out of the selection tick when a swipe opens. */
  haptics?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * Tracks which row of a List is open, so opening one closes the rest.
 *
 * A list with two open rows looks broken; iOS Mail and every kit that copied
 * it keep at most one. The List provides the registry and each swipeable row
 * registers its own close function.
 */
const OpenRowContext = createContext<{
  openId: string | null;
  setOpenId: (id: string | null) => void;
} | null>(null);

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
    swipeActions,
    leadingSwipeActions,
    swipeActionWidth = 78,
    swipeable = true,
    haptics = true,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable, PanResponder } = primitives();
  const rowGroup = useContext(OpenRowContext);

  const interactive = Boolean(onPress) && !disabled;
  const showChevron = interactive && chevron !== false && trailing === undefined;

  const trailActions = swipeActions?.filter(Boolean) ?? [];
  const leadActions = leadingSwipeActions?.filter(Boolean) ?? [];
  const canSwipe = swipeable && !disabled && (trailActions.length > 0 || leadActions.length > 0);

  // The row's own identity, so a List can close its siblings.
  const rowId = useRef<string>(`row-${Math.random().toString(36).slice(2)}`);

  // 0 is closed; a positive offset reveals trailing actions, negative leading.
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  offsetRef.current = offset;
  // A gesture that moved is a swipe, not a tap: the press that follows the
  // release must not fire the row's onPress.
  const swipedRef = useRef(false);

  const trailingWidth = trailActions.length * swipeActionWidth;
  const leadingWidth = leadActions.length * swipeActionWidth;

  const close = () => setOffset(0);

  // When another row opens, this one closes.
  useEffect(() => {
    if (rowGroup && rowGroup.openId !== rowId.current && offsetRef.current !== 0) {
      setOffset(0);
    }
  }, [rowGroup?.openId]);

  const settle = (next: number) => {
    setOffset(next);
    if (rowGroup) {
      rowGroup.setOpenId(next !== 0 ? rowId.current : null);
    }
    if (next !== 0 && haptics && offsetRef.current === 0) hapticSelection();
  };

  const panResponder = useMemo(() => {
    if (!canSwipe || !PanResponder?.create) return null;
    return PanResponder.create({
      // A horizontal drag claims the gesture; a vertical one stays with the
      // surrounding scroll view.
      onMoveShouldSetPanResponder: (_event: any, gesture: any) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 8,
      onPanResponderGrant: () => {
        swipedRef.current = false;
      },
      onPanResponderMove: (_event: any, gesture: any) => {
        if (Math.abs(gesture.dx) > 4) swipedRef.current = true;
        const from = offsetRef.current;
        let next = from + gesture.dx;
        // Do not drag past what the actions actually occupy; a small
        // overshoot makes the edge feel elastic rather than hard.
        next = Math.min(next, trailingWidth + 24);
        next = Math.max(next, -(leadingWidth + 24));
        setOffset(next);
      },
      onPanResponderRelease: (_event: any, gesture: any) => {
        const released = offsetRef.current;
        // Beyond half an action, or with a decisive flick, it stays open;
        // otherwise it falls back closed.
        if (gesture.dx > 0 && trailActions.length > 0) {
          settle(released > trailingWidth / 2 || gesture.vx > 0.5 ? trailingWidth : 0);
        } else if (gesture.dx < 0 && leadActions.length > 0) {
          settle(released < -leadingWidth / 2 || gesture.vx < -0.5 ? -leadingWidth : 0);
        } else {
          settle(offsetRef.current > 0 ? Math.min(offsetRef.current, trailingWidth) : Math.max(offsetRef.current, -leadingWidth));
        }
      },
      onPanResponderTerminate: () => settle(0),
      onPanResponderTerminationRequest: () => false,
    });
    // The responder reads from refs, so it never acts on a stale offset.
  }, [canSwipe, PanResponder, trailingWidth, leadingWidth, trailActions.length, leadActions.length]);

  /**
   * Runs an action and closes the row.
   *
   * The action is dispatched first so its own feedback is not delayed by the
   * close, then the row resets — the reveal should not outlive the press.
   */
  const runAction = (action: ListSwipeAction) => {
    action.onPress();
    settle(0);
    if (rowGroup) rowGroup.setOpenId(null);
  };

  const guardPress = (handler?: () => void) => () => {
    // Swallow the press that ends a swipe.
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    handler?.();
  };

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
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    // The selected row is a lens painted behind the content, not a flat wash.
    backgroundColor: "transparent",
    opacity: disabled ? 0.38 : 1,
    ...(style as ViewStyle),
  };

  const lens = selected ? (
    <SelectedLens
      radius={8}
      isDark={isDark}
      style={rowLensStyle(8)}
      testID={testID ? `${testID}-lens` : undefined}
    />
  ) : null;

  const rowInner = !interactive ? (
    <View accessibilityRole="text" accessibilityState={{ disabled }} style={rowStyle}>
      {lens}
      {content}
    </View>
  ) : (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={description ? `${title}, ${description}` : title}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={guardPress(onPress)}
      style={({ pressed }: { pressed: boolean }) => ({ ...rowStyle, opacity: pressed ? 0.7 : rowStyle.opacity })}
    >
      {lens}
      {content}
    </Pressable>
  );

  if (!canSwipe) {
    return (
      <View ref={ref} testID={testID} style={{ overflow: "hidden" }} {...props}>
        {rowInner}
      </View>
    );
  }

  /** The tinted tray behind the row: glass-tinted actions, flat not glass. */
  const tray = (actions: ListSwipeAction[], edge: "left" | "right") => (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [edge]: 0,
        flexDirection: "row",
      }}
    >
      {actions.map((action, index) => (
        <Pressable
          key={`${action.label}-${index}`}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => runAction(action)}
          style={{
            width: swipeActionWidth,
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            backgroundColor: action.color ?? theme.glassActive,
          }}
        >
          {action.icon}
          <RNText style={{ fontSize: 12, color: theme.foreground }} numberOfLines={1}>
            {action.label}
          </RNText>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="none"
      style={{ overflow: "hidden" }}
      {...props}
    >
      {leadActions.length > 0 ? tray(leadActions, "right") : null}
      {trailActions.length > 0 ? tray(trailActions, "left") : null}
      <View
        style={{
          transform: [{ translateX: offset }],
          // The row rides over its tray while it is open, so the actions are
          // uncovered rather than shown alongside.
          backgroundColor: "transparent",
        }}
        {...(panResponder ? panResponder.panHandlers : {})}
      >
        {rowInner}
      </View>
    </View>
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

  // At most one swipeable row is open at a time, so a list never shows two
  // trays at once.
  const [openId, setOpenId] = useState<string | null>(null);
  const group = useMemo(() => ({ openId, setOpenId }), [openId]);

  const body = (
    <OpenRowContext.Provider value={group}>
      <View style={{ gap: 2 }}>
        {rows.map((row, index) => (
          <View key={index}>
            {index > 0 ? <Separator isDark={isDark} inset={inset ? 14 : 0} /> : null}
            {row}
          </View>
        ))}
      </View>
    </OpenRowContext.Provider>
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
      surface="panel"
      isDark={isDark}
      testID={testID}
      style={{ borderRadius: radii.lg, ...(style as ViewStyle) }}
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
            paddingHorizontal: 16,
            paddingVertical: 5,
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
      surface="panel"
      isDark={isDark}
      testID={testID}
      style={{ borderRadius: radii.stack, ...(style as ViewStyle) }}
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
              style={{ paddingVertical: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center" }}
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
              <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>{section.content}</View>
            ) : null}
          </View>
        );
      })}
    </Glass>
  );
});
