"use client";

import { useState } from "react";
import { CheckIcon, ShieldIcon, SparkIcon } from "../../components/icons";

import { TEMPLATES, shotPath } from "../../data/templates";

const FILTERS = ["All", "Free", "Web", "Mobile"] as const;

export default function TemplatesPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = TEMPLATES.filter((t) =>
    filter === "All" ? true : filter === "Free" ? t.kind === "Free" : t.platform === filter,
  );

  return (
    <div className="templates-page">
      <section className="templates-hero">
        <div className="templates-hero-inner">
          <span className="templates-eyebrow">
            <SparkIcon width={14} height={14} />
            Template store
          </span>
          <h1 className="templates-title">Full apps, built with Glacia.</h1>
          <p className="templates-subtitle">
            Every template is a real, runnable app assembled from the same Glacia components
            documented on this site — no mockups, no placeholder screens. All 49 templates
            are built and verified; the store opens at launch.
          </p>
          <div className="templates-meta-badges">
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              5 free templates at launch
            </span>
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              22 web and 22 mobile templates, all built
            </span>
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              Next.js, React Native &amp; Expo
            </span>
            <span className="meta-badge">
              <ShieldIcon width={14} height={14} />
              Delivered privately by email
            </span>
          </div>
        </div>
      </section>

      <div className="templates-filter-wrap">
        <div className="templates-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="templates-grid-section">
        <div className="templates-grid">
          {shown.map((template) => (
            <a key={template.id} className="template-card" href={`/templates/${template.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="template-thumb"
                src={shotPath(template, 1)}
                alt={`${template.name} preview`}
                loading="lazy"
              />
              <div className="template-card-body">
                <div className="template-title-row">
                  <h2 className="template-name">{template.name}</h2>
                  <div className="template-price-pill">
                    {template.kind === "Free" ? "Free" : `$${template.price}`}
                  </div>
                </div>
                <p className="template-tagline">{template.tagline}</p>
                <p className="template-desc">{template.description}</p>
                <div className="template-pages-preview">
                  <div className="pages-chips">
                    <span className="page-chip">{template.platform}</span>
                    <span className="page-chip">{template.screens}</span>
                    <span className="page-chip more">Details & screenshots →</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="templates-faq">
        <h3>How buying works</h3>
        <div className="faq-item">
          <h4>How do I get a template after paying?</h4>
          <p>
            Checkout sends you an email with your order confirmation and a private download
            link. Paid templates are never posted publicly — the link in your email is the
            only copy.
          </p>
        </div>
        <div className="faq-item">
          <h4>What can I build with a template?</h4>
          <p>
            Unlimited personal and commercial projects of your own. The one rule: do not
            redistribute or resell the template itself.
          </p>
        </div>
        <div className="faq-item">
          <h4>What if it is not for me?</h4>
          <p>Every paid template carries a 14-day refund, no questions asked.</p>
        </div>
        <div className="faq-item">
          <h4>When does the store open?</h4>
          <p>
            At the Glacia launch, with the five free templates ready to download and the
            full paid catalogue — 22 web and 22 mobile templates — on sale.
          </p>
        </div>
      </section>
    </div>
  );
}
