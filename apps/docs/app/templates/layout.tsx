import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";

/**
 * `/templates` is a client component and so cannot export `metadata` itself.
 * A route-level layout supplies the tags without forcing the page to become a
 * server component.
 */
export const metadata: Metadata = pageMetadata({
  title: "Templates — full glass application screens",
  description:
    "Complete application screens built from Glacia components: dashboards, authentication, settings, pricing, and transactional flows. Copy the source or install the block.",
  path: "/templates",
  keywords: [
    "react dashboard template",
    "react login page template",
    "glass ui templates",
    "liquid glass dashboard",
  ],
});

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
