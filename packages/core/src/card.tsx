import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "clear";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = "glass", ...props },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);
  useRefraction(ref);

  return (
    <div
      ref={ref}
      className={cx("gl-glass gl-card", className)}
      suppressHydrationWarning
      data-variant={variant === "glass" ? undefined : variant}
      {...props}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-card-header", className)} {...props} />;
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3 ref={ref} className={cx("gl-card-title", className)} {...props}>
        {children}
      </h3>
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx("gl-card-description", className)} {...props} />;
  },
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-card-content", className)} {...props} />;
  },
);

/** Alias for CardContent matching prompt's "Header / Body / Footer slots" description */
export const CardBody = CardContent;

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-card-footer", className)} {...props} />;
  },
);
