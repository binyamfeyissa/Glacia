import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export type BannerTone = "info" | "success" | "warning" | "danger";

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Accent tone. `info` is the default. Colours come from the kit's
      existing tokens (`--gl-fill`, `--gl-on`, `--gl-destructive`); `warning`
      reuses the kit's only existing warning treatment, the `#ff9f0a` of
      `.gl-error-badge-warning` — the kit has no `--gl-warning` token. */
  tone?: BannerTone;
  /** Icon shown in the tinted plate. Omit it for a text-only banner. */
  icon?: ReactNode;
  /** Primary headline for the banner. */
  title: string;
  /** Secondary description. */
  description?: ReactNode;
  /** Optional call-to-action button or interactive elements. */
  action?: ReactNode;
  /** Shows a dismiss button. Wire `onDismiss` to hide the banner. */
  dismissible?: boolean;
  /** Called when the dismiss button is pressed. */
  onDismiss?: () => void;
}

/**
 * An inline banner / alert on the Card glass surface, with the Toast tone
 * vocabulary: an icon plate, a title, a description and an action, plus an
 * optional dismiss button. Same structure as Empty, laid out horizontally.
 */
export const Banner: ForwardRefExoticComponent<
  BannerProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    tone = "info",
    icon,
    title,
    description,
    action,
    dismissible,
    onDismiss,
    className,
    ...props
  },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);
  useRefraction(ref);

  return (
    <div
      ref={ref}
      role={tone === "warning" || tone === "danger" ? "alert" : "status"}
      className={cx("gl-glass gl-banner", className)}
      data-tone={tone === "info" ? undefined : tone}
      // The refraction engine writes data-rim and data-refracting from measured
      // geometry after hydration; those writes are intentional.
      suppressHydrationWarning
      {...props}
    >
      {icon && <div className="gl-banner-icon">{icon}</div>}
      <div className="gl-banner-body">
        <h3 className="gl-banner-title">{title}</h3>
        {description && <p className="gl-banner-description">{description}</p>}
      </div>
      {action && <div className="gl-banner-action">{action}</div>}
      {dismissible && (
        <button
          type="button"
          className="gl-banner-dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 3L9 9M9 3L3 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
});
