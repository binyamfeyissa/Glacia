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

export interface CoverPlateProps extends HTMLAttributes<HTMLDivElement> {
  /** Media shown flush at the top of the card: an image, video or element. */
  media?: ReactNode;
  /** Primary headline, below the media. */
  title: string;
  /** Secondary description. */
  description?: ReactNode;
  /** Optional call-to-action button or interactive elements. */
  action?: ReactNode;
}

/**
 * A Card with a media area on top and a body below — the Card glass, the
 * Card title / description sizes, nothing else new. Same structure as Card
 * + Empty: media, title, description, action.
 */
export const CoverPlate: ForwardRefExoticComponent<
  CoverPlateProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, CoverPlateProps>(
  function CoverPlate(
    { media, title, description, action, className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);

    return (
      <div
        ref={ref}
        className={cx("gl-glass gl-cover-plate", className)}
        // The refraction engine writes data-rim and data-refracting from measured
        // geometry after hydration; those writes are intentional.
        suppressHydrationWarning
        {...props}
      >
        {media && <div className="gl-cover-plate-media">{media}</div>}
        <div className="gl-cover-plate-body">
          <h3 className="gl-cover-plate-title">{title}</h3>
          {description && (
            <p className="gl-cover-plate-description">{description}</p>
          )}
          {action && <div className="gl-cover-plate-action">{action}</div>}
          {children}
        </div>
      </div>
    );
  },
);
