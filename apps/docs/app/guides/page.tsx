import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "../../data/guides-data";
import { pageMetadata } from "../../lib/seo";
import { ArrowRightIcon } from "../../components/icons";

export const metadata: Metadata = pageMetadata({
  title: "Guides — building Liquid Glass interfaces",
  description:
    "Technical guides on Liquid Glass: what the material is, how it differs from glassmorphism, and how to build it in React and React Native without breaking accessibility.",
  path: "/guides",
  keywords: [
    "liquid glass guide",
    "liquid glass react tutorial",
    "glassmorphism vs liquid glass",
    "react native liquid glass",
  ],
});

export default function GuidesIndex() {
  return (
    <div className="guides-page">
      <header className="guides-head">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Guides</span>
        </nav>
        <p className="docs-kicker" style={{ marginTop: 18 }}>
          Technical guides
        </p>
        <h1 className="block-title">Building glass interfaces</h1>
        <p className="block-desc" style={{ maxWidth: "62ch" }}>
          How the Liquid Glass material actually works, where it differs from
          glassmorphism, and how to implement it in React and React Native without
          trading away accessibility or performance.
        </p>
      </header>

      <div className="guides-grid">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="guide-card"
          >
            <span className="guide-card-topic">{guide.topic}</span>
            <h2 className="guide-card-title">{guide.title}</h2>
            <p className="guide-card-desc">{guide.description}</p>
            <span className="guide-card-foot">
              {guide.readingMinutes} min read
              <ArrowRightIcon />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
