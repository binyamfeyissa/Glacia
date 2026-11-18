import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Avatar } from "./Display";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

// ---------------------------------------------------------------------------
// MessageBubble

export interface MessageBubbleProps {
  /** Whether the message is the device owner's (right, tinted) or not (left). */
  outgoing?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * One message's bubble.
 *
 * The bubble is a glass surface like the rest of the library (panel profile),
 * so it carries the same blurred backdrop, lit rim and shadow as a card. The
 * outgoing direction is tinted with `glassActive` — the theme's selected
 * tint — and the incoming one uses the plain glass token, which is what keeps
 * the two directions distinguishable without a second material.
 */
export const MessageBubble = forwardRef<any, MessageBubbleProps>(function MessageBubble(
  { outgoing = false, children, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View } = primitives();

  return (
    <Glass
      ref={ref}
      testID={testID}
      surface="panel"
      isDark={isDark}
      tintColor={outgoing ? theme.glassActive : undefined}
      style={{
        alignSelf: outgoing ? "flex-end" : "flex-start",
        maxWidth: "82%",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: radii.lg,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {children}
    </Glass>
  );
});

// ---------------------------------------------------------------------------
// MessageAttachment

export interface MessageAttachmentProps {
  /** The file's name, shown and used as the accessible label. */
  name: string;
  /** A human-readable size, e.g. "1.2 MB". */
  size?: string;
  /** A leading node, typically an SVG icon. */
  icon?: ReactNode;
  /** Makes the chip tappable, e.g. to open the file. */
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A file chip for a message.
 *
 * A flat, bordered chip rather than a glass one, for the same reason the
 * bubbles are flat: it sits inside a bubble or beside one, and glass inside
 * glass is never allowed. The size is a caller-formatted string — byte
 * formatting belongs to the app's locale, not to a component library.
 */
export const MessageAttachment = forwardRef<any, MessageAttachmentProps>(
  function MessageAttachment(
    { name, size, icon, onPress, disabled = false, style, isDark: isDarkProp, testID, ...props },
    ref,
  ) {
    const isDark = useIsDark(isDarkProp);
    const theme = isDark ? colors.dark : colors.light;
    const { View, Text, Pressable } = primitives();

    const body = (
      <>
        {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
        <View style={{ flexShrink: 1 }}>
          <Text numberOfLines={1} style={{ fontSize: 14, color: theme.foreground }}>
            {name}
          </Text>
          {size ? (
            <Text style={{ fontSize: 11, color: theme.muted }}>{size}</Text>
          ) : null}
        </View>
      </>
    );

    const chipStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: radii.md,
      backgroundColor: theme.wash,
      borderWidth: 0.5,
      borderColor: theme.separator,
      opacity: disabled ? 0.38 : 1,
      ...(style as ViewStyle),
    };

    if (!onPress) {
      return (
        <View ref={ref} testID={testID} accessibilityRole="text" accessibilityLabel={size ? `${name}, ${size}` : name} style={chipStyle} {...props}>
          {body}
        </View>
      );
    }

    return (
      <Pressable
        ref={ref}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={size ? `${name}, ${size}` : name}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={chipStyle}
        {...props}
      >
        {body}
      </Pressable>
    );
  },
);

// ---------------------------------------------------------------------------
// Message

export interface MessageProps {
  /** The sender's name, shown above the content. */
  name?: string;
  /** A time or timestamp, shown beside the name. */
  time?: string;
  /** Draws an Avatar showing `name`'s initials beside the content. */
  avatar?: boolean;
  /** The bubble direction. */
  outgoing?: boolean;
  /** The message's content: text, or a bubble, or a bubble with attachments. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A whole message: who sent it, when, and what they said.
 *
 * The row every chat screen builds by hand — an avatar, a name and time line,
 * and the content under it. Grouping it means the alignment, spacing and
 * accessibility grouping are decided once: the row is announced as a single
 * message (name, time, content) rather than as three unrelated pieces of text.
 */
export const Message = forwardRef<any, MessageProps>(function Message(
  { name, time, avatar = false, outgoing = false, children, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();

  const meta = [name, time].filter(Boolean).join(", ");

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={meta || undefined}
      style={{
        flexDirection: outgoing ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
        paddingHorizontal: 4,
        paddingVertical: 4,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {avatar ? (
        <Avatar name={name ?? ""} size="sm" isDark={isDark} />
      ) : null}
      <View style={{ flexShrink: 1, alignItems: outgoing ? "flex-end" : "flex-start", gap: 2 }}>
        {name || time ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {name ? (
              <Text style={{ fontSize: 12, fontWeight: "600", color: theme.foreground }}>{name}</Text>
            ) : null}
            {time ? <Text style={{ fontSize: 11, color: theme.muted }}>{time}</Text> : null}
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
});
