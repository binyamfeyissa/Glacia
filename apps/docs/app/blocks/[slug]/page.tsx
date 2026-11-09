import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdminDashboard, LoginPage, SettingsBlock, ProfileBlock, SignupBlock } from "glacia";
import { CodeBlock } from "../../../components/code-block";
import { ArrowRightIcon, SparkIcon } from "../../../components/icons";

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
  return <SettingsBlock />;
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
  return <ProfileBlock />;
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
  return <SignupBlock />;
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
        <div className="block-stage-body">
          <div className="block-stage-frame">
            {slug === "dashboard" && <AdminDashboard />}
            {slug === "login" && <LoginPage layout="centered" />}
            {slug === "settings" && <SettingsBlock />}
            {slug === "profile" && <ProfileBlock />}
            {slug === "signup" && <SignupBlock />}
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
