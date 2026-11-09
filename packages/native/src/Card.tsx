import { forwardRef, type ReactNode } from "react";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";

export interface CardProps {
  effect?: "clear" | "regular" | "none";
  style?: any;
  children?: ReactNode;
  isDark?: boolean;
}

export const Card = forwardRef<any, CardProps>(function Card(
  { effect = "regular", style, children, isDark = false, ...props },
  ref,
) {
  const cardStyle = {
    padding: 20,
    borderRadius: radii.lg,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    ...style,
  };

  return (
    <Glass ref={ref} effect={effect} style={cardStyle} {...props}>
      {children}
    </Glass>
  );
});

export function CardHeader({ style, children, ...props }: { style?: any; children?: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  style,
  children,
  isDark = false,
  ...props
}: {
  style?: any;
  children?: ReactNode;
  isDark?: boolean;
}) {
  const themeColors = isDark ? colors.dark : colors.light;
  return (
    <h3
      style={{
        margin: 0,
        fontSize: 18,
        fontWeight: 600,
        color: themeColors.foreground,
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  style,
  children,
  isDark = false,
  ...props
}: {
  style?: any;
  children?: ReactNode;
  isDark?: boolean;
}) {
  const themeColors = isDark ? colors.dark : colors.light;
  return (
    <p
      style={{
        margin: 0,
        fontSize: 13,
        color: themeColors.muted,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ style, children, ...props }: { style?: any; children?: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }} {...props}>
      {children}
    </div>
  );
}

export const CardBody = CardContent;

export function CardFooter({ style, children, ...props }: { style?: any; children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        paddingTop: 8,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
