import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";
import { COMPONENTS_DATA } from "../data/components-data";
import { NATIVE_COMPONENTS } from "../data/platform-components";
import { BLOCKS } from "../data/blocks-data";
import { GUIDES } from "../data/guides-data";

// The site is exported statically, so this route must not be treated as
// dynamic: without it the export fails while collecting page data.
export const dynamic = "force-static";

/**
 * Sitemap built from the same arrays that generate the routes.
 *
 * Nothing here is hand-listed, so a new component or guide appears in the
 * sitemap as soon as its data entry exists. Redirect-only aliases (`/docs/web`,
 * `/docs/mobile`) and `/build-report` are excluded: a canonical sitemap should
 * contain final URLs only.
 */

/** Sections of the manual that exist on both platforms. */
const PLATFORM_SECTIONS = [
  "installation",
  "getting-started",
  "components",
  "charts",
  "blocks",
  "hooks",
  "theming",
  "styling",
  "sizing",
  "performance",
  "accessibility",
  "troubleshooting",
  "upgrading",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  const pages: MetadataRoute.Sitemap = [
    entry("/", 1, "weekly"),
    entry("/templates", 0.8, "monthly"),
    entry("/guides", 0.8, "weekly"),
  ];

  for (const platform of ["web", "mobile"] as const) {
    pages.push(entry(`/platform/${platform}`, 0.9, "weekly"));
    for (const section of PLATFORM_SECTIONS) {
      pages.push(entry(`/platform/${platform}/${section}`, 0.7, "monthly"));
    }
  }

  for (const component of COMPONENTS_DATA) {
    pages.push(entry(`/platform/web/components/${component.slug}`, 0.8, "monthly"));
  }

  for (const component of NATIVE_COMPONENTS) {
    pages.push(entry(`/platform/mobile/components/${component.slug}`, 0.8, "monthly"));
  }

  // Blocks are web-only: they are assembled from web components.
  for (const block of BLOCKS) {
    pages.push(entry(`/blocks/${block.slug}`, 0.6, "monthly"));
  }

  for (const guide of GUIDES) {
    pages.push(entry(`/guides/${guide.slug}`, 0.7, "monthly"));
  }

  return pages;
}
