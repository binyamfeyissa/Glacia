"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text to the clipboard and reports the result.
 *
 * `copied` flips back to false on its own, so a button can show a checkmark
 * for a moment without the caller wiring a timer. `error` is surfaced rather
 * than swallowed: clipboard access is refused in some browsers and contexts,
 * and a silent failure looks like a working button.
 */
export function useCopyToClipboard(resetAfter = 1600) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      setError(null);
      try {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
          throw new Error("Clipboard API is unavailable");
        }
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch (cause) {
        setError(cause instanceof Error ? cause : new Error("Copy failed"));
        setCopied(false);
        return false;
      }
    },
    [resetAfter],
  );

  return { copy, copied, error } as const;
}

/**
 * A debounced view of a value.
 *
 * Useful for search fields: the input stays responsive while the expensive
 * consumer only sees the value once typing has paused.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/**
 * The value from the previous render.
 *
 * Unlike a ref written during render, this updates in an effect, so it is safe
 * under concurrent rendering and never produces a torn read.
 */
export function usePrevious<T>(value: T): T | undefined {
  const [previous, setPrevious] = useState<T | undefined>(undefined);
  const current = useRef(value);

  useEffect(() => {
    setPrevious(current.current);
    current.current = value;
  }, [value]);

  return previous;
}

export interface Disclosure {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  /** Props to spread onto the trigger button. */
  triggerProps: {
    "aria-expanded": boolean;
    "aria-controls": string;
    onClick: () => void;
  };
  /** Props to spread onto the controlled panel. */
  contentProps: {
    id: string;
    hidden: boolean;
  };
}

/**
 * Open/closed state with the ARIA wiring a disclosure needs.
 *
 * The trigger and panel are given matching `aria-controls`/`id` pairs and the
 * trigger reports `aria-expanded`, which is what makes a disclosure usable
 * with a screen reader rather than just a toggle.
 */
export function useDisclosure(initial = false, id?: string): Disclosure {
  const [open, setOpen] = useState(initial);
  // A stable fallback id keeps trigger/panel linked without useId, so the hook
  // works in any React tree including tests that render outside a provider.
  const generated = useRef(id ?? `gl-disclosure-${Math.random().toString(36).slice(2, 9)}`);
  const panelId = generated.current;

  const toggle = useCallback(() => setOpen((value) => !value), []);

  return {
    open,
    setOpen,
    toggle,
    triggerProps: {
      "aria-expanded": open,
      "aria-controls": panelId,
      onClick: toggle,
    },
    contentProps: {
      id: panelId,
      hidden: !open,
    },
  } as const;
}

/**
 * Arbitrary key handlers bound to the document.
 *
 * The handler is held in a ref so changing callbacks do not re-bind listeners
 * on every render. Events from text inputs are ignored unless
 * `allowInInputs` is set, which is what stops a global "s" shortcut from
 * firing while someone is typing.
 */
export function useKeyboard(
  handlers: Record<string, (event: KeyboardEvent) => void>,
  options: { allowInInputs?: boolean; target?: Window | Document | HTMLElement | null } = {},
) {
  const { allowInInputs = false, target } = options;
  const stored = useRef(handlers);
  stored.current = handlers;

  useEffect(() => {
    const node: Window | Document | HTMLElement =
      target ?? (typeof window !== "undefined" ? window : null) ?? ({} as Window);
    if (!node || !("addEventListener" in node)) return;

    const listener = (event: Event) => {
      const key = (event as KeyboardEvent).key;
      if (!key) return;

      if (!allowInInputs) {
        const el = (event.target as HTMLElement | null) ?? null;
        const tag = el?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || el?.isContentEditable) return;
      }

      const handler = stored.current[key];
      if (handler) handler(event as KeyboardEvent);
    };

    node.addEventListener("keydown", listener as EventListener);
    return () => node.removeEventListener("keydown", listener as EventListener);
  }, [allowInInputs, target]);
}
