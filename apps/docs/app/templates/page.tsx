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
  // Paid catalogue — all built, sold at launch and after.
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
  { id: "projects", name: "Glacia Projects", tagline: "Project management for product teams", description: "Board, list, calendar and Gantt views over one shared project store, with reports computed from real task data.", platform: "Web", kind: "Paid", screens: "15 screens" },
  { id: "people", name: "Glacia People", tagline: "HR and people admin", description: "Employee directory, org chart, time-off approvals, recruiting pipeline, payroll summary and reviews.", platform: "Web", kind: "Paid", screens: "14 screens" },
  { id: "care", name: "Glacia Care", tagline: "Clinic admin", description: "Appointments, a live patient queue, charts, lab results and billing — with clearly fictional sample patients.", platform: "Web", kind: "Paid", screens: "13 screens" },
  { id: "estates", name: "Glacia Estates", tagline: "Real-estate platform", description: "Public listings with a working mortgage calculator, plus the agent admin: requests, offers and listing management in one shared store.", platform: "Web", kind: "Paid", screens: "20 screens" },
  { id: "exchange", name: "Glacia Exchange", tagline: "Crypto dashboard", description: "Markets, asset pages, a working trade panel, portfolio and price alerts — with simulated prices labelled as such.", platform: "Web", kind: "Paid", screens: "18 screens" },
  { id: "folio", name: "Glacia Folio", tagline: "Portfolio and agency site", description: "Case studies, a studio page, services and a journal for design studios — with an interactive brand-board showcase.", platform: "Web", kind: "Paid", screens: "20 screens" },
  { id: "events", name: "Glacia Events", tagline: "Events platform", description: "Public event pages with tiered ticket checkout, plus the organizer admin: door lists, check-in and orders.", platform: "Web", kind: "Paid", screens: "18 screens" },
  { id: "bookings", name: "Glacia Bookings", tagline: "Appointment booking platform", description: "A four-step booking flow with a real slot engine, plus the business diary, services and opening-hours admin.", platform: "Web", kind: "Paid", screens: "16 screens" },
  { id: "desk", name: "Glacia Desk", tagline: "Support helpdesk", description: "A three-pane ticket inbox with internal notes and macros, a knowledge base, customers and reports.", platform: "Web", kind: "Paid", screens: "16 screens" },
  { id: "files", name: "Glacia Files", tagline: "File storage app", description: "Folders, sharing, starred and trash views with a live storage meter — uploads stay in the browser, nothing leaves the machine.", platform: "Web", kind: "Paid", screens: "14 screens" },
  { id: "studio", name: "Glacia Studio", tagline: "Creative studio manager", description: "Client projects, a live time tracker, milestones and invoicing built from unbilled time entries.", platform: "Web", kind: "Paid", screens: "16 screens" },
  { id: "enterprise", name: "Glacia Enterprise", tagline: "Enterprise admin console", description: "Users and roles, a security centre with API keys, audit log with CSV export, integrations, system status and a report builder.", platform: "Web", kind: "Paid", screens: "20 screens" },
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
  { id: "food-fleet", name: "Glacia Fleet", tagline: "Courier and delivery-driver app", description: "Job offers with a live countdown, a four-stage active delivery flow, earnings and ratings.", platform: "Mobile", kind: "Paid", screens: "10 screens" },
  { id: "calm", name: "Glacia Calm", tagline: "Meditation and sleep app", description: "A session player with a sleep timer, guided breathing patterns and a sound mixer (simulated playback).", platform: "Mobile", kind: "Paid", screens: "9 screens" },
  { id: "ride", name: "Glacia Ride", tagline: "Ride-hailing app", description: "Destination picker, driver matching flow and a fare engine whose breakdown adds up to the cent.", platform: "Mobile", kind: "Paid", screens: "10 screens" },
  { id: "tunes", name: "Glacia Tunes", tagline: "Music player app", description: "A full player with a real queue: shuffle and repeat that work, playlists, liked songs and a mini player.", platform: "Mobile", kind: "Paid", screens: "10 screens" },
  { id: "cast", name: "Glacia Cast", tagline: "Podcast app", description: "Show pages, a speed-aware player with sleep timer, downloads and an up-next queue.", platform: "Mobile", kind: "Paid", screens: "11 screens" },
  { id: "news", name: "Glacia News", tagline: "News reader app", description: "Topic feeds, a morning briefing, bookmarks and an article reader with adjustable text size.", platform: "Mobile", kind: "Paid", screens: "9 screens" },
  { id: "learn", name: "Glacia Learn", tagline: "Course app", description: "Course pages, a lesson player, a scored quiz with a certificate card, and progress that follows you.", platform: "Mobile", kind: "Paid", screens: "10 screens" },
  { id: "health", name: "Glacia Health", tagline: "Health tracker app", description: "Hand-logged steps, water, sleep, weight and habits with trends — sample data, no sensors, clearly labelled.", platform: "Mobile", kind: "Paid", screens: "8 screens" },
  { id: "homes", name: "Glacia Homes", tagline: "Property app", description: "Property search with filters, viewing bookings, saved homes and a live mortgage calculator.", platform: "Mobile", kind: "Paid", screens: "9 screens" },
  { id: "jobs", name: "Glacia Jobs", tagline: "Job board app", description: "Skill-match scores that recompute from your editable profile, an apply flow and application timelines.", platform: "Mobile", kind: "Paid", screens: "11 screens" },
  { id: "date", name: "Glacia Date", tagline: "Dating app", description: "A profile card deck with matches, a likes-you list and working chats with fictional profiles.", platform: "Mobile", kind: "Paid", screens: "6 screens" },
  { id: "stream", name: "Glacia Stream", tagline: "Video streaming app", description: "Catalogue rails, a resumable simulated player, downloads and autoplay-next-episode.", platform: "Mobile", kind: "Paid", screens: "7 screens" },
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
                    <span className="page-chip more">Built — available at launch</span>
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
            full paid catalogue — 22 web and 22 mobile templates — on sale.
          </p>
        </div>
      </section>
    </div>
  );
}
