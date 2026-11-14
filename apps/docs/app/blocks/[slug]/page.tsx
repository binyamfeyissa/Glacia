import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOCKS } from "../../../data/blocks-data";
import { pageMetadata } from "../../../lib/seo";
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
  BoardingPassBlock,
  ActivityBlock,
} from "glacia";
import { CodeBlock } from "../../../components/code-block";
import { ArrowRightIcon, SparkIcon } from "../../../components/icons";

const BACKDROP = "/hero/tahoe-dark.jpg";


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
  return pageMetadata({
    title: `${block.title} — React template`,
    description: block.description,
    path: `/blocks/${block.slug}`,
  });
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
            {slug === "boarding-pass" && (
              <BoardingPassBlock
                passenger="A. Rivera"
                date="12 Nov"
                seat="14A"
                boardingGroup="2"
                boardingTime="11:05"
                barcodeValue="GA208-14A-SFO"
                flight={{
                  airline: "Glacia Air",
                  flightNumber: "GA 208",
                  from: "SFO",
                  fromCity: "San Francisco",
                  to: "NRT",
                  toCity: "Tokyo",
                  departure: "11:40",
                  arrival: "15:25 +1",
                  duration: "11h 05m",
                  terminal: "2",
                  gate: "B14",
                }}
              />
            )}
            {slug === "activity" && (
              <ActivityBlock
                title="Activity"
                summary="Everything that happened this week"
                entries={[
                  { id: "a1", actor: "Mina", action: "approved the production deploy", time: "09:42", day: "Today", tone: "positive", initials: "MI" },
                  { id: "a2", actor: "Dev", action: "opened a pull request", detail: "Refraction: cache the displacement map", time: "09:15", day: "Today", tone: "neutral", initials: "DV" },
                  { id: "a3", actor: "CI", action: "flagged a failing test", detail: "lens.test.tsx — 1 failure", time: "08:58", day: "Today", tone: "warning", initials: "CI" },
                  { id: "a4", actor: "Ana", action: "merged the tokens branch", time: "17:20", day: "Yesterday", tone: "positive", initials: "AN" },
                  { id: "a5", actor: "CI", action: "failed to build the docs site", time: "16:04", day: "Yesterday", tone: "danger", initials: "CI" },
                ]}
              />
            )}
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
