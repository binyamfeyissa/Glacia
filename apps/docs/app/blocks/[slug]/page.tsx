import Link from "next/link";
import { notFound } from "next/navigation";
import { BackdropSwitcher } from "../../../components/backdrop-switcher";
import { LoginPage, AdminDashboard, Badge, Button } from "glacia";

const BLOCKS = [
  {
    slug: "dashboard",
    title: "Admin Dashboard Block",
    description: "Complete administration dashboard with iPad-style floating glass sidebar, live stat cards, chart flow, and real-time orders data table.",
    componentsUsed: ["Sidebar", "Card", "Badge", "Button", "Table"],
    code: `import { AdminDashboard } from "glacia";

export default function DashboardRoute() {
  return <AdminDashboard />;
}`,
  },
  {
    slug: "login",
    title: "Login Page Block",
    description: "Production-ready user authentication screen featuring centred glass card, email/password fields, social OAuth buttons, and remember-me checkbox.",
    componentsUsed: ["Card", "Input", "Button", "Label", "Checkbox", "Separator"],
    code: `import { LoginPage } from "glacia";

export default function LoginRoute() {
  return <LoginPage layout="centered" onSubmit={(e) => console.log("Login submitted")} />;
}`,
  },
];

export async function generateStaticParams() {
  return BLOCKS.map((b) => ({
    slug: b.slug,
  }));
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const block = BLOCKS.find((b) => b.slug === slug);

  if (!block) {
    notFound();
  }

  return (
    <div className="gl-block-page">
      <BackdropSwitcher />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex gap-2 mb-3">
            <Badge variant="default">Glacia Block</Badge>
            <Badge variant="secondary">Wave 1 Shippable</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{block.title}</h1>
          <p className="text-base text-muted-foreground mb-4">{block.description}</p>
          <div className="flex gap-2 items-center">
            <span className="text-xs font-semibold opacity-70">Components used:</span>
            {block.componentsUsed.map((comp) => (
              <Badge key={comp} variant="outline">{comp}</Badge>
            ))}
          </div>
        </div>

        {/* Live Block Render Stage */}
        <div className="border border-zinc-700/50 rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <div className="p-4 bg-zinc-900/60 border-b border-zinc-700/50 flex justify-between items-center">
            <span className="text-xs font-mono opacity-80">Live Interactive Block Preview</span>
            <div className="flex gap-2">
              <Link href="/blocks/dashboard">
                <Button size="sm" variant={slug === "dashboard" ? "filled" : "glass"}>
                  Dashboard
                </Button>
              </Link>
              <Link href="/blocks/login">
                <Button size="sm" variant={slug === "login" ? "filled" : "glass"}>
                  Login Page
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6 overflow-auto max-h-[850px]">
            {slug === "dashboard" ? <AdminDashboard /> : <LoginPage layout="centered" />}
          </div>
        </div>

        {/* Code to copy */}
        <div className="border border-zinc-700/50 rounded-2xl overflow-hidden bg-black/60">
          <div className="p-4 bg-zinc-900/80 border-b border-zinc-700/50 flex justify-between items-center">
            <span className="text-xs font-mono">page.tsx</span>
          </div>
          <pre className="p-6 overflow-x-auto text-sm font-mono text-zinc-300">
            <code>{block.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
