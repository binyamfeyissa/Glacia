import Link from "next/link";
import type { ReactNode } from "react";

import { DocsMobileNav, DocsSidebarScroll } from "./docs-sidebar-state";
import { DocsSidebar } from "./docs-sidebar";
import { PLATFORMS, platformHref, type Platform } from "../data/platforms";

export interface PlatformPageProps {
  platform: Platform;
  /** The section slug this page belongs to, e.g. "installation". */
  current: string;
  /** Slug of the component page being viewed, so its sidebar link is marked active. */
  activeComponent?: string;
  title: string;
  kicker?: string;
  description?: string;
  children: ReactNode;
}

/**
 * The frame every platform documentation page sits in: sidebar, breadcrumbs,
 * a platform-stamped header, and the content. Keeping it in one component is
 * what guarantees /platform/web/* and /platform/mobile/* read as two editions
 * of the same manual rather than two different sites.
 */
export function PlatformPage({
  platform,
  current,
  activeComponent,
  title,
  kicker,
  description,
  children,
}: PlatformPageProps) {
  const meta = PLATFORMS[platform];

  return (
    <div className="docs-shell">
      <aside className="docs-side">
        <DocsSidebarScroll storageKey={`platform:${platform}`}>
          <Link href={platformHref(platform)} className="docs-side-back">
            {meta.label} docs
          </Link>
          <DocsSidebar platform={platform} current={current} activeComponent={activeComponent} />
        </DocsSidebarScroll>
      </aside>

      <article className="docs-main">
        <DocsMobileNav storageKey={`platform:${platform}`} summary={`Browse ${meta.label} docs`}>
          <DocsSidebar platform={platform} current={current} activeComponent={activeComponent} />
        </DocsMobileNav>

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={platformHref(platform)}>{meta.label}</Link>
          <span>/</span>
          <span>{title}</span>
        </nav>

        <header className="docs-header">
          <p className="docs-kicker">{kicker ?? `${meta.label} · ${meta.pkg}`}</p>
          <h1 className="docs-title">{title}</h1>
          {description && <p className="docs-desc">{description}</p>}
        </header>

        <div className="platform-page-body">{children}</div>
      </article>
    </div>
  );
}
