"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cx } from "../internal/cx";

/**
 * A shimmering placeholder for text that has not arrived.
 *
 * Renders the same number of visual lines as the final text is expected to
 * occupy, so the layout does not jump when the real content replaces it.
 */
export function Shimmer({
  lines = 3,
  className,
  label = "Loading content",
}: {
  lines?: number;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cx("gl-shimmer", className)} role="status" aria-label={label}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="gl-shimmer-line"
          // The last line is short so the block reads as a paragraph, not a box.
          style={{ width: i === lines - 1 ? "62%" : "100%" }}
        />
      ))}
    </div>
  );
}

/** A single step in a plan, with its own state. */
export interface PlanStep {
  id: string;
  title: string;
  detail?: string;
  status: "pending" | "running" | "done" | "failed";
}

export interface PlanProps {
  title?: string;
  steps: PlanStep[];
  className?: string;
}

/**
 * An ordered list of steps a model intends to take.
 *
 * Each step states its own status so a running plan is legible while it is
 * still incomplete, rather than appearing blank until everything finishes.
 */
export function Plan({ title = "Plan", steps, className }: PlanProps) {
  const done = steps.filter((step) => step.status === "done").length;

  return (
    <div className={cx("gl-glass gl-plan", className)}>
      <div className="gl-plan-head">
        <span className="gl-plan-title">{title}</span>
        <span className="gl-plan-count">
          {done}/{steps.length}
        </span>
      </div>

      <ol className="gl-plan-steps">
        {steps.map((step) => (
          <li key={step.id} className="gl-plan-step" data-status={step.status}>
            <span className="gl-plan-marker" aria-hidden>
              {step.status === "done" ? "✓" : step.status === "failed" ? "!" : ""}
            </span>
            <span className="gl-plan-copy">
              <span className="gl-plan-step-title">{step.title}</span>
              {step.detail && <span className="gl-plan-step-detail">{step.detail}</span>}
            </span>
            <span className="gl-plan-status">{step.status}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Reveals text progressively, as a streamed response arrives.
 *
 * Accepts the full text plus a `revealed` character count, so the caller owns
 * the streaming clock (usually a network stream). When `revealed` is omitted
 * the text renders in full.
 */
export function Response({
  text,
  revealed,
  streaming,
  className,
}: {
  text: string;
  revealed?: number;
  streaming?: boolean;
  className?: string;
}) {
  const shown = revealed == null ? text : text.slice(0, Math.max(0, revealed));
  const isStreaming = streaming ?? (revealed != null && revealed < text.length);

  return (
    <div className={cx("gl-response", className)} data-streaming={isStreaming ? "" : undefined}>
      <p className="gl-response-text">
        {shown}
        {isStreaming && <span className="gl-response-caret" aria-hidden />}
      </p>
      <span className="gl-sr-only" role="status">
        {isStreaming ? "Response streaming" : "Response complete"}
      </span>
    </div>
  );
}

export interface AIPanelNavItem {
  id: string;
  label: string;
  count?: number;
}

/**
 * A side rail for an AI workspace: conversations, saved prompts, or tasks.
 *
 * Selection is a button rather than a link because the panel's content is
 * client state; the caller decides what a selection means.
 */
export function Panelside({
  items,
  activeId,
  onSelect,
  title = "Workspace",
  footer,
  className,
}: {
  items: AIPanelNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(activeId ?? items[0]?.id);
  const active = activeId ?? internal;

  const select = (id: string) => {
    if (onSelect) onSelect(id);
    else setInternal(id);
  };

  return (
    <nav className={cx("gl-panelside", className)} aria-label={title}>
      <span className="gl-panelside-title">{title}</span>
      <ul className="gl-panelside-list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="gl-panelside-item"
              data-active={item.id === active ? "" : undefined}
              aria-current={item.id === active ? "page" : undefined}
              onClick={() => select(item.id)}
            >
              <span className="gl-panelside-label">{item.label}</span>
              {item.count != null && <span className="gl-panelside-count">{item.count}</span>}
            </button>
          </li>
        ))}
      </ul>
      {footer && <div className="gl-panelside-footer">{footer}</div>}
    </nav>
  );
}

export interface AIInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit" | "value"> {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  /** Shown above the field, e.g. the active model. */
  hint?: React.ReactNode;
  /** Disables submission while a previous request is in flight. */
  busy?: boolean;
  /** Rendered to the left of the field. */
  leading?: React.ReactNode;
}

/**
 * The prompt composer.
 *
 * Grows with its content, submits on Enter (Shift+Enter inserts a newline),
 * and blocks empty or busy submissions rather than firing a request that
 * cannot succeed.
 */
export function AIInput({
  value,
  onValueChange,
  onSubmit,
  hint,
  busy,
  leading,
  placeholder = "Ask anything…",
  className,
  ...rest
}: AIInputProps) {
  const [internal, setInternal] = React.useState("");
  const current = value ?? internal;
  const ref = useRef<HTMLTextAreaElement>(null);

  const set = (next: string) => {
    if (onValueChange) onValueChange(next);
    else setInternal(next);
  };

  // Grow to fit, up to a cap so a long paste does not push the page around.
  // The measured height also decides the field's shape: pill while it is one
  // line, relaxing toward the stacked radius as it becomes a paragraph, since
  // a full capsule around a tall field bulges at the waist.
  const [lines, setLines] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 200);
    el.style.height = `${next}px`;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 21;
    setLines(Math.max(1, Math.round(next / (lineHeight + 6))));
  }, [current]);

  const submit = () => {
    const trimmed = current.trim();
    if (!trimmed || busy) return;
    onSubmit?.(trimmed);
    if (!onValueChange) setInternal("");
  };

  return (
    <div className={cx("gl-ai-input", className)} data-busy={busy ? "" : undefined}>
      {hint && <div className="gl-ai-input-hint">{hint}</div>}

      <div
        className="gl-ai-input-field"
        data-grown={lines > 1 ? "" : undefined}
        style={{ "--gl-ai-input-lines": lines } as React.CSSProperties}
      >
        {leading && <div className="gl-ai-input-leading">{leading}</div>}

        <textarea
          ref={ref}
          value={current}
          placeholder={placeholder}
          rows={1}
          onChange={(event) => set(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          {...rest}
        />

        <button
          type="button"
          className="gl-ai-input-send"
          onClick={submit}
          disabled={busy || !current.trim()}
          aria-label={busy ? "Sending" : "Send prompt"}
        >
          {busy ? <span className="gl-ai-input-sending" aria-hidden /> : "↑"}
        </button>
      </div>
    </div>
  );
}
