import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CopyBlock } from "./copy-block";
import { PlatformPage } from "./platform-page";
import { COMPONENTS_DATA } from "../data/components-data";
import { BLOCKS } from "../data/blocks-data";
import { NATIVE_COMPONENTS, webComponentCount } from "../data/platform-components";
import { PLATFORMS, PLATFORM_ORDER, isPlatform, platformHref, type Platform } from "../data/platforms";
import { sectionCopy } from "../data/section-copy";

/**
 * One renderer for every non-component documentation section.
 *
 * Each route supplies only a slug; the platform and the copy both come from
 * data, which keeps the two editions structurally identical while allowing
 * their text to differ completely.
 */
export function sectionPage(slug: string) {
  async function Page({ params }: { params: Promise<{ platform: string }> }) {
    const { platform } = await params;
    if (!isPlatform(platform)) notFound();

    const copy = sectionCopy(platform, slug);
    if (!copy) notFound();

    return (
      <PlatformPage
        platform={platform}
        current={slug}
        title={copy.title}
        kicker={copy.kicker}
        description={copy.description}
      >
        {"body" in copy && copy.body?.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="docs-prose">
            {paragraph}
          </p>
        ))}

        {copy.facts && (
          <dl className="platform-facts">
            {copy.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        )}

        {copy.codes?.map((block) => (
          <CopyBlock
            key={block.label + block.code.slice(0, 16)}
            code={block.code}
            language={block.language}
            label={block.label}
          />
        ))}

        {copy.notes?.map((note) => (
          <div className="doc-note" key={note.title}>
            <h3>{note.title}</h3>
            <p>{note.text}</p>
          </div>
        ))}

        {/* The components section is a catalogue, so it renders the real list
            for this platform instead of prose. Charts and blocks are catalogues
            too: a section that names its contents but never lists them leaves
            the reader with no way in. */}
        {slug === "components" && <PlatformComponentIndex platform={platform} />}
        {slug === "charts" && (
          <section className="docs-section">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">Every chart</h2>
              </div>
            </div>
            <CategoryIndex platform={platform} category="Charts" />
          </section>
        )}
        {slug === "blocks" && (
          <section className="docs-section">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">Every block</h2>
              </div>
            </div>
            <BlockIndex />
          </section>
        )}

        {copy.faq && (
          <section className="docs-section">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">Common questions</h2>
              </div>
            </div>
            <dl className="doc-faq">
              {copy.faq.map((item) => (
                <div key={item.question}>
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </PlatformPage>
    );
  }

  Page.displayName = `PlatformSection_${slug}`;
  return Page;
}

/** A section index built from the component catalogue, filtered by category. */
export function CategoryIndex({ platform, category }: { platform: Platform; category: string }) {
  const source = platform === "web" ? COMPONENTS_DATA : NATIVE_COMPONENTS;
  const entries = source.filter((c) => c.category === category);

  return (
    <div className="doc-index-grid">
      {entries.map((entry) => (
        <a
          key={entry.slug}
          href={platformHref(platform, "components", entry.slug)}
          className="doc-index-card"
        >
          <span className="doc-index-title">{entry.name}</span>
          <span className="doc-index-desc">{entry.description}</span>
        </a>
      ))}
    </div>
  );
}

/** Every block, linking to its own page. Blocks have no per-platform split. */
export function BlockIndex() {
  return (
    <div className="doc-index-grid">
      {BLOCKS.map((block) => (
        <a key={block.slug} href={`/blocks/${block.slug}`} className="doc-index-card">
          <span className="doc-index-title">{block.title}</span>
          <span className="doc-index-desc">{block.description}</span>
        </a>
      ))}
    </div>
  );
}

/** The platform's own component catalogue, grouped by category. */
interface CatalogueEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export function PlatformComponentIndex({ platform }: { platform: Platform }) {
  const webEntries: CatalogueEntry[] = COMPONENTS_DATA.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    category: c.category,
  }));
  const nativeEntries: CatalogueEntry[] = NATIVE_COMPONENTS.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    category: c.category,
  }));
  const entries: CatalogueEntry[] = platform === "web" ? webEntries : nativeEntries;

  const categories: string[] = [...new Set(entries.map((e) => e.category))];

  return (
    <>
      <p className="docs-prose">
        {platform === "web"
          ? `All ${webComponentCount} components exported by glacia, grouped by what they do.`
          : `All ${NATIVE_COMPONENTS.length} components exported by glacia-native.`}
      </p>
      {categories.map((category) => (
        <section className="docs-section" key={category}>
          <div className="docs-section-head">
            <div>
              <h2 className="docs-section-title">{category}</h2>
            </div>
          </div>
          <div className="doc-index-grid">
            {entries
              .filter((entry) => entry.category === category)
              .map((entry) => (
                <a
                  key={entry.slug}
                  href={platformHref(platform, "components", entry.slug)}
                  className="doc-index-card"
                >
                  <span className="doc-index-title">{entry.name}</span>
                  <span className="doc-index-desc">{entry.description}</span>
                </a>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}

/** Shared metadata + static params for a platform section route. */
export function sectionMeta(slug: string) {
  const metadata = async ({
    params,
  }: {
    params: Promise<{ platform: string }>;
  }): Promise<Metadata> => {
    const { platform } = await params;
    if (!isPlatform(platform)) return { title: "Not found" };
    const copy = sectionCopy(platform, slug);
    if (!copy) return { title: "Not found" };
    return {
      title: `${copy.title} · ${PLATFORMS[platform].label}`,
      description: copy.description,
    };
  };

  const params = (): { platform: Platform }[] =>
    PLATFORM_ORDER.map((p) => ({ platform: p }));

  return { generateMetadata: metadata, generateStaticParams: params };
}
