/**
 * The template catalogue — single source for the listing page and the
 * per-template detail pages. Prices: the owner set an $8–$17 range on
 * 2026-11-22, then directed the least amount on 2026-11-23 — every paid
 * template is $8 flat, matching the Dodo products.
 * `shotId` is the screenshot folder under /template-shots/ when it differs
 * from the page id (the Finance template's folder is "finance").
 */
export interface TemplateItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  platform: "Web" | "Mobile";
  kind: "Free" | "Paid";
  screens: string;
  price: number; // USD, 0 for free
  shotId?: string;
  features: string[];
}

export const TEMPLATES: TemplateItem[] = [
  // The five free templates — deliberately minimal, built first.
  {
    id: "auth-kit", name: "Auth Kit", tagline: "Sign in, sign up, and account recovery for the web",
    description: "The front door of the Admin Core dashboard: login, registration, password reset, and verification screens in Liquid Glass.",
    platform: "Web", kind: "Free", screens: "6 screens", price: 0,
    features: ["Six routed screens: sign-in, sign-up, forgot, reset, verify, two-factor", "Live password-strength meter", "Verification-code input with a working resend countdown", "Recovery-code sign-in option", "Built entirely from Glacia form components"],
  },
  {
    id: "pricing-billing", name: "Pricing + Billing", tagline: "Pricing tables and a working billing settings flow",
    description: "Plan comparison, checkout-ready pricing sections, and the billing pages every SaaS needs, built from Glacia components.",
    platform: "Web", kind: "Free", screens: "5 screens", price: 0,
    features: ["Pricing page with a monthly/yearly toggle that reprices", "Plan comparison table and FAQ accordion", "Billing settings with live usage meters", "Add-payment-card dialog with full validation", "Plan switching updates the plan card"],
  },
  {
    id: "landing-kit", name: "Landing Kit", tagline: "A minimal marketing page that shows the glass off",
    description: "Hero, features, and call-to-action sections with real Liquid Glass surfaces — the fastest way to feel the library.",
    platform: "Web", kind: "Free", screens: "4 sections", price: 0,
    features: ["Eight marketing sections, all interactive", "Component showcase tabs with real components", "Pricing switch that actually reprices the plans", "Validated invite form", "Real Glacia surfaces throughout — no mockups"],
  },
  {
    id: "onboarding-flow", name: "Onboarding Flow", tagline: "First-run walkthrough screens for React Native",
    description: "Swipeable intro screens with glass cards and a clean finish into sign-in. The screen set every app rebuilds by hand.",
    platform: "Mobile", kind: "Free", screens: "5 screens", price: 0,
    features: ["Four-screen swipeable pager", "Skip, Next and progress that all work", "Finish screen with validated email capture", "Runs on iOS, Android and web via Expo", "Glass cards over a photo backdrop"],
  },
  {
    id: "profile-settings", name: "Profile + Settings", tagline: "Profile, edit, notifications, and appearance for mobile",
    description: "The settings stack nobody enjoys building: profile, edit profile, notification preferences, and appearance, in glass.",
    platform: "Mobile", kind: "Free", screens: "6 screens", price: 0,
    features: ["Six screens: profile, edit, notifications, appearance, security, about", "Glacia's own TabBar as the tab bar", "Working toggles, pickers and forms", "Light and dark appearance switching", "Expo Router navigation throughout"],
  },
  // Paid web catalogue.
  { id: "admin-core", name: "Glacia Admin Core", tagline: "SaaS analytics dashboard", description: "The flagship web dashboard: overview, analytics, users, and settings as a full routed Next.js app.", platform: "Web", kind: "Paid", screens: "14 screens", price: 8,
    features: ["14 routed screens for a SaaS admin", "⌘K command palette with working search", "API-key create and revoke flow", "Add-product dialog", "Charts and data tables from the real package"] },
  { id: "admin-suite", name: "Glacia Admin Suite", tagline: "Full admin app — mail, chat, kanban, calendar", description: "The complete admin: dashboards plus mail, chat, kanban, calendar, and file screens in one app.", platform: "Web", kind: "Paid", screens: "30 screens", price: 8,
    features: ["Everything in Admin Core, plus mail, chat and kanban", "Drag-and-drop board (desktop)", "Calendar, files, tasks and invoices", "Team, roles matrix and activity screens", "49 static pages in one shared shell"] },
  { id: "storefront", name: "Glacia Storefront", tagline: "E-commerce storefront", description: "Catalogue, product, cart, and checkout flows with glass product surfaces throughout.", platform: "Web", kind: "Paid", screens: "28 screens", price: 8,
    features: ["16-product catalogue with real product pages", "Cart persisted in localStorage", "Promo code GLASS10 takes 10% off", "Full checkout with order numbers", "Product visuals composed in CSS — no image files needed"] },
  { id: "crm", name: "Glacia CRM", tagline: "Customer relationship dashboard", description: "Pipeline, contacts, deals, and activity timelines built for daily sales work.", platform: "Web", kind: "Paid", screens: "22 screens", price: 8,
    features: ["Five-stage pipeline with drag-and-drop", "Deals, contacts and tasks in one shared store", "Stage renames propagate across the whole app", "Activity timelines and reports", "Data persists in the browser"] },
  { id: "ai-console", name: "Glacia AI Console", tagline: "AI chat and SaaS console", description: "Chat-first product shell with model pickers, usage metering, and team settings.", platform: "Web", kind: "Paid", screens: "16 screens", price: 8,
    features: ["Playground with simulated streaming responses", "Live token counter and stop control", "Models, API keys, usage and logs screens", "Prompt library and billing pages", "Clearly labelled demo mode — no API key needed"] },
  { id: "finance-web", shotId: "finance", name: "Glacia Finance", tagline: "Banking and finance dashboard", description: "Accounts, cards, transfers, and statements — the fintech layout set, in glass.", platform: "Web", kind: "Paid", screens: "20 screens", price: 8,
    features: ["Accounts, transactions, budgets, goals and bills in one store", "Net worth and budgets computed from the data", "Currency switch re-formats every figure", "Portfolio view with holdings", "Seed data generated relative to today"] },
  { id: "launch", name: "Glacia Launch", tagline: "SaaS marketing site kit", description: "A complete marketing site: landing, pricing, blog, and docs shells that match the product.", platform: "Web", kind: "Paid", screens: "18 screens", price: 8,
    features: ["Marketing site plus docs and blog shells", "Working miniature product demo in the hero", "Waitlist with referral codes that persist", "Changelog and structured docs articles", "Live interactive feature demos"] },
  { id: "commerce-admin", name: "Glacia Commerce Admin", tagline: "E-commerce admin", description: "Orders, products, inventory, and customers for running a store day to day.", platform: "Web", kind: "Paid", screens: "24 screens", price: 8,
    features: ["Back office for the Storefront catalogue (same 16 products)", "Order status flow with refunds that update revenue", "Stock steppers and low-stock states", "Review moderation", "One shared persisted store"] },
  { id: "academy", name: "Glacia Academy", tagline: "Course platform", description: "Course catalogue, player, progress, and instructor views for learning products.", platform: "Web", kind: "Paid", screens: "22 screens", price: 8,
    features: ["Nine courses with full curricula", "Lesson player that tracks completion", "Enrolments, notes and progress in a persisted store", "Instructor and student views", "Simulated playback, honestly labelled"] },
  { id: "docs", name: "Glacia Docs", tagline: "Documentation site", description: "A docs site shell with search, navigation, and article layouts — like this one, in glass.", platform: "Web", kind: "Paid", screens: "12 screens", price: 8,
    features: ["⌘K search over a shared index", "Six guides with generated tables of contents", "Ten API endpoint pages with try-it panels", "Changelog, search page and support", "Simulated responses, clearly labelled"] },
  { id: "projects", name: "Glacia Projects", tagline: "Project management for product teams", description: "Board, list, calendar and Gantt views over one shared project store, with reports computed from real task data.", platform: "Web", kind: "Paid", screens: "15 screens", price: 8,
    features: ["Board, list, calendar, Gantt and my-tasks views", "Project progress computed from task status", "Reports charted from real completion dates", "Team and settings screens", "One persisted store across all views"] },
  { id: "people", name: "Glacia People", tagline: "HR and people admin", description: "Employee directory, org chart, time-off approvals, recruiting pipeline, payroll summary and reviews.", platform: "Web", kind: "Paid", screens: "14 screens", price: 8,
    features: ["24 employees with a real manager hierarchy", "Org chart rendered from manager links", "Time-off approvals that update balances", "Recruiting pipelines and reviews", "Payroll summary, labelled as sample figures"] },
  { id: "care", name: "Glacia Care", tagline: "Clinic admin", description: "Appointments, a live patient queue, charts, lab results and billing — with clearly fictional sample patients.", platform: "Web", kind: "Paid", screens: "13 screens", price: 8,
    features: ["Appointment book with a live status flow", "Patient queue: check-in to consultation to done", "20 fictional patients with charts and lab results", "Billing and settings screens", "Sample-data framing throughout"] },
  { id: "estates", name: "Glacia Estates", tagline: "Real-estate platform", description: "Public listings with a working mortgage calculator, plus the agent admin: requests, offers and listing management in one shared store.", platform: "Web", kind: "Paid", screens: "20 screens", price: 8,
    features: ["Public listings site plus agent admin", "Working mortgage calculator (real amortisation)", "Viewing requests land in the admin inbox", "Accepting an offer marks the listing sold", "One store drives both sides"] },
  { id: "exchange", name: "Glacia Exchange", tagline: "Crypto dashboard", description: "Markets, asset pages, a working trade panel, portfolio and price alerts — with simulated prices labelled as such.", platform: "Web", kind: "Paid", screens: "18 screens", price: 8,
    features: ["14 fixture assets with markets and asset pages", "Optional live-price simulation ticker", "Trade panel updates holdings and wallet", "Price alerts that fire when targets cross", "All prices labelled simulated"] },
  { id: "folio", name: "Glacia Folio", tagline: "Portfolio and agency site", description: "Case studies, a studio page, services and a journal for design studios — with an interactive brand-board showcase.", platform: "Web", kind: "Paid", screens: "20 screens", price: 8,
    features: ["Eight case studies and three full journal essays", "Interactive brand-board that re-skins the site", "Services, studio and contact pages", "Contact form shows exactly what was submitted", "Nothing leaves the browser"] },
  { id: "events", name: "Glacia Events", tagline: "Events platform", description: "Public event pages with tiered ticket checkout, plus the organizer admin: door lists, check-in and orders.", platform: "Web", kind: "Paid", screens: "18 screens", price: 8,
    features: ["12 events with public pages and tiered tickets", "Checkout issues order references", "Organizer admin with door lists and check-in", "Attendee lists generated to match sales exactly", "Dates always relative to today"] },
  { id: "bookings", name: "Glacia Bookings", tagline: "Appointment booking platform", description: "A four-step booking flow with a real slot engine, plus the business diary, services and opening-hours admin.", platform: "Web", kind: "Paid", screens: "16 screens", price: 8,
    features: ["Four-step booking flow with per-step validation", "Real slot engine — no double bookings", "Studio diary, services and opening hours", "Cancelling frees the slot immediately", "Built for salons, spas and studios"] },
  { id: "desk", name: "Glacia Desk", tagline: "Support helpdesk", description: "A three-pane ticket inbox with internal notes and macros, a knowledge base, customers and reports.", platform: "Web", kind: "Paid", screens: "16 screens", price: 8,
    features: ["Three-pane ticket inbox", "Internal notes styled apart from public replies", "Macros that personalise replies in one click", "Knowledge base and customer screens", "Reports computed from the ticket store"] },
  { id: "files", name: "Glacia Files", tagline: "File storage app", description: "Folders, sharing, starred and trash views with a live storage meter — uploads stay in the browser, nothing leaves the machine.", platform: "Web", kind: "Paid", screens: "14 screens", price: 8,
    features: ["Folders, shared, starred, recent and trash views", "Real file uploads with in-browser previews", "Storage meter with a plan switcher that changes quota", "Trashed files still count — stated on the page", "File bytes never leave the browser"] },
  { id: "studio", name: "Glacia Studio", tagline: "Creative studio manager", description: "Client projects, a live time tracker, milestones and invoicing built from unbilled time entries.", platform: "Web", kind: "Paid", screens: "16 screens", price: 8,
    features: ["Client projects, milestones and time tracking", "A live timer that survives navigation and reloads", "Invoices built from unbilled time entries", "Entries cannot be billed twice", "Amounts snapshot at issue time"] },
  { id: "enterprise", name: "Glacia Enterprise", tagline: "Enterprise admin console", description: "Users and roles, a security centre with API keys, audit log with CSV export, integrations, system status and a report builder.", platform: "Web", kind: "Paid", screens: "20 screens", price: 8,
    features: ["Users, roles and a security centre", "API keys generated in the browser, shown once", "Audit log with real CSV export", "Integrations and system status", "Report builder with real downloads"] },
  // Paid mobile catalogue.
  { id: "bank", name: "Glacia Bank", tagline: "Mobile banking app", description: "Accounts, cards, transfers, and statements as a complete React Native app.", platform: "Mobile", kind: "Paid", screens: "24 screens", price: 8,
    features: ["12 screens: accounts, cards, activity, profile and more", "Hide-balances toggle masks amounts app-wide", "Card freeze switch changes the card state", "Send money validates against the live balance", "Manual dark mode re-themes the whole app"] },
  { id: "food", name: "Glacia Food", tagline: "Food delivery app", description: "Browse, order, track: the full delivery flow with glass order surfaces.", platform: "Mobile", kind: "Paid", screens: "22 screens", price: 8,
    features: ["Restaurant browse, menus and item pages", "One-restaurant cart rule, enforced politely", "Promo code FORK10", "Live order tracking that advances step by step", "Reorder refills the cart in one tap"] },
  { id: "shop", name: "Glacia Shop", tagline: "Mobile commerce app", description: "Catalogue, product, cart, and checkout for a phone-first store.", platform: "Mobile", kind: "Paid", screens: "20 screens", price: 8,
    features: ["12 products mirroring the web Storefront", "Finish chips re-tint the product visual live", "Cart, checkout and order history", "Promo code GLASS10", "Buy-again from past orders"] },
  { id: "fit", name: "Glacia Fit", tagline: "Fitness tracking app", description: "Workouts, activity rings, and history with glass stat surfaces.", platform: "Mobile", kind: "Paid", screens: "18 screens", price: 8,
    features: ["Workout player with a ticking rest countdown", "Proportional set logging", "Step ring and weekly bars built from primitives", "Activity history and stats", "No chart library — all Glacia"] },
  { id: "wallet", name: "Glacia Wallet", tagline: "Payments wallet app", description: "Balances, send and request flows, and transaction history in glass.", platform: "Mobile", kind: "Paid", screens: "18 screens", price: 8,
    features: ["Multi-asset: cash plus BTC, ETH and SOL fixtures", "Buy, sell and swap with a 0.5% fee shown", "Display currency re-values the portfolio", "Prices labelled simulated", "Request code is a labelled placeholder"] },
  { id: "chat", name: "Glacia Chat", tagline: "Messaging app", description: "Conversations, threads, and media messages with glass bubbles and bars.", platform: "Mobile", kind: "Paid", screens: "16 screens", price: 8,
    features: ["Conversation list, threads and chat settings", "Bubbles composed from Glacia's Glass primitive", "Typing and read states", "Media message layouts", "Full Expo Router navigation"] },
  { id: "grocery", name: "Glacia Grocery", tagline: "Grocery delivery app", description: "Aisles, lists, and scheduled delivery flows for grocery products.", platform: "Mobile", kind: "Paid", screens: "18 screens", price: 8,
    features: ["Aisle-first catalogue model", "Delivery slots woven through cart and checkout", "Shopping lists as a first-class tab", "Free-delivery progress at $40", "Slot days generated from the real calendar"] },
  { id: "travel", name: "Glacia Travel", tagline: "Travel booking app", description: "Search, stays, and itinerary screens for travel products.", platform: "Mobile", kind: "Paid", screens: "20 screens", price: 8,
    features: ["12 stays with search and detail pages", "Booking flow with real formatted dates", "12% service fee shown in the breakdown", "Booking references on confirmation", "Demo booking — no payment taken"] },
  { id: "social", name: "Glacia Social", tagline: "Social app shell", description: "Feed, profile, and post composer — the social starter set in glass.", platform: "Mobile", kind: "Paid", screens: "18 screens", price: 8,
    features: ["Feed, explore, profiles and post composer", "Stories viewer with timed segments", "Create-post with gradient tile picker and tag extraction", "Follow and like state consistent everywhere", "Full tab navigation"] },
  { id: "spend", name: "Glacia Spend", tagline: "Expense tracking app", description: "Budgets, categories, and spending insights for personal finance.", platform: "Mobile", kind: "Paid", screens: "16 screens", price: 8,
    features: ["54 transactions of computed sample data", "Budgets, categories and insights from real sums", "Bills view with honest over-budget states", "Month-over-month deltas, computed not scripted", "Fixtures pinned to the current season"] },
  { id: "food-fleet", name: "Glacia Fleet", tagline: "Courier and delivery-driver app", description: "Job offers with a live countdown, a four-stage active delivery flow, earnings and ratings.", platform: "Mobile", kind: "Paid", screens: "10 screens", price: 8,
    features: ["Online/offline switch that greys the job feed", "Job offers with a real 30-second countdown", "Four-stage active delivery flow", "Earnings with same-day cash out", "Ratings and job history"] },
  { id: "calm", name: "Glacia Calm", tagline: "Meditation and sleep app", description: "A session player with a sleep timer, guided breathing patterns and a sound mixer (simulated playback).", platform: "Mobile", kind: "Paid", screens: "9 screens", price: 8,
    features: ["Session player on a real one-second clock", "Sleep timer that fades to a good-night state", "Breathing exercises with three patterns", "Sound mixer (simulated, labelled)", "Speed control and quick skips"] },
  { id: "ride", name: "Glacia Ride", tagline: "Ride-hailing app", description: "Destination picker, driver matching flow and a fare engine whose breakdown adds up to the cent.", platform: "Mobile", kind: "Paid", screens: "10 screens", price: 8,
    features: ["Composed map panel built from plain views", "One fare engine — quotes match receipts to the cent", "Trip stages advance with labelled simulate buttons", "Saved places and activity history", "Transparent fare breakdown"] },
  { id: "tunes", name: "Glacia Tunes", tagline: "Music player app", description: "A full player with a real queue: shuffle and repeat that work, playlists, liked songs and a mini player.", platform: "Mobile", kind: "Paid", screens: "10 screens", price: 8,
    features: ["Real playback engine with a working queue", "Shuffle and repeat modes that behave correctly", "Mini player docked above the tab bar", "Playlists and liked songs", "Listening stats from seconds actually played"] },
  { id: "cast", name: "Glacia Cast", tagline: "Podcast app", description: "Show pages, a speed-aware player with sleep timer, downloads and an up-next queue.", platform: "Mobile", kind: "Paid", screens: "11 screens", price: 8,
    features: ["Six shows with four episodes each", "Playback speed genuinely changes the tick rate", "Sleep timer including end-of-episode", "Downloads with a real storage budget", "Up-next queue that auto-advances"] },
  { id: "news", name: "Glacia News", tagline: "News reader app", description: "Topic feeds, a morning briefing, bookmarks and an article reader with adjustable text size.", platform: "Mobile", kind: "Paid", screens: "9 screens", price: 8,
    features: ["14 fully written fictional articles", "Topic feeds and a morning briefing", "Reading-progress bar driven by scroll", "Text size controls that persist app-wide", "Bookmarks and reading history"] },
  { id: "learn", name: "Glacia Learn", tagline: "Course app", description: "Course pages, a lesson player, a scored quiz with a certificate card, and progress that follows you.", platform: "Mobile", kind: "Paid", screens: "10 screens", price: 8,
    features: ["Eight courses with 49 full lessons", "Player that marks lessons complete", "Five-question quiz with a pass certificate", "Certificates saved in My Learning", "Streak and stats computed from progress"] },
  { id: "health", name: "Glacia Health", tagline: "Health tracker app", description: "Hand-logged steps, water, sleep, weight and habits with trends — sample data, no sensors, clearly labelled.", platform: "Mobile", kind: "Paid", screens: "8 screens", price: 8,
    features: ["Hand-logged steps, water, sleep, weight and habits", "14 days of sample data, clearly labelled", "Water logging keeps an honest audit trail", "Trends and history views", "Tracking language only — no medical claims"] },
  { id: "homes", name: "Glacia Homes", tagline: "Property app", description: "Property search with filters, viewing bookings, saved homes and a live mortgage calculator.", platform: "Mobile", kind: "Paid", screens: "9 screens", price: 8,
    features: ["12 properties with composed scene visuals", "Search with working filters", "Viewing bookings with taken-slot logic", "Mortgage calculator at a stated illustrative rate", "Saved homes and price alerts"] },
  { id: "jobs", name: "Glacia Jobs", tagline: "Job board app", description: "Skill-match scores that recompute from your editable profile, an apply flow and application timelines.", platform: "Mobile", kind: "Paid", screens: "11 screens", price: 8,
    features: ["12 fictional jobs at 8 invented companies", "Match score computed from your editable skills", "Scores update everywhere when skills change", "Apply flow and application timelines", "Saved jobs and profile tabs"] },
  { id: "date", name: "Glacia Date", tagline: "Dating app", description: "A profile card deck with matches, a likes-you list and working chats with fictional profiles.", platform: "Mobile", kind: "Paid", screens: "6 screens", price: 8,
    features: ["Card deck of fictional profiles (adults 25–35)", "Pass, like and limited super likes", "Matches with a working chat", "A canned reply per message, for demo life", "Discovery filters that genuinely filter"] },
  { id: "stream", name: "Glacia Stream", tagline: "Video streaming app", description: "Catalogue rails, a resumable simulated player, downloads and autoplay-next-episode.", platform: "Mobile", kind: "Paid", screens: "7 screens", price: 8,
    features: ["14 fictional titles, films and series", "Player that resumes where you stopped", "Autoplay next episode with a cancellable countdown", "Downloads and maturity filtering", "Watch stats summed from real positions"] },
];

export function getTemplate(id: string): TemplateItem | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function shotPath(t: TemplateItem, n: number): string {
  return `/template-shots/${t.shotId ?? t.id}/${n}.jpg`;
}

/** Label for a gallery shot: 1–3 dark, 4 light, 5 image background. */
export function shotLabel(n: number): string {
  if (n === 4) return "Light";
  if (n === 5) return "Image";
  return `Dark ${n}`;
}

export function stackLine(t: TemplateItem): string {
  return t.platform === "Web"
    ? "Next.js 15 · React 19 · TypeScript · glacia"
    : "Expo · React Native · TypeScript · glacia-native";
}
