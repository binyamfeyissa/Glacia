import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { DocsSidebar } from "../../../../components/docs-sidebar";
import { CopyBlock } from "../../../../components/copy-block";
import { HOOK_COUNT, HOOK_GROUPS, hooksMeta } from "../../../../data/hooks-data";
import { pageMetadata } from "../../../../lib/seo";
import { PLATFORMS, isPlatform, platformHref } from "../../../../data/platforms";

export function generateStaticParams() {
  return ["web", "mobile"].map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string }>;
}): Promise<Metadata> {
  const { platform } = await params;
  if (!isPlatform(platform)) return {};
  const meta = hooksMeta(platform);
  return pageMetadata({
    title: `${meta.title} · ${PLATFORMS[platform].label}`,
    description: meta.description,
    path: `/platform/${platform}/hooks`,
  });
}

/**
 * The hooks reference.
 *
 * Hooks need signature-level documentation — what they return, what they clean
 * up, and the specific mistake each one prevents — so this page renders from a
 * structured data file rather than prose.
 */
export default async function HooksPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!isPlatform(platform)) notFound();

  const meta = hooksMeta(platform);
  const pkg = PLATFORMS[platform].pkg;

  return (
    <div className="docs-shell">
      <DocsSidebar platform={platform} current="hooks" />

      <main className="docs-main">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={platformHref(platform)}>{PLATFORMS[platform].label}</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">Hooks</span>
        </nav>

        <header className="docs-header">
          <span className="docs-kicker">{HOOK_COUNT} hooks · {pkg}</span>
          <h1>{meta.title}</h1>
          <p className="docs-desc">{meta.description}</p>
        </header>

        <section className="docs-section">
          <h2>Importing</h2>
          <p>
            Hooks are exported from the package root alongside the components. They are plain React
            and carry no styling, so importing one costs nothing visually.
          </p>
          <CopyBlock code={`import { useDisclosure, useCopyToClipboard } from "${pkg}";`} />
        </section>

        {HOOK_GROUPS.map((group) => (
          <section className="docs-section" key={group.title}>
            <div className="docs-section-head">
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
            </div>

            <div className="hook-list">
              {group.hooks.map((hook) => (
                <article className="hook-card" id={hook.name} key={hook.name}>
                  <header className="hook-head">
                    <h3>{hook.name}</h3>
                    <code className="hook-signature">{hook.signature}</code>
                  </header>

                  <p className="hook-summary">{hook.summary}</p>

                  <p className="hook-returns">
                    <span>Returns</span>
                    <code>{hook.returns}</code>
                  </p>

                  <ul className="hook-notes">
                    {hook.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>

                  <CopyBlock code={hook.example} />
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="docs-section">
          <h2>Using these with native</h2>
          <p>
            None of these hooks touch the glass engine or the DOM beyond feature-checked APIs, so
            they are safe to use in a React Native app. The hooks that read layout —{" "}
            <code>useBreakpoint</code>, <code>useKeyboardAvoidance</code>,{" "}
            <code>useScrollSections</code> — reference <code>window</code>, so use them only in code
            paths that run on the web.
          </p>
        </section>
      </main>
    </div>
  );
}
