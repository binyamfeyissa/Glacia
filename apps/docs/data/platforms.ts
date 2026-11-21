import { componentSlugs } from "./component-slugs";

// The two platforms Glacia documents.
//
// They are kept in one place because the doc site, the header switcher, the
// search and every page header need to agree on the same names, package and
// install command. `glacia` is the React web package and `glacia-native` the
// React Native / Expo one; both are real workspace packages, so the strings
// below are the actual import paths rather than aspirational ones.

export type Platform = "web" | "mobile";

export interface PlatformMeta {
  id: Platform;
  /** Shown in the switcher: Web / Mobile. */
  label: string;
  /** The npm package this platform documents. */
  pkg: string;
  /** How the docs import it. */
  importExample: string;
  /** The command a developer runs first. */
  install: string;
  /** What glacia depends on to render glass on this platform. */
  runtime: string;
}

export const PLATFORMS: Record<Platform, PlatformMeta> = {
  web: {
    id: "web",
    label: "Web",
    pkg: "glacia",
    importExample: 'import { Button, Card } from "glacia";',
    install: "npm install glacia",
    runtime: "React 18+ · browser with backdrop-filter: url() for refraction",
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    pkg: "glacia-native",
    importExample: 'import { Button, Card } from "glacia-native";',
    install: "npx expo install glacia-native",
    runtime: "React Native 0.80+ · iOS 26 UIGlassEffect, translucent fallback elsewhere",
  },
};

export const PLATFORM_ORDER: Platform[] = ["web", "mobile"];

export const isPlatform = (value: string): value is Platform =>
  value === "web" || value === "mobile";

/** `/platform/components/button` and friends, kept out of the JSX. */
export const platformHref = (platform: Platform, ...segments: string[]): string =>
  ["/platform", platform, ...segments].join("/");

export const platformFromPathname = (pathname: string): Platform | null => {
  const match = pathname.match(/^\/platform\/(web|mobile)(\/|$)/);
  return match ? (match[1] as Platform) : null;
};

/** Sections that exist as routes under both platforms. */
const SHARED_SECTIONS = new Set([
  "getting-started",
  "installation",
  "components",
  "blocks",
  "charts",
  "hooks",
  "theming",
  "styling",
  "sizing",
  "performance",
  "accessibility",
  "troubleshooting",
  "upgrading",
]);

/**
 * Swapping platform keeps the reader on the same page when that page exists
 * on the other platform: /platform/web/getting-started becomes
 * /platform/mobile/getting-started, and a component page swaps only when the
 * other platform ships that component. Anything else falls back to the other
 * platform's home or section index, so the switcher never links to a 404.
 */
export const counterpartPath = (pathname: string, to: Platform): string => {
  const home = `/platform/${to}`;
  const targetSlugs = new Set(componentSlugs(to));

  const componentPage = pathname.match(/^(?:\/platform\/(?:web|mobile))?\/components\/([a-z0-9-]+)$/);
  if (componentPage) {
    const slug = componentPage[1];
    return targetSlugs.has(slug) ? `${home}/components/${slug}` : `${home}/components`;
  }

  const platformSection = pathname.match(/^\/platform\/(?:web|mobile)\/([a-z-]+)(\/.*)?$/);
  if (platformSection && SHARED_SECTIONS.has(platformSection[1])) {
    return `${home}/${platformSection[1]}${platformSection[2] ?? ""}`;
  }

  if (pathname === "/components") return `${home}/components`;
  if (pathname === "/blocks" || pathname.startsWith("/blocks/")) return `${home}/blocks`;

  return home;
};
