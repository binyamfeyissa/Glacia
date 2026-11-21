"use client";

import { useState } from "react";
import { CheckIcon, ShieldIcon, SparkIcon } from "../../components/icons";

interface TemplateItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  platform: "Web" | "Mobile";
  kind: "Free" | "Paid";
  screens: string;
}

const TEMPLATES: TemplateItem[] = [
  // The five free templates — deliberately minimal, built first.
  {
    id: "auth-kit",
    name: "Auth Kit",
    tagline: "Sign in, sign up, and account recovery for the web",
    description:
      "The front door of the Admin Core dashboard: login, registration, password reset, and verification screens in Liquid Glass.",
    platform: "Web",
    kind: "Free",
    screens: "6 screens",
  },
  {
    id: "pricing-billing",
    name: "Pricing + Billing",
    tagline: "Pricing tables and a working billing settings flow",
    description:
      "Plan comparison, checkout-ready pricing sections, and the billing pages every SaaS needs, built from Glacia components.",
    platform: "Web",
    kind: "Free",
    screens: "5 screens",
  },
  {
    id: "landing-kit",
    name: "Landing Kit",
    tagline: "A minimal marketing page that shows the glass off",
    description:
      "Hero, features, and call-to-action sections with real Liquid Glass surfaces — the fastest way to feel the library.",
    platform: "Web",
    kind: "Free",
    screens: "4 sections",
  },
  {
    id: "onboarding-flow",
    name: "Onboarding Flow",
    tagline: "First-run walkthrough screens for React Native",
    description:
      "Swipeable intro screens with glass cards and a clean finish into sign-in. The screen set every app rebuilds by hand.",
    platform: "Mobile",
    kind: "Free",
    screens: "5 screens",
  },
  {
    id: "profile-settings",
    name: "Profile + Settings",
    tagline: "Profile, edit, notifications, and appearance for mobile",
    description:
      "The settings stack nobody enjoys building: profile, edit profile, notification preferences, and appearance, in glass.",
    platform: "Mobile",
    kind: "Free",
    screens: "6 screens",
  },
  // Paid catalogue — in production now, sold at launch and after.
  { id: "admin-core", name: "Glacia Admin Core", tagline: "SaaS analytics dashboard", description: "The flagship web dashboard: overview, analytics, users, and settings as a full routed Next.js app.", platform: "Web", kind: "Paid", screens: "14 screens" },
  { id: "admin-suite", name: "Glacia Admin Suite", tagline: "Full admin app — mail, chat, kanban, calendar", description: "The complete admin: dashboards plus mail, chat, kanban, calendar, and file screens in one app.", platform: "Web", kind: "Paid", screens: "30 screens" },
  { id: "storefront", name: "Glacia Storefront", tagline: "E-commerce storefront", description: "Catalogue, product, cart, and checkout flows with glass product surfaces throughout.", platform: "Web", kind: "Paid", screens: "28 screens" },
  { id: "crm", name: "Glacia CRM", tagline: "Customer relationship dashboard", description: "Pipeline, contacts, deals, and activity timelines built for daily sales work.", platform: "Web", kind: "Paid", screens: "22 screens" },
  { id: "ai-console", name: "Glacia AI Console", tagline: "AI chat and SaaS console", description: "Chat-first product shell with model pickers, usage metering, and team settings.", platform: "Web", kind: "Paid", screens: "16 screens" },
  { id: "finance-web", name: "Glacia Finance", tagline: "Banking and finance dashboard", description: "Accounts, cards, transfers, and statements — the fintech layout set, in glass.", platform: "Web", kind: "Paid", screens: "20 screens" },
  { id: "launch", name: "Glacia Launch", tagline: "SaaS marketing site kit", description: "A complete marketing site: landing, pricing, blog, and docs shells that match the product.", platform: "Web", kind: "Paid", screens: "18 screens" },
  { id: "commerce-admin", name: "Glacia Commerce Admin", tagline: "E-commerce admin", description: "Orders, products, inventory, and customers for running a store day to day.", platform: "Web", kind: "Paid", screens: "24 screens" },
  { id: "academy", name: "Glacia Academy", tagline: "Course platform", description: "Course catalogue, player, progress, and instructor views for learning products.", platform: "Web", kind: "Paid", screens: "22 screens" },
  { id: "docs", name: "Glacia Docs", tagline: "Documentation site", description: "A docs site shell with search, navigation, and article layouts — like this one, in glass.", platform: "Web", kind: "Paid", screens: "12 screens" },
  { id: "bank", name: "Glacia Bank", tagline: "Mobile banking app", description: "Accounts, cards, transfers, and statements as a complete React Native app.", platform: "Mobile", kind: "Paid", screens: "24 screens" },
  { id: "food", name: "Glacia Food", tagline: "Food delivery app", description: "Browse, order, track: the full delivery flow with glass order surfaces.", platform: "Mobile", kind: "Paid", screens: "22 screens" },
  { id: "shop", name: "Glacia Shop", tagline: "Mobile commerce app", description: "Catalogue, product, cart, and checkout for a phone-first store.", platform: "Mobile", kind: "Paid", screens: "20 screens" },
  { id: "fit", name: "Glacia Fit", tagline: "Fitness tracking app", description: "Workouts, activity rings, and history with glass stat surfaces.", platform: "Mobile", kind: "Paid", screens: "18 screens" },
  { id: "wallet", name: "Glacia Wallet", tagline: "Payments wallet app", description: "Balances, send and request flows, and transaction history in glass.", platform: "Mobile", kind: "Paid", screens: "18 screens" },
  { id: "chat", name: "Glacia Chat", tagline: "Messaging app", description: "Conversations, threads, and media messages with glass bubbles and bars.", platform: "Mobile", kind: "Paid", screens: "16 screens" },
  { id: "grocery", name: "Glacia Grocery", tagline: "Grocery delivery app", description: "Aisles, lists, and scheduled delivery flows for grocery products.", platform: "Mobile", kind: "Paid", screens: "18 screens" },
  { id: "travel", name: "Glacia Travel", tagline: "Travel booking app", description: "Search, stays, and itinerary screens for travel products.", platform: "Mobile", kind: "Paid", screens: "20 screens" },
  { id: "social", name: "Glacia Social", tagline: "Social app shell", description: "Feed, profile, and post composer — the social starter set in glass.", platform: "Mobile", kind: "Paid", screens: "18 screens" },
  { id: "spend", name: "Glacia Spend", tagline: "Expense tracking app", description: "Budgets, categories, and spending insights for personal finance.", platform: "Mobile", kind: "Paid", screens: "16 screens" },
];

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
            documented on this site — no mockups, no placeholder screens. The five free
            templates are finished; the paid catalogue is in production now, and the store
            opens at launch.
          </p>
          <div className="templates-meta-badges">
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              5 free templates at launch
            </span>
            <span className="meta-badge">
              <CheckIcon width={14} height={14} />
              20+ web and 20+ mobile on the way
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
            <article key={template.id} className="template-card">
              <div className="template-card-body">
                <div className="template-title-row">
                  <h2 className="template-name">{template.name}</h2>
                  <div className="template-price-pill">
                    {template.kind === "Free" ? "Free" : "Paid"}
                  </div>
                </div>
                <p className="template-tagline">{template.tagline}</p>
                <p className="template-desc">{template.description}</p>
                <div className="template-pages-preview">
                  <div className="pages-chips">
                    <span className="page-chip">{template.platform}</span>
                    <span className="page-chip">{template.screens}</span>
                    <span className="page-chip more">In production — available at launch</span>
                  </div>
                </div>
              </div>
            </article>
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
            first paid templates on sale. The rest of the catalogue lands in the days after,
            in the order shown above.
          </p>
        </div>
      </section>
    </div>
  );
}
