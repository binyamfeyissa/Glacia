import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { existsSync } from "fs";
import path from "path";
import {
  TEMPLATES,
  getTemplate,
  shotPath,
  stackLine,
  type TemplateItem,
} from "../../../data/templates";
import { pageMetadata } from "../../../lib/seo";
import { CheckIcon, ShieldIcon } from "../../../components/icons";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = getTemplate(id);
  if (!t) return {};
  return pageMetadata({
    title: `${t.name} — ${t.tagline}`,
    description: t.description,
    path: `/templates/${t.id}`,
    keywords: ["glacia template", t.platform === "Web" ? "next.js template" : "react native template", t.tagline],
  });
}

/** Screenshots that actually exist for this template (checked at build time). */
function existingShots(t: TemplateItem): number[] {
  const out: number[] = [];
  for (const n of [1, 2, 3]) {
    const p = path.join(process.cwd(), "public", "template-shots", t.shotId ?? t.id, `${n}.jpg`);
    if (existsSync(p)) out.push(n);
  }
  return out;
}

const INCLUDED = [
  "Full source code (TypeScript) — the complete app, not a mockup",
  "Every screen shown in the screenshots, working end to end",
  "Built entirely from Glacia components",
  "README with setup and run instructions",
  "Use it in unlimited personal and commercial projects",
  "No redistribution or resale of the template itself",
];

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = getTemplate(id);
  if (!t) notFound();
  const shots = existingShots(t);

  return (
    <div className="templates-page template-detail-page">
      <div className="template-detail-inner">
        <a className="template-back" href="/templates">
          ← All templates
        </a>

        <header className="template-detail-head">
          <div className="template-detail-titles">
            <h1 className="templates-title">{t.name}</h1>
            <p className="template-detail-tagline">{t.tagline}</p>
            <p className="templates-subtitle">{t.description}</p>
            <div className="pages-chips">
              <span className="page-chip">{t.platform}</span>
              <span className="page-chip">{t.screens}</span>
              <span className="page-chip">{stackLine(t)}</span>
            </div>
          </div>
          <aside className="template-buy-card">
            <div className="template-buy-price">
              {t.kind === "Free" ? "Free" : `$${t.price}`}
            </div>
            <p className="template-buy-note">
              {t.kind === "Free"
                ? "Free download when the store opens at launch. An email address is all it takes."
                : "On sale when the store opens at launch. Delivered by email right after checkout — order confirmation plus a download link."}
            </p>
            <ul className="template-buy-points">
              <li>
                <ShieldIcon /> 14-day money-back guarantee
              </li>
              <li>
                <CheckIcon /> Unlimited projects license
              </li>
              <li>
                <CheckIcon /> Yours to keep — no subscription
              </li>
            </ul>
          </aside>
        </header>

        {shots.length > 0 && (
          <section className={`template-shots template-shots-${t.platform.toLowerCase()}`}>
            {shots.map((n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={n}
                src={shotPath(t, n)}
                alt={`${t.name} screenshot ${n}`}
                loading={n === 1 ? "eager" : "lazy"}
              />
            ))}
          </section>
        )}
        {t.platform === "Mobile" && (
          <p className="template-shots-note">
            Screenshots are taken from the app&apos;s web preview. On a real phone the same
            screens render with the full Liquid Glass engine.
          </p>
        )}

        <section className="template-detail-cols">
          <div>
            <h2>What&apos;s inside</h2>
            <ul className="template-detail-features">
              {t.features.map((f) => (
                <li key={f}>
                  <span className="feature-check">
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>What you get</h2>
            <ul className="template-detail-features">
              {INCLUDED.map((f) => (
                <li key={f}>
                  <span className="feature-check">
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
