import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

/**
 * TicketEntry — one entry in a support-ticket thread.
 *
 * Reference: the Message family (src/message.tsx) — author header,
 * timestamp and status reuse the Message classes, and the avatar reuses
 * `gl-message-avatar`. Adapted, NOT chat-shaped: there is no bubble tail,
 * no side alignment and no `gl-message-user` / `gl-message-assistant`
 * split. The entry is a full-width glass row: header (avatar, author,
 * timestamp, status) above the body.
 */
export type TicketStatus = "open" | "pending" | "resolved" | "closed";

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  pending: "Pending",
  resolved: "Resolved",
  closed: "Closed",
};

export interface TicketEntryProps extends HTMLAttributes<HTMLElement> {
  /** Who wrote this entry (name or richer header content). */
  author: ReactNode;
  /** Avatar content (initials, icon, or image) shown before the author. */
  avatar?: ReactNode;
  /** When the entry was posted, e.g. "Tue 10:41". */
  timestamp?: string;
  /** Ticket status shown as a tinted label (default "open"). */
  status?: TicketStatus;
  /** The entry body. `children` is used when `body` is not given. */
  body?: ReactNode;
}

export const TicketEntry: ForwardRefExoticComponent<
  TicketEntryProps & RefAttributes<HTMLElement>
> = /* @__PURE__ */ forwardRef<HTMLElement, TicketEntryProps>(
  function TicketEntry(
    { author, avatar, timestamp, status = "open", body, className, children, ...props },
    ref,
  ) {
    return (
      <article
        ref={ref}
        className={cx("gl-glass gl-ticket-entry", className)}
        data-status={status}
        {...props}
      >
        <div className="gl-ticket-entry-header">
          {avatar && <div className="gl-message-avatar gl-glass">{avatar}</div>}
          <span className="gl-ticket-entry-author">{author}</span>
          {timestamp && <span className="gl-message-timestamp">{timestamp}</span>}
          <span className="gl-ticket-entry-status" data-status={status}>
            {STATUS_LABELS[status]}
          </span>
        </div>
        <div className="gl-ticket-entry-body">{body ?? children}</div>
      </article>
    );
  },
);
