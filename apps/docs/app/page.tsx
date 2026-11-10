import Link from "next/link";
import { COMPONENTS_DATA } from "../data/components-data";
import { ComponentThumb } from "../components/component-thumb";
import { InstallCommand } from "../components/install-command";
import { MaterialLab } from "../components/material-lab";
import { StackMarquee } from "../components/stack-marquee";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CodeIcon,
  GridIcon,
  LayersIcon,
  PhoneIcon,
  ShieldIcon,
  SparkIcon,
} from "../components/icons";

const FEATURED = [
  "button",
  "segmented-control",
  "switch",
  "slider",
  "search-field",
  "tabs",
  "progress",
  "badge",
  "avatar",
];

const CATEGORY_ORDER = [
  "Buttons & Actions",
  "Text & Forms",
  "Showing Things",
  "Navigation & Layout",
  "Popups & Menus",
  "Chat & AI",
] as const;

const FEATURES = [
  {
    icon: LayersIcon,
    title: "Real optics",
    body: "A two-layer engine: universal frosted glass, plus SVG displacement that actually bends the backdrop on Chromium.",
  },
  {
    icon: CodeIcon,
    title: "One API",
    body: "The same props and tokens on web and native. Learn a component once and use it across every surface.",
  },
  {
    icon: PhoneIcon,
    title: "Native where it counts",
    body: "On iOS 26 the material becomes Apple's real UIGlassEffect. Older devices fall back without layout shifts.",
  },
  {
    icon: ShieldIcon,
    title: "Accessible defaults",
    body: "WAI-ARIA patterns, visible focus rings, reduced-motion support, and honest contrast on glass.",
  },
] as const;

const PLATFORM_ROWS = [
  {
    icon: GridIcon,
    platform: "Chromium — Chrome, Edge, Arc, Brave",
    refraction: "Full SVG refraction",
    fallback: "No fallback needed",
    refStatus: "ok",
    fallbackStatus: "muted",
  },
  {
    icon: GridIcon,
    platform: "Safari — macOS & iOS",
    refraction: "Frosted material",
    fallback: "Layer 1 blur, rim light, depth",
    refStatus: "warn",
    fallbackStatus: "ok",
  },
  {
    icon: GridIcon,
    platform: "Firefox",
    refraction: "Frosted material",
    fallback: "Layer 1 blur, rim light, depth",
    refStatus: "warn",
    fallbackStatus: "ok",
  },
  {
    icon: PhoneIcon,
    platform: "iOS 26+ — React Native",
    refraction: "Native UIGlassEffect",
    fallback: "No fallback needed",
    refStatus: "ok",
    fallbackStatus: "muted",
  },
  {
    icon: PhoneIcon,
    platform: "iOS < 26 & Android",
    refraction: "Tinted surface",
    fallback: "Identical geometry, zero shift",
    refStatus: "muted",
    fallbackStatus: "ok",
  },
  {
    icon: SparkIcon,
    platform: "Expo Go",
    refraction: "Tinted surface",
    fallback: "Static view + dev notice",
    refStatus: "muted",
    fallbackStatus: "ok",
  },
];

