"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, SearchField, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "glacia";
import { COMPONENTS_DATA } from "../data/components-data";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = searchQuery.trim()
    ? COMPONENTS_DATA.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <header className="gl-glass gl-site-header">
      <div className="gl-header-container">
        <div className="gl-header-left">
          <Link href="/" className="gl-header-logo">
            <span className="gl-logo-mark">❄</span>
            <span className="gl-logo-text">Glacia</span>
          </Link>
          <nav className="gl-header-nav">
            <Link href="/" className="gl-nav-link">
              Home
            </Link>
            <Link href="/components/button" className="gl-nav-link">
              Components
            </Link>
            <Link href="/blocks/dashboard" className="gl-nav-link">
              Blocks
            </Link>
            <Link href="/build-report" className="gl-nav-link">
              Build Report
            </Link>
          </nav>
        </div>

        <div className="gl-header-right">
          {/* Search Trigger with Dialog */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="glass" className="gl-header-search-btn">
                <span>🔍 Search components...</span>
                <kbd className="gl-search-kbd">⌘K</kbd>
              </Button>
            </DialogTrigger>
            <DialogContent className="gl-search-dialog">
              <DialogHeader>
                <DialogTitle>Quick Search</DialogTitle>
                <DialogDescription>Find any Glacia component or block instantly.</DialogDescription>
              </DialogHeader>
              <div className="gl-search-input-wrapper">
                <SearchField
                  placeholder="Type to filter..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  autoFocus
                />
              </div>
              <div className="gl-search-results">
                {filteredComponents.length > 0 ? (
                  filteredComponents.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/components/${item.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="gl-search-item"
                    >
                      <span className="gl-search-item-title">{item.name}</span>
                      <span className="gl-search-item-desc">{item.description}</span>
                    </Link>
                  ))
                ) : searchQuery ? (
                  <p className="gl-search-empty">No components found matching "{searchQuery}"</p>
                ) : (
                  <div className="gl-search-suggestions">
                    <p className="gl-suggestions-label">Popular components:</p>
                    <div className="gl-suggestions-list">
                      {COMPONENTS_DATA.slice(0, 6).map((c) => (
                        <Link
                          key={c.slug}
                          href={`/components/${c.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="gl-suggestion-tag"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <a
            href="https://github.com/open-pluto/glacia"
            target="_blank"
            rel="noreferrer"
            className="gl-github-link"
          >
            <Button size="sm" variant="glass">
              ★ GitHub
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
