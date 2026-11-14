import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CopyBlock } from "../../../components/copy-block";
import { PlatformPage } from "../../../components/platform-page";
import { docSections } from "../../../data/doc-nav";
import { NATIVE_COMPONENTS, webComponentCount } from "../../../data/platform-components";
import { PLATFORMS, PLATFORM_ORDER, isPlatform, platformHref } from "../../../data/platforms";
import { pageMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return PLATFORM_ORDER.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform } = await params;
  if (!isPlatform(platform)) return { title: "Not found" };
  const meta = PLATFORMS[platform];
  return pageMetadata({
    title: `${meta.label} documentation`,
    description: `${meta.label} documentation for Glacia — the ${meta.pkg} package.`,
    path: `/platform/${platform}`,
  });
}

export default async function PlatformIndex({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!isPlatform(platform)) notFound();

  const meta = PLATFORMS[platform];
  const sections = docSections(platform);
  const count = platform === "web" ? webComponentCount : NATIVE_COMPONENTS.length;

  return (
    <PlatformPage
      platform={platform}
      current=""
      title={`Glacia for ${meta.label}`}
      kicker={`${meta.label} documentation`}
      description={
        platform === "web"
          ? "Liquid Glass components for React on the web, with real optical refraction in the browser."
          : "Liquid Glass components for React Native and Expo, with the native glass material on iOS 26 and above."
      }
    >
      <section className="docs-section">
        <div className="docs-section-head">
          <div>
            <h2 className="docs-section-title">Install</h2>
            <p className="docs-section-desc">The package this documentation covers.</p>
          </div>
        </div>
        <CopyBlock code={meta.install} label="terminal" />
        <CopyBlock code={meta.importExample} language="tsx" label="tsx" />
      </section>

      <section className="docs-section">
        <div className="docs-section-head">
          <div>
            <h2 className="docs-section-title">What this platform gives you</h2>
            <p className="docs-section-desc">
              {count} documented {count === 1 ? "component" : "components"} in{" "}
              <code>{meta.pkg}</code>.
            </p>
          </div>
        </div>
        <dl className="platform-facts">
          <div>
            <dt>Package</dt>
            <dd>
              <code>{meta.pkg}</code>
            </dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>{meta.runtime}</dd>
          </div>
          <div>
            <dt>Glass</dt>
            <dd>
              {platform === "web"
                ? "SVG displacement lens fitted per element, with chromatic split and a painted rim."
                : "iOS 26+ UIGlassEffect via @callstack/liquid-glass; translucent tint elsewhere."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="docs-section">
        <div className="docs-section-head">
          <div>
            <h2 className="docs-section-title">Read the manual</h2>
            <p className="docs-section-desc">Every section of the {meta.label} documentation.</p>
          </div>
        </div>
        <div className="doc-index-grid">
          {sections.map((section) => (
            <a key={section.slug} href={platformHref(platform, section.slug)} className="doc-index-card">
              <span className="doc-index-title">{section.title}</span>
              <span className="doc-index-desc">{section.summary}</span>
            </a>
          ))}
        </div>
      </section>
    </PlatformPage>
  );
}
