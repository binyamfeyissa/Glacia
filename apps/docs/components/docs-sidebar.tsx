import Link from "next/link";

import { DOC_GROUPS, docSections } from "../data/doc-nav";
import { PLATFORMS, platformHref, type Platform } from "../data/platforms";
import { NATIVE_COMPONENTS } from "../data/platform-components";
import { COMPONENTS_DATA } from "../data/components-data";
import { ChevronDownIcon } from "./icons";

// The category order used by both platforms' component lists.
const WEB_CATEGORIES = [
  "Buttons & Actions",
  "Text & Forms",
  "Showing Things",
  "Navigation & Layout",
  "Popups & Menus",
  "Chat & AI",
] as const;

const NATIVE_CATEGORIES = ["Actions", "Forms", "Navigation", "Layout"] as const;

export function DocsSidebar({ platform, current }: { platform: Platform; current: string }) {
  const sections = docSections(platform);

  // Components are listed inline under the "Components" section so a reader can
  // reach any component in one click, grouped by category.
  const categories = platform === "web" ? WEB_CATEGORIES : NATIVE_CATEGORIES;
  const entries =
    platform === "web"
      ? COMPONENTS_DATA.map((c) => ({ slug: c.slug, name: c.name, category: c.category }))
      : NATIVE_COMPONENTS.map((c) => ({ slug: c.slug, name: c.name, category: c.category }));

  return (
    <nav className="docs-side-nav" aria-label={`${PLATFORMS[platform].label} documentation`}>
      {DOC_GROUPS.map((group) => {
        const items = sections.filter((s) => s.group === group.id);
        if (items.length === 0) return null;
        return (
          <div className="docs-nav-group" key={group.id}>
            <h3>{group.title}</h3>
            {items.map((section) => (
              <div key={section.slug}>
                <Link
                  href={platformHref(platform, section.slug)}
                  className="docs-nav-link"
                  aria-current={current === section.slug ? "page" : undefined}
                >
                  {section.title}
                </Link>
                {section.slug === "components" && (
                  <div className="docs-nav-sub">
                    {categories.map((category) => {
                      const inCategory = entries.filter((e) => e.category === category);
                      if (inCategory.length === 0) return null;
                      return (
                        <div key={category} className="docs-nav-sub-group">
                          <span className="docs-nav-sub-title">{category}</span>
                          {inCategory.map((entry) => (
                            <Link
                              key={entry.slug}
                              href={platformHref(platform, "components", entry.slug)}
                              className="docs-nav-link docs-nav-link-sub"
                            >
                              {entry.name}
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

/** The same navigation, collapsed, for narrow viewports. */
export function DocsMobileNav({ platform, current }: { platform: Platform; current: string }) {
  return (
    <details className="docs-mobile-nav">
      <summary>
        Browse {PLATFORMS[platform].label} docs
        <ChevronDownIcon width={14} height={14} />
      </summary>
      <div className="docs-mobile-nav-panel">
        <DocsSidebar platform={platform} current={current} />
      </div>
    </details>
  );
}
