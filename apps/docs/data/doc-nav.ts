import type { Platform } from "./platforms";

// The documentation tree. Each platform renders the same skeleton but with
// its own copy, so a reader never sees web instructions in the mobile docs.
//
// `components` is the only section whose children come from the live component
// catalogue rather than a static list; the page reads it from the platform
// registry so it can never drift from what actually ships.

export interface DocSection {
  /** URL segment under /platform/<platform>/ */
  slug: string;
  title: string;
  /** One-line summary used in indexes and search results. */
  summary: string;
  group: DocGroupId;
  /** False when this platform has no such page (linked but not built). */
  available?: boolean;
}

export type DocGroupId = "start" | "library" | "customize" | "advanced";

export interface DocGroup {
  id: DocGroupId;
  title: string;
}

export const DOC_GROUPS: DocGroup[] = [
  { id: "start", title: "Getting started" },
  { id: "library", title: "Library" },
  { id: "customize", title: "Customization" },
  { id: "advanced", title: "Advanced" },
];

/** Sections present on both platforms. The copy differs per platform. */
const SHARED_SECTIONS: Omit<DocSection, "summary">[] = [
  { slug: "getting-started", title: "Getting started", group: "start" },
  { slug: "installation", title: "Installation", group: "start" },
  { slug: "components", title: "Components", group: "library" },
  { slug: "blocks", title: "Blocks", group: "library" },
  { slug: "charts", title: "Charts", group: "library" },
  { slug: "hooks", title: "Hooks", group: "library" },
  { slug: "theming", title: "Theming", group: "customize" },
  { slug: "styling", title: "Styling", group: "customize" },
  { slug: "sizing", title: "Sizing", group: "customize" },
  { slug: "performance", title: "Performance", group: "advanced" },
  { slug: "accessibility", title: "Accessibility", group: "advanced" },
  { slug: "troubleshooting", title: "Troubleshooting", group: "advanced" },
  { slug: "upgrading", title: "Upgrading", group: "advanced" },
];

const SUMMARIES: Record<Platform, Record<string, string>> = {
  web: {
    "getting-started": "Render your first Liquid Glass surface in a browser.",
    installation: "Install the glacia package and import its stylesheet.",
    components: "Every React web component, grouped by what it does.",
    blocks: "Composed, ready-to-use page sections.",
    charts: "Data visualization built on shared chart primitives.",
    hooks: "Fifteen hooks for clipboard, layout, theme and scroll.",
    theming: "Light, dark and custom themes through --gl-* tokens.",
    styling: "ClassName, CSS variables and the stylesheet contract.",
    sizing: "Control heights, icon sizes and radii.",
    performance: "Keeping refraction cheap on large pages.",
    accessibility: "Focus, keyboard and screen-reader behaviour on the web.",
    troubleshooting: "When refraction does not appear.",
    upgrading: "Moving between glacia versions.",
  },
  mobile: {
    "getting-started": "Render your first Liquid Glass surface in Expo.",
    installation: "Install glacia-native with Expo.",
    components: "Every React Native component, grouped by what it does.",
    blocks: "Composed, ready-to-use app sections.",
    charts: "Data visualization sized for touch.",
    hooks: "The web hooks, usable alongside glacia-native.",
    theming: "Light, dark and custom themes on native.",
    styling: "Style props and the shared token contract.",
    sizing: "Touch targets, control heights and radii.",
    performance: "Keeping glass cheap on device.",
    accessibility: "VoiceOver, TalkBack and touch target behaviour.",
    troubleshooting: "When glass falls back to a tint.",
    upgrading: "Moving between glacia-native versions.",
  },
};

export const docSections = (platform: Platform): DocSection[] =>
  SHARED_SECTIONS.map((section) => ({
    ...section,
    summary: SUMMARIES[platform][section.slug] ?? "",
  }));

export const findSection = (platform: Platform, slug: string): DocSection | undefined =>
  docSections(platform).find((section) => section.slug === slug);
