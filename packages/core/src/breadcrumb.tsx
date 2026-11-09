import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

export const Breadcrumb = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"nav"> & { separator?: ReactNode }
>(function Breadcrumb({ className, ...props }, ref) {
  return <nav ref={ref} aria-label="breadcrumb" className={cx("gl-breadcrumb", className)} {...props} />;
});

export const BreadcrumbList = forwardRef<
  HTMLOListElement,
  ComponentPropsWithoutRef<"ol">
>(function BreadcrumbList({ className, ...props }, ref) {
  return (
    <ol
      ref={ref}
      className={cx("gl-breadcrumb-list", className)}
      {...props}
    />
  );
});

export const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<"li">
>(function BreadcrumbItem({ className, ...props }, ref) {
  return (
    <li
      ref={ref}
      className={cx("gl-breadcrumb-item", className)}
      {...props}
    />
  );
});

export const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(function BreadcrumbLink({ className, ...props }, ref) {
  return (
    <a
      ref={ref}
      className={cx("gl-breadcrumb-link", className)}
      {...props}
    />
  );
});

export const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(function BreadcrumbPage({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cx("gl-breadcrumb-page", className)}
      {...props}
    />
  );
});

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cx("gl-breadcrumb-separator", className)}
    {...props}
  >
    {children ?? (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </li>
);

export const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cx("gl-breadcrumb-ellipsis", className)}
    {...props}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="3" cy="7" r="1.25" fill="currentColor" />
      <circle cx="7" cy="7" r="1.25" fill="currentColor" />
      <circle cx="11" cy="7" r="1.25" fill="currentColor" />
    </svg>
    <span className="sr-only">More</span>
  </span>
);
