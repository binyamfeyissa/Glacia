import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AdminDashboard,
  LoginPage,
  SettingsBlock,
  ProfileBlock,
  SignupBlock,
  CalendarPageBlock,
  PricingBlock,
  LandingBlock,
  ForgotPasswordBlock,
  ErrorPageBlock,
} from "glacia";
import { CodeBlock } from "../../../components/code-block";
import { ArrowRightIcon, SparkIcon } from "../../../components/icons";

const BACKDROP = "/hero/tahoe-dark.jpg";

const BLOCKS = [
  {
    slug: "dashboard",
    title: "Admin dashboard",
    description:
      "A complete administration screen with a floating glass sidebar, live KPI cards, revenue flow, and an orders table. Built from Sidebar, Card, Badge, Button, and Table.",
    componentsUsed: ["Sidebar", "Card", "Badge", "Button", "Table"],
    code: `import { AdminDashboard } from "glacia";

export default function DashboardRoute() {
  return <AdminDashboard />;
}`,
  },
  {
    slug: "login",
    title: "Login page",
    description:
      "A production-ready authentication screen with a centered glass card, email and password fields, OAuth providers, and remember-me. Also available in a split layout.",
    componentsUsed: ["Card", "Input", "Button", "Label", "Checkbox", "Separator"],
    code: `import { LoginPage } from "glacia";

export default function LoginRoute() {
  return (
    <LoginPage
      layout="centered"
      onSubmit={() => console.log("Login submitted")}
    />
  );
}`,
  },
  {
    slug: "settings",
    title: "System settings",
    description:
      "An authentic Apple macOS/iPadOS Preferences window with a categorized glass sidebar, appearance options, haptics, and volume controls.",
    componentsUsed: ["Sidebar", "Card", "Item", "Switch", "Slider", "SegmentedControl", "Button", "Avatar", "Separator"],
    code: `import { SettingsBlock } from "glacia";

export default function SettingsRoute() {
  return <SettingsBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "profile",
    title: "User profile",
    description:
      "Apple ID contact card profile with an avatar hero, linked Apple devices, verification badge, and contact action buttons.",
    componentsUsed: ["Card", "Item", "Avatar", "Badge", "Button", "Separator"],
    code: `import { ProfileBlock } from "glacia";

export default function ProfileRoute() {
  return <ProfileBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "signup",
    title: "Account registration",
    description:
      "Apple onboarding account creation screen with real-time animated password strength meter, passkey option, and terms agreement.",
    componentsUsed: ["Card", "Input", "Button", "Label", "Checkbox", "Separator"],
    code: `import { SignupBlock } from "glacia";

export default function SignupRoute() {
  return <SignupBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "calendar-page",
    title: "Calendar application",
    description:
      "A complete Apple macOS Calendar app with left sidebar mini-picker, iCloud account categories, upcoming agenda, and 7-column month grid with interactive event pills.",
    componentsUsed: ["Calendar", "SegmentedControl", "Glass", "Button", "Badge"],
    code: `import { CalendarPageBlock } from "glacia";

export default function CalendarRoute() {
  return <CalendarPageBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "pricing",
    title: "Pricing & tiers",
    description:
      "Apple-style subscription tier comparison with annual billing discount toggle, featured refractive Pro card, and feature checklists.",
    componentsUsed: ["Glass", "Button", "Switch", "Badge"],
    code: `import { PricingBlock } from "glacia";

export default function PricingRoute() {
  return <PricingBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "landing",
    title: "Product launch landing",
    description:
      "Apple keynote marketing page with floating glass pill navigation, glowing gradient headline, 3-column feature cards, and metrics banner.",
    componentsUsed: ["Glass", "Button", "Badge"],
    code: `import { LandingBlock } from "glacia";

export default function LandingRoute() {
  return <LandingBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "forgot-password",
    title: "Account recovery & OTP",
    description:
      "Apple ID password recovery with trusted email entry, 6-digit InputOTP code verification, resend countdown, and passkey support.",
    componentsUsed: ["InputOTP", "Input", "Label", "Button", "Glass"],
    code: `import { ForgotPasswordBlock } from "glacia";

export default function ForgotPasswordRoute() {
  return <ForgotPasswordBlock image={BACKDROP} />;
}`,
  },
  {
    slug: "error-page",
    title: "Error & 404 screen",
    description:
      "Apple system error screen with floating glass status card, glowing 404 frosted typography, and recovery action buttons.",
    componentsUsed: ["Glass", "Button", "Badge"],
    code: `import { ErrorPageBlock } from "glacia";

export default function ErrorRoute() {
  return <ErrorPageBlock code="404" />;
}`,
  },
];

export async function generateStaticParams() {
  return BLOCKS.map((block) => ({ slug: block.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const block = BLOCKS.find((item) => item.slug === slug);
  if (!block) return { title: "Block not found" };
  return { title: block.title, description: block.description };
}

export default async function BlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const block = BLOCKS.find((item) => item.slug === slug);

  if (!block) {
    notFound();
  }

  return (
    <div className="block-page">
      <header className="block-head">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Blocks</span>
          <span>/</span>
          <span>{block.title}</span>
        </nav>

        <div className="block-head-top" style={{ marginTop: 18 }}>
          <div>
            <p className="docs-kicker">Glacia block · Wave 1</p>
            <h1 className="block-title">{block.title}</h1>
            <p className="block-desc">{block.description}</p>
          </div>

          <div className="block-switch" aria-label="Switch block">
            <Link href="/blocks/dashboard" data-active={slug === "dashboard"}>
              Dashboard
            </Link>
            <Link href="/blocks/login" data-active={slug === "login"}>
              Login
            </Link>
            <Link href="/blocks/settings" data-active={slug === "settings"}>
              Settings
            </Link>
            <Link href="/blocks/profile" data-active={slug === "profile"}>
              Profile
            </Link>
            <Link href="/blocks/signup" data-active={slug === "signup"}>
              Signup
            </Link>
            <Link href="/blocks/calendar-page" data-active={slug === "calendar-page"}>
              Calendar
            </Link>
            <Link href="/blocks/pricing" data-active={slug === "pricing"}>
              Pricing
            </Link>
            <Link href="/blocks/landing" data-active={slug === "landing"}>
              Landing
            </Link>
            <Link href="/blocks/forgot-password" data-active={slug === "forgot-password"}>
              Recovery
            </Link>
            <Link href="/blocks/error-page" data-active={slug === "error-page"}>
              Error 404
            </Link>
          </div>
        </div>

        <div className="block-card-tags" style={{ marginTop: 18 }}>
          {block.componentsUsed.map((component) => (
            <span className="block-tag" key={component}>
              {component}
            </span>
          ))}
        </div>
      </header>

      <div className="block-stage">
        <div className="block-stage-bar">
          <span className="block-stage-label">
            <span className="status-dot" />
            Live preview · rendered from the published package
          </span>
          <Link href="/components/card" className="section-link">
            Explore the parts
            <ArrowRightIcon />
          </Link>
        </div>
        <div
          className="block-stage-body"
          data-glacia-backdrop="true"
          data-glisse-backdrop="true"
        >
          <div className="block-stage-frame">
            {slug === "dashboard" && <AdminDashboard image={BACKDROP} />}
            {slug === "login" && <LoginPage layout="centered" />}
            {slug === "settings" && <SettingsBlock image={BACKDROP} />}
            {slug === "profile" && <ProfileBlock image={BACKDROP} />}
            {slug === "signup" && <SignupBlock image={BACKDROP} />}
            {slug === "calendar-page" && <CalendarPageBlock image={BACKDROP} />}
            {slug === "pricing" && <PricingBlock image={BACKDROP} />}
            {slug === "landing" && <LandingBlock image={BACKDROP} />}
            {slug === "forgot-password" && <ForgotPasswordBlock image={BACKDROP} />}
            {slug === "error-page" && <ErrorPageBlock code="404" />}
          </div>
        </div>
      </div>
      <p className="block-stage-note">
        <SparkIcon
          width={11}
          height={11}
          style={{ display: "inline-block", verticalAlign: "-1px", marginRight: 5 }}
        />
        Fully interactive. The same component ships in the npm package and the copy command.
      </p>

      <div className="block-code">
        <div className="docs-section-head">
          <div>
            <h2 className="docs-section-title">Usage</h2>
            <p className="docs-section-desc">Drop the block into any route and pass your own data.</p>
          </div>
        </div>
        <CodeBlock code={block.code} filename="page.tsx" />
      </div>
    </div>
  );
}
