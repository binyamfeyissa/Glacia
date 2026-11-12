"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  LayersIcon,
  SparkIcon,
  ShieldIcon,
  CodeIcon,
} from "../../components/icons";

interface TemplateItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  pageCount: number;
  price: string;
  badge?: string;
  features: string[];
  pages: string[];
  accentColor: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "nebula-cloud",
    name: "Nebula Cloud OS",
    tagline: "Next-gen infrastructure & cloud management platform",
    description:
      "A complete multi-tenant cloud control plane with server topology graphs, Kubernetes pod monitors, live logs streaming, IAM policy editor, and billing breakdowns.",
    category: "DevOps & Cloud",
    pageCount: 14,
    price: "$10",
    badge: "Bestseller",
    accentColor: "#38bdf8",
    features: [
      "Real-time server topology graph",
      "Kubernetes cluster & pod inspector",
      "Granular IAM role editor & audit logs",
      "Cost breakdown & anomaly alerts",
      "Dark & light liquid glass surfaces",
    ],
    pages: [
      "Cluster Overview",
      "Workloads & Pods",
      "Network & VPCs",
      "Storage Volumes",
      "Cloud Shell Console",
      "IAM & Policies",
      "Audit Trail",
      "Metrics & Traces",
      "Cost & Invoicing",
      "Security Alerts",
      "Team Management",
      "API Credentials",
      "Notification Webhooks",
      "Workspace Settings",
    ],
  },
  {
    id: "aura-capital",
    name: "Aura Capital",
    tagline: "Institutional fintech & wealth management suite",
    description:
      "Full-spectrum financial operations: portfolio performance analytics, multi-currency crypto & fiat wallets, automated rebalancing, and compliance-ready statements.",
    category: "Fintech & Banking",
    pageCount: 12,
    price: "$10",
    badge: "Popular",
    accentColor: "#34d399",
    features: [
      "Interactive candlestick & area charts",
      "Multi-asset wallet (fiat, equity, crypto)",
      "Instant ACH/wire payment transfer flow",
      "Tax lot accounting & capital gains",
      "Biometric passkey authentication UI",
    ],
    pages: [
      "Executive Dashboard",
      "Asset Holdings",
      "Live Order Book",
      "Transactions & Wires",
      "Tax Harvesting",
      "Multi-Currency Wallet",
      "Scheduled Deposits",
      "Monthly Statements",
      "Risk Tolerances",
      "KYC & Verification",
      "Linked Bank Accounts",
      "Security & Passkeys",
    ],
  },
  {
    id: "cortex-ai",
    name: "Cortex Intelligence Studio",
    tagline: "AI agent orchestrator & model fine-tuning console",
    description:
      "Production dashboard for managing LLM agents, vector embeddings, prompt playground with side-by-side model comparisons, and API token usage metering.",
    category: "AI & Machine Learning",
    pageCount: 11,
    price: "$10",
    badge: "New Release",
    accentColor: "#c084fc",
    features: [
      "Multi-agent swarm execution graph",
      "Prompt comparison playground",
      "Vector database embeddings viewer",
      "Token usage & cost heatmaps",
      "Model fine-tuning progress tracker",
    ],
    pages: [
      "Agent Swarm Orchestrator",
      "Prompt Laboratory",
      "Model Leaderboard",
      "Vector Index Browser",
      "Fine-Tuning Jobs",
      "API Usage & Quotas",
      "Evaluation Datasets",
      "Safety Filters",
      "Live Inference Logs",
      "Billing & Cost Allocations",
      "API Key Management",
    ],
  },
  {
    id: "solstice-commerce",
    name: "Solstice Commerce",
    tagline: "Modern luxury storefront & enterprise merchant backoffice",
    description:
      "Dual-sided template featuring a sleek consumer storefront with liquid glass product showcases, and a robust merchant inventory and fulfillment hub.",
    category: "E-Commerce",
    pageCount: 13,
    price: "$10",
    accentColor: "#fb923c",
    features: [
      "Liquid glass product catalog & quick-view",
      "Dynamic 3-step checkout drawer",
      "Live stock & warehouse sync",
      "Customer lifetime value analytics",
      "Discount rule builder",
    ],
    pages: [
      "Modern Storefront",
      "Product Detail Page",
      "Slide-out Cart & Checkout",
      "Merchant Sales Overview",
      "Product Catalog Grid",
      "Inventory & Warehouses",
      "Order Fulfillment",
      "Customer Directory",
      "Promo & Coupon Engine",
      "Returns & Refunds",
      "Shipping Methods",
      "Analytics & Conversion",
      "Store Settings",
    ],
  },
  {
    id: "pulse-health",
    name: "Pulse Health OS",
    tagline: "Clinical workflows & patient telehealth ecosystem",
    description:
      "Designed for clinics and digital health startups: interactive patient charts, appointment calendar, live telehealth video room UI, and prescription refills.",
    category: "Healthcare & Life Sciences",
    pageCount: 12,
    price: "$10",
    accentColor: "#f43f5e",
    features: [
      "Longitudinal patient health timeline",
      "Doctor appointment scheduling calendar",
      "Telehealth video consultation mockup",
      "e-Prescription and pharmacy routing",
      "HIPAA-conscious privacy layout",
    ],
    pages: [
      "Clinical Schedule",
      "Patient Census Directory",
      "Medical Chart & History",
      "Telehealth Consultation Room",
      "Lab & Diagnostic Results",
      "Prescription Manager",
      "Insurance & Claims",
      "Secure Care Messaging",
      "Vitals Monitoring",
      "Provider Roster",
      "Patient Portal Access",
      "Compliance & Logs",
    ],
  },
  {
    id: "aether-suite",
    name: "Aether Project Suite",
    tagline: "Collaborative product roadmaps & engineering sprint tracker",
    description:
      "High-speed issue tracking, interactive Kanban boards with spring physics, milestone Gantt views, code repo integration, and release velocity reports.",
    category: "Productivity & SaaS",
    pageCount: 10,
    price: "$10",
    accentColor: "#60a5fa",
    features: [
      "Fluid drag-and-drop Kanban columns",
      "Sprint velocity & burndown charts",
      "Milestone roadmap & dependencies",
      "Git commit and branch linking",
      "Keyboard-first command palette",
    ],
    pages: [
      "Active Sprint Board",
      "Product Roadmap",
      "Issue Backlog",
      "Sprint Retrospective",
      "Team Workload Matrix",
      "Repository Releases",
      "Documentation Wiki",
      "Velocity & Burndown",
      "Custom Field Setup",
      "Organization Settings",
    ],
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [purchasedTemplate, setPurchasedTemplate] = useState<TemplateItem | null>(null);

  const categories = ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

  const filteredTemplates =
    activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleBuyClick = (tmpl: TemplateItem) => {
    setPurchasedTemplate(tmpl);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="templates-page">
      {/* Background aurora */}
      <div className="site-aurora" aria-hidden="true" />

      {/* Hero Header */}
      <section className="templates-hero">
        <div className="templates-hero-inner">
          <div className="templates-eyebrow">
            <span className="status-dot ok" />
            <span>Official Application Templates</span>
          </div>

          <h1 className="templates-title">
            Complete Applications.
            <br />
            <span className="templates-title-accent">Built on Liquid Glass.</span>
          </h1>

          <p className="templates-sub">
            Skip months of design and front-end engineering. Every template is a production-grade,
            10+ page application suite featuring Glacia’s optical glass materials, responsive layouts,
            clean Next.js 15 App Router architecture, and full source code.
          </p>

          <div className="templates-meta-badges">
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              10+ Full Pages Each
            </span>
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              Next.js 15 & React 19
            </span>
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              TypeScript & Tailwind
            </span>
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              Only $10 Instant Download
            </span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="templates-filter-wrap">
        <div className="templates-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <section className="templates-grid-section">
        <div className="templates-grid">
          {filteredTemplates.map((template) => (
            <article key={template.id} className="template-card">
              {/* Card visual mockup window */}
              <div className="template-preview-window">
                <div className="preview-top-bar">
                  <div className="preview-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="preview-url">glacia://app/{template.id}</span>
                  <span className="preview-tag">{template.category}</span>
                </div>

                <div className="preview-canvas">
                  {/* Glass Dashboard Simulation */}
                  <div className="preview-mini-sidebar">
                    <div className="mini-avatar" style={{ background: template.accentColor }} />
                    <div className="mini-nav-item active" />
                    <div className="mini-nav-item" />
                    <div className="mini-nav-item" />
                    <div className="mini-nav-item" />
                  </div>

                  <div className="preview-mini-main">
                    <div className="preview-mini-header">
                      <div className="mini-title-bar" />
                      <div className="mini-pill" />
                    </div>

                    <div className="preview-mini-cards">
                      <div className="mini-card mini-glass">
                        <div className="mini-line w-60" />
                        <div
                          className="mini-stat"
                          style={{ color: template.accentColor }}
                        >
                          $482.9k
                        </div>
                        <div className="mini-chart-bar" />
                      </div>
                      <div className="mini-card mini-glass">
                        <div className="mini-line w-40" />
                        <div className="mini-stat">99.98%</div>
                        <div className="mini-chart-bar filled" />
                      </div>
                      <div className="mini-card mini-glass">
                        <div className="mini-line w-50" />
                        <div className="mini-stat">1,420</div>
                        <div className="mini-chart-bar" />
                      </div>
                    </div>

                    <div className="preview-mini-table mini-glass">
                      <div className="mini-table-row head" />
                      <div className="mini-table-row" />
                      <div className="mini-table-row" />
                    </div>
                  </div>
                </div>

                {template.badge && (
                  <span className="template-badge">{template.badge}</span>
                )}
                <span className="template-pages-pill">{template.pageCount} Pages</span>
              </div>

              {/* Card Information */}
              <div className="template-card-body">
                <div className="template-title-row">
                  <h2 className="template-name">{template.name}</h2>
                  <div className="template-price-pill">{template.price}</div>
                </div>

                <p className="template-tagline">{template.tagline}</p>
                <p className="template-desc">{template.description}</p>

                {/* Included features */}
                <div className="template-features">
                  {template.features.slice(0, 4).map((feat, i) => (
                    <div key={i} className="template-feature-item">
                      <CheckIcon width={13} height={13} className="feature-check" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Included pages tags */}
                <div className="template-pages-preview">
                  <span className="pages-label">Included views ({template.pageCount}):</span>
                  <div className="pages-chips">
                    {template.pages.slice(0, 6).map((pageName, idx) => (
                      <span key={idx} className="page-chip">
                        {pageName}
                      </span>
                    ))}
                    {template.pages.length > 6 && (
                      <span className="page-chip more">
                        +{template.pages.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="template-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary buy-btn"
                    onClick={() => handleBuyClick(template)}
                  >
                    <span>Get Template</span>
                    <span className="buy-price">{template.price}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-glass preview-btn"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    Page Directory
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pages inspection modal */}
      {selectedTemplate && (
        <div className="modal-backdrop" onClick={() => setSelectedTemplate(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">{selectedTemplate.name}</h3>
                <p className="modal-sub">
                  Complete directory of all {selectedTemplate.pageCount} views included for{" "}
                  {selectedTemplate.price}
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedTemplate(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-pages-list">
              {selectedTemplate.pages.map((p, idx) => (
                <div key={idx} className="modal-page-row">
                  <span className="page-num">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="page-title">{p}</span>
                  <span className="page-status">Complete · Next.js 15</span>
                </div>
              ))}
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => setSelectedTemplate(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedTemplate(null);
                  handleBuyClick(selectedTemplate);
                }}
              >
                Buy {selectedTemplate.name} · {selectedTemplate.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instant Checkout Demo Modal */}
      {checkoutModalOpen && purchasedTemplate && (
        <div className="modal-backdrop" onClick={() => setCheckoutModalOpen(false)}>
          <div className="modal-dialog checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">Purchase {purchasedTemplate.name}</h3>
                <p className="modal-sub">
                  Instant repository access & full source code · One-time $10
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setCheckoutModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="checkout-body">
              <div className="checkout-summary-card">
                <div className="summary-left">
                  <h4>{purchasedTemplate.name}</h4>
                  <p>{purchasedTemplate.pageCount}+ Responsive Application Views · Full Source</p>
                  <span className="summary-license">Commercial License Included</span>
                </div>
                <div className="summary-right">
                  <div className="summary-amount">$10.00</div>
                  <span className="summary-terms">One-time payment</span>
                </div>
              </div>

              <div className="checkout-features-list">
                <div className="feature-line">
                  <CheckIcon width={14} height={14} className="feature-check" />
                  <span>Immediate GitHub repository access & full .zip bundle</span>
                </div>
                <div className="feature-line">
                  <CheckIcon width={14} height={14} className="feature-check" />
                  <span>All 81 Glacia components & design tokens pre-configured</span>
                </div>
                <div className="feature-line">
                  <CheckIcon width={14} height={14} className="feature-check" />
                  <span>Next.js 15 App Router, React 19, TypeScript, Tailwind</span>
                </div>
                <div className="feature-line">
                  <CheckIcon width={14} height={14} className="feature-check" />
                  <span>Lifetime updates and unlimited client projects</span>
                </div>
              </div>

              <div className="checkout-action-box">
                <a
                  href="https://github.com/binyamfeyissa/Glacia"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary checkout-confirm-btn"
                >
                  Download Source Code · $10
                  <ArrowRightIcon className="arrow" />
                </a>
                <p className="checkout-guarantee">
                  30-day money-back guarantee · Secure payment processing
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="templates-faq-section">
        <div className="section-head">
          <span className="section-kicker">Questions & Answers</span>
          <h2 className="section-title">Everything you need to know.</h2>
        </div>

        <div className="templates-faq-grid">
          <div className="faq-card">
            <h3>What is included in each $10 template?</h3>
            <p>
              You receive the complete production source code (Next.js 15, TypeScript, Tailwind CSS)
              with 10+ fully implemented pages, mock data generators, responsive navigation, dark/light
              mode switching, and all custom Glacia liquid glass components.
            </p>
          </div>

          <div className="faq-card">
            <h3>Can I use the template for client or commercial projects?</h3>
            <p>
              Yes! Every template comes with a perpetual commercial license. You can build SaaS products,
              internal company portals, or client deliverables with zero royalties or recurring fees.
            </p>
          </div>

          <div className="faq-card">
            <h3>How do I receive updates?</h3>
            <p>
              Once you purchase, you receive direct access to the GitHub repository branches with
              regular updates for new Next.js and Glacia releases.
            </p>
          </div>

          <div className="faq-card">
            <h3>Can I customize the liquid glass styling?</h3>
            <p>
              Absolutely. All surface tokens, refraction strengths, specular highlights, and color palettes
              are customizable via simple Tailwind classes or Glacia design tokens.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
