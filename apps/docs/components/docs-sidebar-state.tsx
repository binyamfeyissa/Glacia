"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ChevronDownIcon } from "./icons";

/**
 * Sidebar state persistence.
 *
 * The docs sidebar is a server component that remounts on every navigation,
 * so its scroll position used to reset to the top on each click — and on
 * mobile the navigation drawer closed as well. These client wrappers remember
 * the state in localStorage (per platform, so the web and mobile manuals keep
 * separate positions):
 *
 * - which page is active: rendered server-side as aria-current="page" (see
 *   DocsSidebar's activeComponent prop); on a first visit with no saved
 *   scroll, the active link is scrolled into view.
 * - the sidebar scroll position: saved continuously while scrolling and on
 *   pagehide/unmount, restored before paint on the next page.
 * - mobile: whether the navigation drawer was open, plus its panel scroll.
 *
 * localStorage (not sessionStorage) so the position survives a reload and a
 * new tab, and so Back returns to exactly where the reader was.
 */

const scrollKey = (scope: string) => `glacia:docs-nav-scroll:${scope}`;
const mobileOpenKey = (scope: string) => `glacia:docs-mobile-nav-open:${scope}`;
const mobileScrollKey = (scope: string) => `glacia:docs-mobile-nav-scroll:${scope}`;

function readScroll(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeScroll(key: string, value: number) {
  try {
    localStorage.setItem(key, String(Math.max(0, Math.round(value))));
  } catch {
    // Storage unavailable (private mode, blocked cookies) — the sidebar
    // simply starts at the top, as before.
  }
}

/** Bring the active link into view inside a scroll container, if it is not already. */
function revealActive(container: HTMLElement) {
  // Prefer the component sub-link: the "Components" section link also carries
  // aria-current="page" and sits near the top, so a plain [aria-current]
  // query would find it first and never scroll to the actual component.
  const active =
    container.querySelector("a.docs-nav-link-sub[aria-current='page']") ??
    container.querySelector('[aria-current="page"]');
  if (!(active instanceof HTMLElement)) return;
  const containerRect = container.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
    container.scrollTop += rect.top - containerRect.top - 12;
  }
}

/**
 * Saves a scroll container's position to localStorage while the reader scrolls
 * and at the moment they click a link inside it — synchronously, before
 * navigation starts. Deliberately NOT saved from the effect cleanup: by the
 * time React unmounts the tree the node can already be detached, and a
 * detached node reads scrollTop 0, which would clobber the real position.
 */
function usePersistentScroll(ref: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pending = false;
    const save = () => writeScroll(key, el.scrollTop);
    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        save();
      });
    };
    // A click on a nav link starts navigation; record the position now, while
    // the node is still attached.
    const onClick = () => save();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("click", onClick, { capture: true });
    window.addEventListener("pagehide", save);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("pagehide", save);
    };
  }, [ref, key]);
}

/**
 * The desktop sidebar scroll container (`.docs-side-inner`). Restores the
 * saved scroll position before paint; with no saved position, reveals the
 * active page instead of leaving it below the fold.
 */
export function DocsSidebarScroll({
  storageKey,
  children,
}: {
  storageKey: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const key = scrollKey(storageKey);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If the container is already scrolled — the reader got there before
    // hydration, or the browser restored it — leave it alone.
    if (el.scrollTop !== 0) return;
    const saved = readScroll(key);
    if (saved !== null) {
      el.scrollTop = saved;
      return;
    }
    revealActive(el);
  }, [key]);

  usePersistentScroll(ref, key);

  return (
    <div className="docs-side-inner" ref={ref}>
      {children}
    </div>
  );
}

/**
 * The mobile navigation drawer (`.docs-mobile-nav`). Remembers whether it was
 * open and the panel's scroll position, so opening a component from the
 * drawer returns the reader to the same drawer state.
 */
export function DocsMobileNav({
  storageKey,
  summary,
  children,
}: {
  storageKey: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openKey = mobileOpenKey(storageKey);
  const key = mobileScrollKey(storageKey);

  // localStorage is client-only: start closed (matching the server render)
  // and restore the remembered open state after mount.
  useEffect(() => {
    try {
      if (localStorage.getItem(openKey) === "1") setOpen(true);
    } catch {
      // Storage unavailable — the drawer simply starts closed, as before.
    }
  }, [openKey]);

  useEffect(() => {
    try {
      localStorage.setItem(openKey, open ? "1" : "0");
    } catch {
      // Ignore storage failures.
    }
  }, [open, openKey]);

  // Restore the panel scroll whenever the drawer opens. With no saved
  // position, reveal the active page instead. If the panel is already
  // scrolled (reader got there first), leave it alone.
  useLayoutEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    if (el.scrollTop !== 0) return;
    const saved = readScroll(key);
    if (saved !== null) {
      el.scrollTop = saved;
      return;
    }
    revealActive(el);
  }, [open, key]);

  usePersistentScroll(panelRef, key);

  return (
    <details
      className="docs-mobile-nav"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        {summary}
        <ChevronDownIcon width={14} height={14} />
      </summary>
      <div className="docs-mobile-nav-panel" ref={panelRef}>
        {children}
      </div>
    </details>
  );
}
