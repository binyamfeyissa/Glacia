import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, GUIDE_BY_SLUG } from "../../../data/guides-data";
import { pageMetadata, canonical } from "../../../lib/seo";
import {
  BreadcrumbStructuredData,
  TechArticleStructuredData,
} from "../../../components/structured-data";
import { ArrowRightIcon } from "../../../components/icons";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG.get(slug);
  if (!guide) return { title: "Guide not found" };

  return {
    ...pageMetadata({
      title: guide.title,
      description: guide.description,
      path: `/guides/${guide.slug}`,
    }),
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified ?? guide.datePublished,
      url: canonical(`/guides/${guide.slug}`),
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG.get(slug);
  if (!guide) notFound();

  return (
    <article className="guide-page">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
      />
      <TechArticleStructuredData
        title={guide.title}
        description={guide.description}
        path={`/guides/${guide.slug}`}
        datePublished={guide.datePublished}
        dateModified={guide.dateModified}
      />

      <header className="guide-head">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/guides">Guides</Link>
          <span>/</span>
          <span>{guide.topic}</span>
        </nav>

        <p className="docs-kicker" style={{ marginTop: 18 }}>
          {guide.topic} · {guide.readingMinutes} min read
        </p>
        <h1 className="block-title guide-title">{guide.title}</h1>
        <p className="guide-lede">{guide.lede}</p>
        <time className="guide-date" dateTime={guide.datePublished}>
          {new Date(guide.datePublished).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <div className="guide-body">
        {guide.blocks.map((block, index) => {
          if (block.type === "h2") {
            return <h2 key={index}>{block.text}</h2>;
          }
          if (block.type === "h3") {
            return <h3 key={index}>{block.text}</h3>;
          }
          if (block.type === "code") {
            return (
              <pre key={index} className="guide-code" data-lang={block.lang}>
                <code>{block.text}</code>
              </pre>
            );
          }
          if (block.type === "list") {
            return (
              <ul key={index}>
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          }
          if (block.type === "note") {
            return (
              <aside key={index} className="guide-note">
                {block.text}
              </aside>
            );
          }
          return <p key={index}>{block.text}</p>;
        })}
      </div>

      <footer className="guide-related">
        <h2 className="guide-related-title">Related documentation</h2>
        <div className="guide-related-links">
          {guide.related.map((link) => (
            <Link key={link.href} href={link.href} className="guide-related-link">
              {link.label}
              <ArrowRightIcon />
            </Link>
          ))}
        </div>
      </footer>
    </article>
  );
}
