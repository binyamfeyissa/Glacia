import {
  forwardRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

export const Pagination = ({
  className,
  ...props
}: ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cx("gl-pagination", className)}
    {...props}
  />
);

export const PaginationContent = forwardRef<
  HTMLUListElement,
  ComponentProps<"ul">
>(function PaginationContent({ className, ...props }, ref) {
  return (
    <ul
      ref={ref}
      className={cx("gl-pagination-content", className)}
      {...props}
    />
  );
});

export const PaginationItem = forwardRef<
  HTMLLIElement,
  ComponentProps<"li">
>(function PaginationItem({ className, ...props }, ref) {
  return <li ref={ref} className={cx("gl-pagination-item", className)} {...props} />;
});

export interface PaginationLinkProps extends ComponentProps<"a"> {
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PaginationLink = ({
  className,
  isActive,
  size = "md",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    data-active={isActive ? "" : undefined}
    data-size={size}
    className={cx("gl-glass gl-pagination-link", className)}
    {...props}
  />
);

export const PaginationPrevious = ({
  className,
  children = "Previous",
  ...props
}: PaginationLinkProps & { children?: ReactNode }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="md"
    className={cx("gl-pagination-prev", className)}
    {...props}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M7.5 2.5L4 6L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span>{children}</span>
  </PaginationLink>
);

export const PaginationNext = ({
  className,
  children = "Next",
  ...props
}: PaginationLinkProps & { children?: ReactNode }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="md"
    className={cx("gl-pagination-next", className)}
    {...props}
  >
    <span>{children}</span>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </PaginationLink>
);

export const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    aria-hidden="true"
    className={cx("gl-pagination-ellipsis", className)}
    {...props}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="3" cy="7" r="1.25" fill="currentColor" />
      <circle cx="7" cy="7" r="1.25" fill="currentColor" />
      <circle cx="11" cy="7" r="1.25" fill="currentColor" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
);
