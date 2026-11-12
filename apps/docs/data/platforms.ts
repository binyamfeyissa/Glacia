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

/**
 * Swapping platform keeps the reader on the same page: /platform/web/getting-started
 * becomes /platform/mobile/getting-started. Sections that only exist on one
 * platform fall back to that platform's index.
 */
export const counterpartPath = (pathname: string, to: Platform): string => {
  const rest = pathname.replace(/^\/platform\/(web|mobile)/, "");
  return `/platform/${to}${rest || ""}`;
};
