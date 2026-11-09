"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "glacia";
import { BackdropSwitcher } from "../components/backdrop-switcher";
import { COMPONENTS_DATA } from "../data/components-data";

export default function HomePage() {
  const [copiedInstall, setCopiedInstall] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInstall(id);
    setTimeout(() => setCopiedInstall(null), 2000);
  };

  const categories = [
    "Buttons & Actions",
    "Text & Forms",
    "Showing Things",
    "Navigation & Layout",
    "Popups & Menus",
  ] as const;

  return (
    <div className="gl-home-page">
      {/* Floating Backdrop Switcher */}
      <BackdropSwitcher />

      {/* Hero Section */}
      <section className="gl-hero">
        <div className="gl-hero-badge-pill">
          <Badge variant="default">Wave 1 Shippable • 33 Web Components • 7 Native Components</Badge>
        </div>

        <h1 className="gl-hero-title">Liquid Glass for React & React Native</h1>

        <p className="gl-hero-tagline">
          Apple's Liquid Glass, with real refraction — not frosted blur — on web and on iOS, from one API.
        </p>

        <div className="gl-hero-actions">
          <Link href="/components/button">
            <Button size="lg" variant="filled">
              Browse Components
            </Button>
          </Link>
          <Link href="/blocks/dashboard">
            <Button size="lg" variant="glass">
              Explore Dashboard Block
            </Button>
          </Link>
          <Link href="/build-report">
            <Button size="lg" variant="ghost">
              Read Build Report
            </Button>
          </Link>
        </div>

        {/* 3 Install Paths */}
        <Card className="gl-hero-installs">
          <div
            className="gl-install-item"
            onClick={() => copyToClipboard("npm install glacia", "web")}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col text-left">
              <span className="gl-install-label">Web (NPM Package)</span>
              <code>npm install glacia</code>
            </div>
            <Button size="sm" variant="ghost">
              {copiedInstall === "web" ? "✓ Copied" : "Copy"}
            </Button>
          </div>

          <div
            className="gl-install-item"
            onClick={() => copyToClipboard("npm install glacia-native", "native")}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col text-left">
              <span className="gl-install-label">React Native (iOS 26+)</span>
              <code>npm install glacia-native</code>
            </div>
            <Button size="sm" variant="ghost">
              {copiedInstall === "native" ? "✓ Copied" : "Copy"}
            </Button>
          </div>

          <div
            className="gl-install-item"
            onClick={() => copyToClipboard("npx glacia add button", "cli")}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col text-left">
              <span className="gl-install-label">Copy Into Your Project</span>
              <code>npx glacia add button</code>
            </div>
            <Button size="sm" variant="ghost">
              {copiedInstall === "cli" ? "✓ Copied" : "Copy"}
            </Button>
          </div>
        </Card>
      </section>

      {/* Support Matrix Table (Verbatim from Master Prompt) */}
      <section className="gl-matrix-section">
        <Card className="gl-matrix-card">
          <CardHeader>
            <CardTitle>Platform Support Matrix</CardTitle>
            <CardDescription>
              Honest platform capabilities and hardware refraction limits across platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Surface</TableHead>
                  <TableHead>Full Refraction</TableHead>
                  <TableHead>Fallback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Web — Chromium / Edge / Arc / Opera</TableCell>
                  <TableCell>Yes (SVG filter in backdrop-filter)</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Web — Safari, Firefox</TableCell>
                  <TableCell>No bend — same material, rim light, tint, blur</TableCell>
                  <TableCell>Layer 1 Frosted Blur (Documented, not hidden)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">iOS 26+ (RN, Xcode 26)</TableCell>
                  <TableCell>Yes — native UIGlassEffect</TableCell>
                  <TableCell>—</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">iOS &lt; 26 (RN)</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Plain View + tint, same layout</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Android (RN)</TableCell>
                  <TableCell>No in v1</TableCell>
                  <TableCell>Plain View + tint (+ optional blur). AGSL = V2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Expo Go</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Static translucent View + dev warning; use a dev build</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Full Built Component Catalog */}
      <section className="gl-catalog-section">
        <h2 className="gl-section-title">Built Component Catalog</h2>
        <p className="gl-section-desc">
          Every component listed below has been implemented, tested, and passed the Done Checklist.
        </p>

        {categories.map((category) => {
          const items = COMPONENTS_DATA.filter((c) => c.category === category);
          if (!items.length) return null;

          return (
            <div key={category} className="gl-category-group">
              <h3 className="gl-category-heading">
                <span>{category}</span>
                <Badge variant="secondary">{items.length}</Badge>
              </h3>

              <div className="gl-catalog-grid">
                {items.map((comp) => (
                  <Link
                    key={comp.slug}
                    href={`/components/${comp.slug}`}
                    className="gl-glass gl-component-card"
                  >
                    <div className="gl-card-meta-row">
                      <h4 className="gl-card-comp-name">{comp.name}</h4>
                      <Badge variant={comp.appleStatus === "Apple-faithful" ? "default" : "secondary"}>
                        {comp.appleStatus}
                      </Badge>
                    </div>

                    <p className="gl-card-comp-desc">{comp.description}</p>

                    <div className="gl-card-badges-row">
                      <Badge variant="outline">
                        Phone: {comp.nativeStatus}
                      </Badge>
                      <Badge variant="outline">Wave {comp.wave}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
