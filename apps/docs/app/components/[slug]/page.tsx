import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPONENTS_DATA } from "../../../data/components-data";
import { ComponentPreview } from "../../../components/component-preview";
import { ComponentDemo } from "../../../components/demos";
import { ComponentThumb } from "../../../components/component-thumb";
import { ArrowRightIcon, ChevronDownIcon } from "../../../components/icons";
import { pageMetadata, canonical } from "../../../lib/seo";

const CATEGORY_ORDER = [
  "Buttons & Actions",
  "Text & Forms",
  "Showing Things",
  "Navigation & Layout",
  "Popups & Menus",
  "Chat & AI",
] as const;

export async function generateStaticParams() {
  return COMPONENTS_DATA.map((component) => ({
    slug: component.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = COMPONENTS_DATA.find((item) => item.slug === slug);
  if (!component) return { title: "Component not found" };
  return {
    ...pageMetadata({
      title: `${component.name} — React Liquid Glass component`,
      description: component.description,
      path: `/components/${component.slug}`,
    }),
    // `/components/<slug>` is the site's short link. The platform manual is the
    // canonical home for the same documentation, so point there rather than
    // letting two URLs compete for one page.
    alternates: { canonical: canonical(`/platform/web/components/${component.slug}`) },
  };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = COMPONENTS_DATA.find((item) => item.slug === slug);

  if (!component) {
    notFound();
  }

  const index = COMPONENTS_DATA.findIndex((item) => item.slug === component.slug);
  const previous = index > 0 ? COMPONENTS_DATA[index - 1] : null;
  const next = index < COMPONENTS_DATA.length - 1 ? COMPONENTS_DATA[index + 1] : null;
  const related = COMPONENTS_DATA.filter(
    (item) => item.category === component.category && item.slug !== component.slug,
  ).slice(0, 3);

  return (
    <div className="docs-shell">
      <aside className="docs-side">
        <div className="docs-side-inner">
          <Link href="/components/button" className="docs-side-back">
            <ArrowRightIcon
              width={12}
              height={12}
              style={{ transform: "rotate(180deg)" }}
            />
            All components
          </Link>

          {CATEGORY_ORDER.map((category) => {
            const items = COMPONENTS_DATA.filter((item) => item.category === category);
            return (
              <div className="docs-nav-group" key={category}>
                <h3>{category}</h3>
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    className="docs-nav-link"
                    aria-current={item.slug === component.slug ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </aside>

      <article className="docs-main">
        <details className="docs-mobile-nav">
          <summary>
            Browse all components
            <ChevronDownIcon width={14} height={14} />
          </summary>
          <div className="docs-mobile-nav-panel">
            {CATEGORY_ORDER.map((category) => (
              <div className="docs-nav-group" key={category}>
                <h3>{category}</h3>
                {COMPONENTS_DATA.filter((item) => item.category === category).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    className="docs-nav-link"
                    aria-current={item.slug === component.slug ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </details>

        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/components/button">Components</Link>
          <span>/</span>
          <span>{component.category}</span>
          <span>/</span>
          <span>{component.name}</span>
        </nav>

        <header className="docs-header">
          <p className="docs-kicker">{component.category}</p>
          <h1 className="docs-title">{component.name}</h1>
          <p className="docs-desc">{component.description}</p>
          <div className="meta-row">
            <span className={component.appleStatus === "Apple-faithful" ? "meta-pill accent" : "meta-pill"}>
              <span className="status-dot ok" />
              {component.appleStatus}
            </span>
            <span className="meta-pill">
              <span className={`status-dot ${component.nativeStatus === "Yes" ? "ok" : "muted"}`} />
              React Native · {component.nativeStatus}
            </span>
            <span className="meta-pill">Wave {component.wave}</span>
          </div>
        </header>

        <ComponentPreview
          name={component.name}
          slug={component.slug}
          code={component.codeSnippet}
        >
          <ComponentDemo slug={component.slug} />
        </ComponentPreview>

        {component.props.length > 0 && (
          <section className="docs-section" id="props">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">Props</h2>
                <p className="docs-section-desc">
                  Every prop is typed, documented, and forwarded to the underlying element.
                </p>
              </div>
            </div>

            <div className="props-wrap">
              <table className="props-table">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {component.props.map((prop) => (
                    <tr key={prop.name}>
                      <td className="prop-name">{prop.name}</td>
                      <td className="prop-type">{prop.type}</td>
                      <td className="prop-default">{prop.default || "—"}</td>
                      <td>{prop.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="docs-section">
          <div className="docs-section-head">
            <div>
              <h2 className="docs-section-title">Implementation notes</h2>
              <p className="docs-section-desc">What you can rely on in every environment.</p>
            </div>
          </div>
          <div className="report-note-grid">
            <div className="report-note">
              <h3>Theme-aware</h3>
              <p>
                Reads the shared <code>--gl-*</code> tokens, so light and dark appearance stay
                consistent without local overrides.
              </p>
            </div>
            <div className="report-note">
              <h3>Keyboard first</h3>
              <p>
                Focus is always visible and never trapped unintentionally. Overlays restore focus to
                the trigger when dismissed.
              </p>
            </div>
            <div className="report-note">
              <h3>Reduced motion</h3>
              <p>
                Spring physics collapse to instant state changes under{" "}
                <code>prefers-reduced-motion</code>. Nothing moves for users who opt out.
              </p>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="docs-section">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">More in {component.category}</h2>
              </div>
            </div>
            <div className="component-grid">
              {related.map((item) => (
                <Link key={item.slug} href={`/components/${item.slug}`} className="component-card">
                  <div className="component-card-stage">
                    <div className="demo-surface">
                      <ComponentThumb slug={item.slug} name={item.name} />
                    </div>
                  </div>
                  <div className="component-card-foot">
                    <span>
                      <span className="component-card-name">{item.name}</span>
                      <span className="component-card-cat">{item.category}</span>
                    </span>
                    <ArrowRightIcon width={15} height={15} className="component-card-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav className="page-nav" aria-label="Component pagination">
          {previous ? (
            <Link href={`/components/${previous.slug}`} className="page-nav-link previous">
              <span className="page-nav-label">← Previous</span>
              <span className="page-nav-name">{previous.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/components/${next.slug}`} className="page-nav-link next">
              <span className="page-nav-label">Next →</span>
              <span className="page-nav-name">{next.name}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
