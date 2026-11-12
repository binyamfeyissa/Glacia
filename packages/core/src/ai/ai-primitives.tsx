"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

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

export interface ThinkingOrbProps {
  /** What the model is doing, announced to assistive technology. */
  label?: string;
  size?: number;
  /** Stop the animation without unmounting the orb. */
  paused?: boolean;
  className?: string;
}

/**
 * A small animated indicator that a model is working.
 *
 * The animation is decorative, so it is hidden from assistive technology and
 * replaced by a live region carrying `label` — a screen reader should hear
 * "Thinking" once, not an endlessly animating element.
 */
export function ThinkingOrb({ label = "Thinking", size = 22, paused, className }: ThinkingOrbProps) {
  return (
    <span className={cx("gl-thinking-orb", className)} data-paused={paused ? "" : undefined}>
      <span
        className="gl-thinking-orb-canvas"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <span className="gl-thinking-orb-ring" />
        <span className="gl-thinking-orb-core" />
      </span>
      <span className="gl-sr-only" role="status">
        {label}
      </span>
    </span>
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
    <div className={cx("gl-plan", className)}>
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

export interface Source {
  id: string;
  title: string;
  url: string;
  /** Short excerpt shown under the title. */
  snippet?: string;
  /** Domain, shown as the source's origin. */
  domain?: string;
}

export interface SourcesProps {
  sources: Source[];
  title?: string;
  className?: string;
}

/** Citations behind an answer, so a claim can be traced to its origin. */
export function Sources({ sources, title = "Sources", className }: SourcesProps) {
  if (sources.length === 0) return null;

  return (
    <div className={cx("gl-sources", className)}>
      <span className="gl-sources-title">{title}</span>
      <ol className="gl-sources-list">
        {sources.map((source, index) => (
          <li key={source.id}>
            <a className="gl-sources-item" href={source.url} target="_blank" rel="noreferrer noopener">
              <span className="gl-sources-index">{index + 1}</span>
              <span className="gl-sources-copy">
                <span className="gl-sources-name">{source.title}</span>
                {source.snippet && <span className="gl-sources-snippet">{source.snippet}</span>}
                {source.domain && <span className="gl-sources-domain">{source.domain}</span>}
              </span>
            </a>
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

/**
 * An animated waveform that responds to audio level.
 *
 * Bars are driven by a `level` per bar rather than random animation, so it can
 * show real microphone amplitude; with no level supplied it falls back to a
 * gentle idle motion.
 */
export function Soundwave({
  levels,
  bars = 28,
  active = true,
  height = 40,
  color,
  className,
  label = "Audio level",
}: {
  levels?: number[];
  bars?: number;
  active?: boolean;
  height?: number;
  color?: string;
  className?: string;
  label?: string;
}) {
  const count = levels?.length || bars;

  return (
    <div
      className={cx("gl-soundwave", className)}
      style={{ height, color }}
      data-active={active ? "" : undefined}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: count }, (_, i) => {
        const level = levels ? levels[i] ?? 0 : null;
        const scale = level == null ? null : Math.max(0.06, Math.min(1, level));
        return (
          <span
            key={i}
            className="gl-soundwave-bar"
            style={
              scale == null
                ? { animationDelay: `${(i % 9) * 70}ms` }
                : { transform: `scaleY(${scale})`, animation: "none" }
            }
          />
        );
      })}
    </div>
  );
}

/** Progress of a long-running background task. */
export interface TaskProgress {
  /** 0–1, or omit for an indeterminate task. */
  progress?: number;
  label?: string;
  detail?: string;
  status?: "running" | "done" | "failed" | "queued";
}

export function Task({ task, className }: { task: TaskProgress; className?: string }) {
  const percent = task.progress == null ? null : Math.round(Math.min(1, Math.max(0, task.progress)) * 100);

  return (
    <div className={cx("gl-task", className)} data-status={task.status ?? "running"}>
      <div className="gl-task-head">
        <span className="gl-task-label">{task.label ?? "Task"}</span>
        <span className="gl-task-value">{percent == null ? "…" : `${percent}%`}</span>
      </div>

      <div
        className="gl-task-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
        aria-label={task.label ?? "Task progress"}
      >
        <span
          className="gl-task-fill"
          data-indeterminate={percent == null ? "" : undefined}
          style={percent == null ? undefined : { width: `${percent}%` }}
        />
      </div>

      {task.detail && <span className="gl-task-detail">{task.detail}</span>}
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
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
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

      <div className="gl-ai-input-field">
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
          {busy ? <ThinkingOrb size={14} /> : "↑"}
        </button>
      </div>
    </div>
  );
}

/** One generated image, with the prompt that produced it. */
export interface GeneratedImage {
  id: string;
  src: string;
  alt: string;
  prompt?: string;
  /** Aspect ratio as width / height. */
  ratio?: number;
}

/**
 * A grid of generated images with an in-place generation placeholder.
 *
 * While `generating` is true the first tile shows a shimmer at the requested
 * ratio, so the grid does not reflow when the image lands.
 */
export function ImageGeneration({
  images,
  generating,
  ratio = 1,
  className,
  columns = 2,
}: {
  images: GeneratedImage[];
  generating?: boolean;
  ratio?: number;
  className?: string;
  columns?: number;
}) {
  return (
    <div
      className={cx("gl-image-generation", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {generating && (
        <div
          className="gl-image-generation-tile gl-image-generation-pending"
          style={{ aspectRatio: String(ratio) }}
          role="status"
          aria-label="Generating image"
        >
          <Shimmer lines={2} />
        </div>
      )}

      {images.map((image) => (
        <figure key={image.id} className="gl-image-generation-tile">
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            style={{ aspectRatio: String(image.ratio ?? ratio) }}
          />
          {image.prompt && <figcaption>{image.prompt}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
