"use client";

import { useMemo } from "react";
import Link from "next/link";

import { COMPONENTS_DATA } from "../data/components-data";
import { NATIVE_COMPONENTS } from "../data/platform-components";
import { PLATFORMS, PLATFORM_ORDER, platformHref, type Platform } from "../data/platforms";
import { docSections } from "../data/doc-nav";

export interface SearchHit {
  key: string;
  title: string;
  description: string;
  /** Where this hit belongs: a platform edition, or the shared site. */
  scope: string;
  href: string;
  kind: "component" | "guide" | "block";
}

// One index over everything the docs contain, so a search can cross platforms
// and sections instead of only matching the current page's components.
export function buildSearchIndex(blocks: { slug: string; title: string; description: string }[]): SearchHit[] {
  const hits: SearchHit[] = [];

  for (const platform of PLATFORM_ORDER) {
    const meta = PLATFORMS[platform];

    // Guides for this platform
    for (const section of docSections(platform)) {
      hits.push({
        key: `${platform}:guide:${section.slug}`,
        title: section.title,
        description: section.summary,
        scope: `${meta.label} guide`,
        href: platformHref(platform, section.slug),
        kind: "guide",
      });
    }

    // Components for this platform
    const components =
      platform === "web"
        ? COMPONENTS_DATA.map((c) => ({ slug: c.slug, name: c.name, description: c.description }))
        : NATIVE_COMPONENTS.map((c) => ({ slug: c.slug, name: c.name, description: c.description }));

    for (const component of components) {
      hits.push({
        key: `${platform}:component:${component.slug}`,
        title: component.name,
        description: component.description,
        scope: `${meta.label} · ${meta.pkg}`,
        href: platformHref(platform, "components", component.slug),
        kind: "component",
      });
    }
  }

  for (const block of blocks) {
    hits.push({
      key: `site:block:${block.slug}`,
      title: block.title,
      description: block.description,
      scope: "Blocks",
      href: `/blocks/${block.slug}`,
      kind: "block",
    });
  }

  return hits;
}

/** Ranks a hit: exact title match first, then prefix, then substring. */
function score(hit: SearchHit, query: string): number {
  const title = hit.title.toLowerCase();
  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  if (hit.description.toLowerCase().includes(query)) return 30;
  if (hit.scope.toLowerCase().includes(query)) return 20;
  return 0;
}

export function useSearch(index: SearchHit[], query: string, platform: Platform): SearchHit[] {
  return useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const scopeLabel = PLATFORMS[platform].label;

    return index
      .map((hit) => {
        // Prefer the current platform's edition of anything that exists twice.
        const boost = hit.scope.startsWith(scopeLabel) ? 25 : 0;
        return { hit, score: score(hit, value) + boost };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.hit);
  }, [index, query, platform]);
}

export function SearchResults({ hits }: { hits: SearchHit[] }) {
  return (
    <div className="search-results">
      {hits.map((hit) => (
        <Link key={hit.key} href={hit.href} className="search-result">
          <span className="search-result-mark">
            {hit.kind === "guide" ? "§" : hit.kind === "block" ? "▤" : hit.title.slice(0, 1)}
          </span>
          <span className="search-result-copy">
            <span className="search-result-name">{hit.title}</span>
            <span className="search-result-desc">{hit.description}</span>
          </span>
          <span className="search-result-cat">{hit.scope}</span>
        </Link>
      ))}
    </div>
  );
}
