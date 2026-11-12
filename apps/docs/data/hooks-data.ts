import type { Platform } from "../data/platforms";
import { platformHref } from "../data/platforms";

// The hooks reference. It lives outside the shared section copy because hooks
// need signature-level detail, not prose: each one gets its import, signature,
// what it returns and the behaviour a caller would otherwise get wrong.

export interface HookDoc {
  name: string;
  summary: string;
  signature: string;
  returns: string;
  notes: string[];
  example: string;
}

export interface HookGroup {
  title: string;
  description: string;
  hooks: HookDoc[];
}

export const HOOK_GROUPS: HookGroup[] = [
  {
    title: "State and data",
    description: "Small pieces of state that most apps rewrite badly.",
    hooks: [
      {
        name: "useDisclosure",
        summary: "Open/closed state with the ARIA wiring a disclosure needs.",
        signature: "useDisclosure(initial = false, id?: string)",
        returns: "{ open, setOpen, toggle, triggerProps, contentProps }",
        notes: [
          "Spread triggerProps onto the trigger and contentProps onto the panel: it supplies matching aria-controls and id, plus aria-expanded.",
          "Pass an id when the panel must be addressable from outside, e.g. by a skip link.",
        ],
        example: `const { open, triggerProps, contentProps } = useDisclosure();

<button {...triggerProps}>Details</button>
<div {...contentProps}>{open && <p>Hidden until opened.</p>}</div>`,
      },
      {
        name: "useDebouncedValue",
        summary: "A debounced view of a value, for search fields and expensive consumers.",
        signature: "useDebouncedValue<T>(value: T, delay = 300)",
        returns: "T",
        notes: [
          "The input stays responsive; only the returned value lags behind.",
          "Every change resets the timer, so a fast typist produces one update, not one per keystroke.",
        ],
        example: `const [query, setQuery] = useState("");
const debounced = useDebouncedValue(query, 300);

useEffect(() => { if (debounced) search(debounced); }, [debounced]);`,
      },
      {
        name: "usePrevious",
        summary: "The value from the previous render.",
        signature: "usePrevious<T>(value: T)",
        returns: "T | undefined",
        notes: [
          "Updates in an effect rather than during render, so it is safe under concurrent rendering.",
          "Returns undefined until a second render has committed.",
        ],
        example: `const previousCount = usePrevious(count);
const direction = previousCount == null ? 0 : Math.sign(count - previousCount);`,
      },
      {
        name: "useSkeletonHandoff",
        summary: "Swaps a skeleton for real content after the content has painted.",
        signature: "useSkeletonHandoff(loading: boolean, minimumMs = 0)",
        returns: "boolean — whether to show the skeleton",
        notes: [
          "Waits two frames after loading ends, which avoids a flash of unpainted content.",
          "Set minimumMs to stop a fast response from flickering the skeleton on and off.",
        ],
        example: `const showSkeleton = useSkeletonHandoff(loading, 300);

return showSkeleton ? <Shimmer /> : <Article data={data} />;`,
      },
    ],
  },
  {
    title: "Input and platform",
    description: "Keyboard, clipboard, direction and viewport behaviour.",
    hooks: [
      {
        name: "useCopyToClipboard",
        summary: "Copies text and reports success, failure and the reset.",
        signature: "useCopyToClipboard(resetAfter = 1600)",
        returns: "{ copy, copied, error }",
        notes: [
          "copied flips back to false on its own, so a checkmark needs no extra timer.",
          "Clipboard access can be refused; error is surfaced rather than swallowed, so a button can say it failed.",
        ],
        example: `const { copy, copied, error } = useCopyToClipboard();

<button onClick={() => copy(source)}>
  {copied ? "Copied" : error ? "Copy failed" : "Copy"}
</button>`,
      },
      {
        name: "useKeyboard",
        summary: "Document-level key handlers, stored so they never re-bind per render.",
        signature: "useKeyboard(handlers, { allowInInputs = false })",
        returns: "void",
        notes: [
          "Keys typed into inputs, textareas and contenteditable elements are ignored unless allowInInputs is set, so a single-letter shortcut cannot fire mid-sentence.",
          "Handlers are held in a ref, so a new inline function each render does not re-register listeners.",
        ],
        example: `useKeyboard({
  Escape: () => setOpen(false),
  "?": () => setHelpOpen(true),
});`,
      },
      {
        name: "useDirectionSign",
        summary: "A +1 or −1 multiplier for directional offsets in RTL layouts.",
        signature: "useDirectionSign()",
        returns: "1 | -1",
        notes: [
          "Reads the existing DirectionProvider context, so it agrees with every component that already flips for RTL.",
          "Multiplying an x-offset by the sign is less error-prone than branching on direction at each call site.",
        ],
        example: `const sign = useDirectionSign();
const offset = sign * 12; // flips in RTL`,
      },
      {
        name: "useBreakpoint",
        summary: "The current responsive breakpoint.",
        signature: "useBreakpoint()",
        returns: '"xs" | "sm" | "md" | "lg" | "xl"',
        notes: [
          'Reports "xs" during server rendering and the first client render, so hydration markup matches on both sides.',
          "Breakpoints: sm 640, md 768, lg 1024, xl 1280.",
        ],
        example: `const breakpoint = useBreakpoint();
const columns = breakpoint === "xs" ? 1 : breakpoint === "sm" ? 2 : 3;`,
      },
      {
        name: "useMediaQuery",
        summary: "Whether a media query currently matches.",
        signature: "useMediaQuery(query: string)",
        returns: "boolean",
        notes: [
          "Returns false until mounted, keeping server and first client render identical.",
          "Subscribes to changes, so the value updates when the OS setting changes.",
        ],
        example: `const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");`,
      },
      {
        name: "useThemeMode",
        summary: "Theme preference with an explicit light / dark / system choice.",
        signature: "useThemeMode(storageKey = 'glacia-theme')",
        returns: "{ mode, setMode, resolved }",
        notes: [
          "mode is what the user chose; resolved is what to paint with when mode is system.",
          "Tracks the OS setting live in system mode and persists the choice to localStorage.",
        ],
        example: `const { mode, setMode, resolved } = useThemeMode();

<ThemeToggle value={mode} onChange={setMode} />
<div data-theme={resolved} />`,
      },
      {
        name: "useTheme",
        summary: "The resolved theme alone, when the mode plumbing is not needed.",
        signature: "useTheme()",
        returns: '{ theme: "light" | "dark", mode, setMode }',
        notes: ["A thin alias over useThemeMode for callers that only need the resolved value."],
        example: `const { theme } = useTheme();`,
      },
      {
        name: "useKeyboardAvoidance",
        summary: "The on-screen keyboard's height, measured from the visual viewport.",
        signature: "useKeyboardAvoidance()",
        returns: "number — keyboard inset in pixels",
        notes: [
          "Uses window.visualViewport, which is the only reliable keyboard signal in a browser.",
          "Returns 0 when the API is unavailable, so layouts degrade instead of breaking.",
        ],
        example: `const inset = useKeyboardAvoidance();

<div style={{ paddingBottom: inset }}><Composer /></div>`,
      },
      {
        name: "useBackHandler",
        summary: "Consumes the browser's back gesture, for closing overlays in order.",
        signature: "useBackHandler(onBack: () => boolean, enabled = true)",
        returns: "void",
        notes: [
          "Returning true keeps the page (the overlay closed itself); returning false lets the navigation proceed.",
          "Only the topmost armed handler runs, so nested overlays close innermost-first.",
          "Cleans up by spending its history entry, so leaving the page does not strand the user a press away.",
        ],
        example: `useBackHandler(() => {
  if (!open) return false;
  setOpen(false);
  return true;
}, open);`,
      },
    ],
  },
  {
    title: "Scroll and reveal",
    description: "Reading position, without a layout read on every scroll event.",
    hooks: [
      {
        name: "useScrollSections",
        summary: "Which section is in view and how far through each the reader is.",
        signature: "useScrollSections(ids: string[])",
        returns: "{ activeId, sections: { id, progress }[] }",
        notes: [
          "Measures all sections from one scroll listener rather than one observer per section, so a long document stays cheap.",
          "Progress is a fraction of each section that has scrolled past.",
        ],
        example: `const { activeId, sections } = useScrollSections(["intro", "api", "examples"]);

<SectionRail items={sections} active={activeId} />`,
      },
      {
        name: "useRevealProgress",
        summary: "How far a single element has been revealed, from 0 to 1.",
        signature: "useRevealProgress<T extends HTMLElement>()",
        returns: "{ ref, progress, visible }",
        notes: [
          "Scroll reads are throttled to one per animation frame, avoiding layout thrash.",
          "progress reaches 1 when the element's bottom passes the top of the viewport.",
        ],
        example: `const { ref, progress, visible } = useRevealProgress();

<section ref={ref} style={{ opacity: visible ? 1 : 0.4 }}>
  <Progress value={progress} />
</section>`,
      },
    ],
  },
];

export const HOOK_COUNT = HOOK_GROUPS.reduce((sum, group) => sum + group.hooks.length, 0);

export function hooksMeta(platform: Platform) {
  return {
    title: "Hooks",
    description:
      platform === "web"
        ? `The ${HOOK_COUNT} hooks glacia ships. They are plain React with no dependency on the glass engine, so they also work in a glacia-native app.`
        : `The ${HOOK_COUNT} hooks from the web package. They are plain React with no DOM-heavy assumptions, so they can be imported beside glacia-native components.`,
    canonical: platformHref(platform, "hooks"),
  };
}
