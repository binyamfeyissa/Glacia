import Link from "next/link";
import { notFound } from "next/navigation";
import { COMPONENTS_DATA } from "../../../data/components-data";
import { BackdropSwitcher } from "../../../components/backdrop-switcher";
import { ComponentPreview } from "../../../components/component-preview";
import { ComponentDemo } from "../../../components/demos";
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "glacia";

export async function generateStaticParams() {
  return COMPONENTS_DATA.map((c) => ({
    slug: c.slug,
  }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = COMPONENTS_DATA.find((c) => c.slug === slug);

  if (!comp) {
    notFound();
  }

  return (
    <div className="gl-detail-page">
      <BackdropSwitcher />

      <div className="gl-detail-layout">
        {/* Navigation Sidebar */}
        <aside className="gl-sidebar-nav">
          <span className="text-xs font-semibold px-3 py-1 opacity-60">All Components</span>
          {COMPONENTS_DATA.map((item) => (
            <Link
              key={item.slug}
              href={`/components/${item.slug}`}
              className="gl-sidebar-link"
              data-active={item.slug === comp.slug}
            >
              {item.name}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <main className="gl-detail-main">
          <div className="gl-detail-header">
            <h1 className="gl-detail-title">{comp.name}</h1>
            <p className="gl-detail-desc">{comp.description}</p>
            <div className="gl-detail-tags">
              <Badge variant={comp.appleStatus === "Apple-faithful" ? "default" : "secondary"}>
                {comp.appleStatus}
              </Badge>
              <Badge variant="outline">Phone App: {comp.nativeStatus}</Badge>
              <Badge variant="outline">Wave {comp.wave}</Badge>
            </div>
          </div>

          {/* Interactive Live Demo Stage */}
          <ComponentPreview
            name={comp.name}
            slug={comp.slug}
            code={comp.codeSnippet}
          >
            <ComponentDemo slug={comp.slug} />
          </ComponentPreview>

          {/* Props Table */}
          {comp.props.length > 0 && (
            <section className="gl-props-section">
              <h2 className="gl-props-title">Component Props</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prop</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comp.props.map((prop) => (
                    <TableRow key={prop.name}>
                      <TableCell className="font-mono font-medium">{prop.name}</TableCell>
                      <TableCell className="font-mono text-xs">{prop.type}</TableCell>
                      <TableCell className="font-mono text-xs">{prop.default || "—"}</TableCell>
                      <TableCell>{prop.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
