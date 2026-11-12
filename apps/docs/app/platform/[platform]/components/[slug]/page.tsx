import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentPreview } from "../../../../../components/component-preview";
import { ComponentDemo } from "../../../../../components/demos";
import { NativeDemo } from "../../../../../components/native-demos";
import { PlatformPage } from "../../../../../components/platform-page";
import { CopyBlock } from "../../../../../components/copy-block";
import { COMPONENTS_DATA } from "../../../../../data/components-data";
import { NATIVE_COMPONENTS } from "../../../../../data/platform-components";
import { PLATFORMS, PLATFORM_ORDER, isPlatform } from "../../../../../data/platforms";

export function generateStaticParams() {
  return PLATFORM_ORDER.flatMap((platform) =>
    (platform === "web" ? COMPONENTS_DATA.map((c) => c.slug) : NATIVE_COMPONENTS.map((c) => c.slug)).map(
      (slug) => ({ platform, slug }),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; slug: string }>;
}): Promise<Metadata> {
  const { platform, slug } = await params;
  if (!isPlatform(platform)) return { title: "Not found" };

  if (platform === "web") {
    const component = COMPONENTS_DATA.find((c) => c.slug === slug);
    if (!component) return { title: "Not found" };
    return { title: component.name, description: component.description };
  }

  const component = NATIVE_COMPONENTS.find((c) => c.slug === slug);
  if (!component) return { title: "Not found" };
  return { title: component.name, description: component.description };
}

export default async function PlatformComponentPage({
  params,
}: {
  params: Promise<{ platform: string; slug: string }>;
}) {
  const { platform, slug } = await params;
  if (!isPlatform(platform)) notFound();
  const meta = PLATFORMS[platform];

  if (platform === "web") {
    const component = COMPONENTS_DATA.find((c) => c.slug === slug);
    if (!component) notFound();

    const related = COMPONENTS_DATA.filter(
      (item) => item.category === component.category && item.slug !== component.slug,
    ).slice(0, 4);

    return (
      <PlatformPage
        platform={platform}
        current="components"
        title={component.name}
        kicker={`${component.category} · ${meta.pkg}`}
        description={component.description}
      >
        <ComponentPreview name={component.name} slug={component.slug} code={component.codeSnippet}>
          <ComponentDemo slug={component.slug} />
        </ComponentPreview>

        <section className="docs-section">
          <div className="docs-section-head">
            <div>
              <h2 className="docs-section-title">Install</h2>
            </div>
          </div>
          <CopyBlock code={`npm install glacia`} label="terminal" />
        </section>

        {component.props.length > 0 && (
          <section className="docs-section">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">API reference</h2>
                <p className="docs-section-desc">
                  Props accepted by <code>{component.name}</code> in <code>{meta.pkg}</code>.
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
              <h2 className="docs-section-title">Platform notes</h2>
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
              <dt>React Native</dt>
              <dd>{component.nativeStatus}</dd>
            </div>
            <div>
              <dt>Glass</dt>
              <dd>
                Fitted with the web lens — a displacement map drawn for this element's size and
                radius, with chromatic split and a painted rim.
              </dd>
            </div>
          </dl>
        </section>

        {related.length > 0 && (
          <section className="docs-section">
            <div className="docs-section-head">
              <div>
                <h2 className="docs-section-title">Related components</h2>
              </div>
            </div>
            <div className="doc-index-grid">
              {related.map((item) => (
                <a
                  key={item.slug}
                  href={`/platform/web/components/${item.slug}`}
                  className="doc-index-card"
                >
                  <span className="doc-index-title">{item.name}</span>
                  <span className="doc-index-desc">{item.description}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </PlatformPage>
    );
  }

  // Mobile
  const component = NATIVE_COMPONENTS.find((c) => c.slug === slug);
  if (!component) notFound();

  const related = NATIVE_COMPONENTS.filter(
    (item) => item.category === component.category && item.slug !== component.slug,
  ).slice(0, 4);

  return (
    <PlatformPage
      platform={platform}
      current="components"
      title={component.name}
      kicker={`${component.category} · ${meta.pkg}`}
      description={component.description}
    >
      <ComponentPreview name={component.name} slug={component.slug} code={component.codeSnippet}>
        <NativeDemo slug={component.slug} />
      </ComponentPreview>

      <section className="docs-section">
        <div className="docs-section-head">
          <div>
            <h2 className="docs-section-title">Install</h2>
          </div>
        </div>
        <CopyBlock code={meta.install} label="terminal" />
      </section>

      <section className="docs-section">
        <div className="docs-section-head">
          <div>
            <h2 className="docs-section-title">Usage</h2>
          </div>
        </div>
        <CopyBlock code={component.codeSnippet} language="tsx" label="tsx" />
      </section>

      {component.props.length > 0 && (
        <section className="docs-section">
          <div className="docs-section-head">
            <div>
              <h2 className="docs-section-title">API reference</h2>
              <p className="docs-section-desc">
                Props accepted by <code>{component.name}</code> in <code>{meta.pkg}</code>.
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
            <h2 className="docs-section-title">Platform notes</h2>
          </div>
        </div>
        <dl className="platform-facts">
          <div>
            <dt>Glass</dt>
            <dd>{component.glass}</dd>
          </div>
          <div>
            <dt>Package</dt>
            <dd>
              <code>{meta.pkg}</code>
            </dd>
          </div>
        </dl>
      </section>

      {related.length > 0 && (
        <section className="docs-section">
          <div className="docs-section-head">
            <div>
              <h2 className="docs-section-title">Related components</h2>
            </div>
          </div>
          <div className="doc-index-grid">
            {related.map((item) => (
              <a
                key={item.slug}
                href={`/platform/mobile/components/${item.slug}`}
                className="doc-index-card"
              >
                <span className="doc-index-title">{item.name}</span>
                <span className="doc-index-desc">{item.description}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </PlatformPage>
  );
}
