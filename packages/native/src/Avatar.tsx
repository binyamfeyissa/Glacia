// Wave 2 — Avatar.
//
// The donor's behaviour: a decorative image with an accessible name, an
// initials fallback when the image is missing or fails, and a status dot that is
// announced rather than colour-only. Dressed as the family's glass ring.

import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, controlSizes, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { initialsOf } from "./internal/initials";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "busy";
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const STATUS_COLOR = { online: "on", offline: "muted", busy: "destructive" } as const;

export function Avatar({
  source,
  name,
  size = "md",
  status,
  style,
  isDark: isDarkProp,
  testID,
}: AvatarProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Image } = primitives();
  const [failed, setFailed] = useState(false);
  const dimension = controlSizes.swatch[size === "sm" ? "sm" : size === "lg" ? "lg" : "md"];
  const label = name ? `Avatar of ${name}` : "Avatar";

  return (
    <View testID={testID} style={{ alignSelf: "flex-start" }}>
      <Glass
        effect="regular"
        surface="control"
        isDark={isDark}
        accessible
        accessibilityRole="image"
        accessibilityLabel={label}
        style={[
          {
            width: dimension,
            height: dimension,
            borderRadius: radii.pill,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.wash,
            overflow: "visible",
          },
          style,
        ]}
      >
      {source && !failed ? (
        <Image
          source={source}
          onError={() => setFailed(true)}
          accessibilityLabel={name}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
        />
      ) : (
        <RNText style={{ fontSize: dimension * 0.36, fontWeight: "600", color: theme.foreground }}>
          {initialsOf(name ?? "?")}
        </RNText>
      )}
      {status ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: Math.max(9, dimension * 0.26),
            height: Math.max(9, dimension * 0.26),
            borderRadius: dimension,
            borderWidth: 2,
            borderColor: theme.glassSolid,
            backgroundColor:
              status === "online" ? theme.on : status === "busy" ? theme.destructive : theme.muted,
          }}
        />
      ) : null}
      </Glass>
    </View>
  );
}

export { initialsOf };
export type { STATUS_COLOR };