export default function HomePage() {
  const featured = FEATURED.map((slug) => COMPONENTS_DATA.find((c) => c.slug === slug)).filter(
    (component): component is (typeof COMPONENTS_DATA)[number] => Boolean(component),
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero hero-tahoe">
        <div className="hero-backdrop" aria-hidden="true">
          {/* The attached Tahoe scene, kept as the hero's whole surface rather
              than a banner: it bleeds past the section and masks out into the
              page below, so there is no hard edge to see. */}
          <picture>
            <source srcSet="/hero/tahoe-dark.jpg" type="image/jpeg" />
            <img
              src="/hero/tahoe-dark.png"
              alt=""
              aria-hidden="true"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <span className="hero-backdrop-tint" />
          <span className="hero-backdrop-veil" />
        </div>

        <div className="hero-inner">


          <h1 className="hero-title">
            Liquid glass,
            <br />
            <span className="grad">engineered.</span>
          </h1>

          <p className="hero-sub">
            A React and React Native component library built on the real optics of Apple&apos;s
            Liquid Glass. Refraction, specular rim light, and depth — not a blur filter.
          </p>

          <div className="hero-actions">
            <Link href="/components/button" className="btn btn-primary">
              Explore 81 components
              <ArrowRightIcon className="arrow" />
            </Link>
            <a href="#material" className="btn btn-glass">
              See the material
            </a>
            <a
              href="https://github.com/binyamfeyissa/Glacia"
              target="_blank"
              rel="noreferrer"
              className="btn btn-quiet"
            >
              GitHub
              <ArrowUpRightIcon />
            </a>
          </div>

          <div className="hero-install">
            <InstallCommand />
            <span className="hero-note">TypeScript · Zero dependencies · WAI-ARIA</span>
          </div>
        </div>
      </section>

      {/* Ecosystem & Platforms */}
      <section className="section section-spaced ecosystem-section" id="ecosystem" aria-labelledby="ecosystem-heading">
        <div className="section-head">
          <div className="section-head-copy">

            <h2 className="section-title">Built for the platforms and tools you trust.</h2>
            <p className="section-desc">
              Native liquid glass on Apple platforms. Hardware-accelerated displacement on Chromium. Seamless integration across React, React Native, Next.js, and modern toolchains.
            </p>
          </div>
        </div>

        <div className="ecosystem-card">
          <StackMarquee />
        </div>
      </section>

      {/* Material lab */}
      <section className="lab-section" id="material">
        <div className="section-head">
          <div className="section-head-copy">

            <h2 className="section-title">Glass that behaves like glass.</h2>
            <p className="section-desc">
              Move between surfaces and watch the same components hold their legibility, contrast,
              and edge light. Every surface here is full CSS — the glass is doing the work.
            </p>
          </div>
          <Link href="/components/glass" className="section-link">
            Glass primitive
            <ArrowRightIcon />
          </Link>
        </div>
        <MaterialLab />
      </section>

      {/* Features */}
      <section className="section section-spaced">
        <div className="feature-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div className="feature-card" key={feature.title}>
                <span className="feature-icon">
                  <Icon width={16} height={16} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Component gallery */}
      <section className="section section-spaced" id="components">
        <div className="section-head">
          <div className="section-head-copy">

            <h2 className="section-title">Seventy-one primitives. One language.</h2>
            <p className="section-desc">
              Controls, forms, navigation, overlays, data, and AI — each one measured against Apple&apos;s
              Human Interface Guidelines and verified for keyboard and screen-reader use.
            </p>
          </div>
          <Link href="/components/button" className="section-link">
            Browse the catalog
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="component-grid">
          {featured.map((component) => (
            <Link
              key={component.slug}
              href={`/components/${component.slug}`}
              className="component-card"
            >
              <div
                className="component-card-stage surface-tahoe"
                data-glacia-backdrop="true"
                data-glisse-backdrop="true"
              >
                <div className="demo-surface">
                  <ComponentThumb slug={component.slug} />
                </div>
              </div>
              <div className="component-card-foot">
                <span>
                  <span className="component-card-name">{component.name}</span>
                  <span className="component-card-cat">{component.category}</span>
                </span>
                <ArrowUpRightIcon width={15} height={15} className="component-card-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full catalog */}
      <section className="section section-spaced">
        <div className="section-head">
          <div className="section-head-copy">
            <p className="eyebrow">Full catalog</p>
            <h2 className="section-title">All 81 components across Waves 1, 2, 3 &amp; 4.</h2>
          </div>
        </div>

        <div className="catalog-rows">
          {CATEGORY_ORDER.map((category) => {
            const items = COMPONENTS_DATA.filter((component) => component.category === category);
            return (
              <div className="catalog-row" key={category}>
                <div className="catalog-row-head">
                  <h3>{category}</h3>
                  <span className="catalog-group-count">{String(items.length).padStart(2, "0")}</span>
                </div>
                <div className="catalog-chips">
                  {items.map((component) => (
                    <Link
                      key={component.slug}
                      href={`/components/${component.slug}`}
                      className="catalog-chip"
                    >
                      {component.name}
                      {component.nativeStatus === "Yes" && (
                        <span className="catalog-native-dot" title="React Native support" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blocks */}
      <section className="section section-spaced">
        <div className="section-head">
          <div className="section-head-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Blocks
            </p>
            <h2 className="section-title">Assembled, not just individual parts.</h2>
            <p className="section-desc">
              Ten production-ready screens that show the system working together — with real state,
              real tables, and real glass.
            </p>
          </div>
        </div>

        <div className="block-grid">
          <Link href="/blocks/dashboard" className="block-card">
            <div className="block-card-stage">
              <div className="mock mock-dash">
                <div className="mock-side">
                  <div className="mock-brand" />
                  <div className="mock-side-line active" />
                  <div className="mock-side-line" />
                  <div className="mock-side-line" />
                  <div className="mock-side-line" />
                </div>
                <div className="mock-main">
                  <div className="mock-topbar">
                    <div className="mock-title" />
                    <div className="mock-pill accent" />
                  </div>
                  <div className="mock-stats">
                    <div className="mock-stat">
                      <i />
                      <b />
                    </div>
                    <div className="mock-stat">
                      <i />
                      <b />
                    </div>
                    <div className="mock-stat">
                      <i />
                      <b />
                    </div>
                  </div>
                  <div className="mock-chart">
                    {[46, 68, 54, 82, 94, 70, 88, 100, 74, 86].map((height, index) => (
                      <span className="mock-bar" style={{ height: `${height}%` }} key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="block-card-copy">
              <div>
                <h3>Admin dashboard</h3>
                <p>
                  A floating sidebar, live metrics, chart flow, and an orders table that holds up at
                  every breakpoint.
                </p>
                <div className="block-card-tags">
                  <span className="block-tag">Sidebar</span>
                  <span className="block-tag">Table</span>
                  <span className="block-tag">Card</span>
                </div>
              </div>
              <ArrowUpRightIcon width={16} height={16} className="mock-block-arrow" />
            </div>
          </Link>

          <Link href="/blocks/login" className="block-card">
            <div className="block-card-stage">
              <div className="mock mock-login">
                <div className="mock-login-card">
                  <div className="mock-logo" />
                  <div className="mock-login-line wide" />
                  <div className="mock-login-line" />
                  <div className="mock-input" />
                  <div className="mock-input" />
                  <div className="mock-submit" />
                </div>
              </div>
            </div>
            <div className="block-card-copy">
              <div>
                <h3>Login page</h3>
                <p>
                  A complete authentication screen with email, password, remember-me, and OAuth
                  providers — centered or split.
                </p>
                <div className="block-card-tags">
                  <span className="block-tag">Input</span>
                  <span className="block-tag">Checkbox</span>
                  <span className="block-tag">Button</span>
                </div>
              </div>
              <ArrowUpRightIcon width={16} height={16} className="mock-block-arrow" />
            </div>
          </Link>
        </div>
      </section>

      {/* Platform matrix */}
      <section className="section section-spaced">
        <div className="section-head">
          <div className="section-head-copy">
            <p className="eyebrow">Compatibility</p>
            <h2 className="section-title">Honest about every surface.</h2>
            <p className="section-desc">
              Refraction is real where the platform allows it and gracefully degrades where it
              doesn&apos;t. No hidden gaps, no broken layouts.
            </p>
          </div>
        </div>

        <div className="matrix">
          <div className="matrix-head">
            <span>Platform</span>
            <span>Refraction</span>
            <span>Fallback</span>
          </div>
          {PLATFORM_ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div className="matrix-row" key={row.platform}>
                <span className="matrix-platform">
                  <span className="platform-mark">
                    <Icon />
                  </span>
                  {row.platform}
                </span>
                <span className="matrix-cell">
                  <span className={`status-dot ${row.refStatus}`} />
                  {row.refraction}
                </span>
                <span className="matrix-cell">
                  <span className={`status-dot ${row.fallbackStatus}`} />
                  {row.fallback}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section section-spaced">
        <div className="cta">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Start here
          </p>
          <h2>Ship glass in an afternoon.</h2>
          <p>
            Install the package, or copy exactly the components you need into your own project.
            Both paths are supported and documented.
          </p>
          <InstallCommand />
          <div className="cta-links">
            <Link href="/components/button">Read the docs</Link>
            <span>·</span>
            <a href="https://github.com/binyamfeyissa/Glacia" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
            <span>·</span>
            <Link href="/build-report">Build report</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
