"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  SearchField,
  NavigationTabs,
} from "glacia";
import { BLOCKS } from "../data/blocks-data";
import { platformFromPathname, type Platform } from "../data/platforms";
import { ThemeToggle } from "./theme-toggle";
import { PlatformSwitcher } from "./platform-switcher";
import { buildSearchIndex, useSearch, SearchResults } from "./search-index";
import {
  ArrowUpRightIcon,
  CloseIcon,
  GithubIcon,
  MenuIcon,
  SearchIcon,
  GridIcon,
  LayersIcon,
  CodeIcon,
  HomeIcon,
  TemplateIcon,
} from "./icons";
import { GlaciaMark } from "./glacia-mark";

const NAV = [
  { id: "overview", href: "/", label: "Overview", icon: <HomeIcon width={14} height={14} /> },
  {
    id: "components",
    href: "/components/button",
    label: "Components",
    match: "/components",
    icon: <GridIcon width={14} height={14} />,
  },
  {
    id: "blocks",
    href: "/blocks/dashboard",
    label: "Blocks",
    match: "/blocks",
    icon: <LayersIcon width={14} height={14} />,
  },
  {
    id: "templates",
    href: "/templates",
    label: "Templates",
    match: "/templates",
    icon: <TemplateIcon width={14} height={14} />,
  },
  {
    id: "build-report",
    href: "/build-report",
    label: "Build report",
    match: "/build-report",
    icon: <CodeIcon width={14} height={14} />,
  },
];

// The nav is the library's own NavigationTabs, so the site's primary
// navigation is the same component developers install.
const toNavigationItems = () =>
  NAV.map((item) => ({ value: item.id, label: item.label, icon: item.icon, href: item.href }));

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // The index covers both platform editions plus the shared blocks, so a
  // search from either manual can reach everything.
  const searchIndex = useMemo(
    () => buildSearchIndex(BLOCKS.map((b) => ({ slug: b.slug, title: b.title, description: b.description }))),
    [],
  );
  const activePlatform: Platform = platformFromPathname(pathname) ?? "web";
  const results = useSearch(searchIndex, query, activePlatform);

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.match ?? item.href);
  };

  const activeNav = NAV.find((item) => isActive(item))?.id ?? null;

  return (
    <>
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <Link href="/" className="brand" aria-label="Glacia home">
            <img
              src="/glacia-logo.png"
              alt="Glacia"
              className="brand-mark-img"
              width={28}
              height={28}
            />
            <span className="brand-name">Glacia</span>
          </Link>
        </div>

        <div className="header-actions">
          <PlatformSwitcher className="header-platform-switch" />
          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Search components"
          >
            <SearchIcon width={15} height={15} />
            <span className="search-trigger-label">Search</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>
          <ThemeToggle />
          <a
            href="https://github.com/binyamfeyissa/Glacia"
            target="_blank"
            rel="noreferrer"
            className="icon-button"
            aria-label="Glacia on GitHub"
            title="GitHub"
          >
            <GithubIcon width={17} height={17} />
          </a>
          <button
            type="button"
            className="icon-button menu-trigger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <CloseIcon width={18} height={18} /> : <MenuIcon width={18} height={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              aria-current={isActive(item) ? "page" : undefined}
            >
              {item.label}
              <ArrowUpRightIcon width={15} height={15} />
            </Link>
          ))}
          <a
            href="https://github.com/binyamfeyissa/Glacia"
            target="_blank"
            rel="noreferrer"
            className="mobile-nav-link"
          >
            GitHub
            <GithubIcon width={15} height={15} />
          </a>
        </div>
      )}

      <Dialog
        open={searchOpen}
        onOpenChange={(open) => {
          setSearchOpen(open);
          if (!open) setQuery("");
        }}
      >
        <DialogContent className="search-dialog">
          <DialogTitle className="visually-hidden">Search Glacia</DialogTitle>
          <DialogDescription className="visually-hidden">
            Search every component in the library.
          </DialogDescription>

          <div className="search-dialog-field">
            <SearchField
              placeholder="Search components, props, categories…"
              value={query}
              onValueChange={setQuery}
              autoFocus
            />
          </div>

          <div className="search-dialog-body">
            {query.trim() ? (
              results.length > 0 ? (
                <SearchResults hits={results} />
              ) : (
                <p className="search-empty">No matches for “{query}”.</p>
              )
            ) : (
              <div className="search-suggestions">
                <p className="search-suggestions-label">Jump to</p>
                <div className="search-suggestion-grid">
                  {["button", "card", "dialog", "tab-bar", "segmented-control", "table"].map(
                    (slug) => {
                      const component = searchIndex.find((c) => c.kind === "component" && c.key.includes(`:${slug}`) && c.scope.startsWith(activePlatform === "web" ? "Web" : "Mobile"));
                      if (!component) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/platform/${activePlatform}/components/${slug}`}
                          className="search-suggestion"
                          onClick={() => setSearchOpen(false)}
                        >
                          {component.title}
                        </Link>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="search-dialog-foot">
            <span>81 components · 10 blocks</span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </div>
        </DialogContent>
      </Dialog>

    </header>
      {/* Phone-style tab bar: pinned to the bottom centre of the viewport.
          This is the library's own TabBar engine, not a lookalike. */}
      <div className="bottom-tabbar">
        <NavigationTabs
          className="bottom-tabbar-inner"
          aria-label="Main"
          items={toNavigationItems()}
          value={activeNav}
          link={Link}
        />
      </div>
    </>
  );
}
