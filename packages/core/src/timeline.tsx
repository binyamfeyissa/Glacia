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

export type TimelineItemState = "done" | "current" | "upcoming";

export interface TimelineItem {
  /** Headline for the event. */
  title: ReactNode;
  /** When it happened or happens, e.g. "09:30" or "Nov 25". */
  time?: ReactNode;
  /** Extra detail under the title. */
  description?: ReactNode;
  /** State of the event: done `--gl-on`, current `--gl-fill`, upcoming `--gl-muted`. */
  state?: TimelineItemState;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  /** Events in order, top to bottom. */
  items: TimelineItem[];
}

/**
 * A vertical timeline — dot + connector line, title, time, description.
 * Reference is Stepper / List: the dot copies Stepper's current-value
 * treatment (a filled marker on a track), the connector line copies the
 * List separator (`--gl-separator`), and the text copies ListItem's
 * title + subtitle stack.
 */
export const Timeline: ForwardRefExoticComponent<
  TimelineProps & RefAttributes<HTMLOListElement>
> = /* @__PURE__ */ forwardRef<HTMLOListElement, TimelineProps>(
  function Timeline({ items, className, ...props }, forwardedRef) {
    const ref = useRef<HTMLOListElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <ol
        ref={ref}
        className={cx("gl-timeline", className)}
        {...props}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="gl-timeline-item"
            data-state={item.state ?? "upcoming"}
          >
            <span className="gl-timeline-dot" aria-hidden />
            <div className="gl-timeline-body">
              <div className="gl-timeline-head">
                <span className="gl-timeline-title">{item.title}</span>
                {item.time && <span className="gl-timeline-time">{item.time}</span>}
              </div>
              {item.description && (
                <p className="gl-timeline-description">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  },
);
