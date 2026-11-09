import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  children?: ReactNode;
}

const defaultTags: Record<TextVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  blockquote: "blockquote",
  code: "code",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as, variant = "p", className, children, ...props },
  ref,
) {
  const Component = as || defaultTags[variant] || "p";
  return (
    <Component
      ref={ref as any}
      className={cx("gl-text", `gl-text-${variant}`, className)}
      data-variant={variant}
      {...props}
    >
      {children}
    </Component>
  );
});
