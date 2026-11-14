import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/seo";

// The site is exported statically, so this route must not be treated as
// dynamic: without it the export fails while collecting page data.
export const dynamic = "force-static";

/**
 * robots.txt.
 *
 * Everything public is crawlable. The few disallowed paths are build artefacts
 * and the raw registry JSON: they are legitimately fetchable by the CLI, but
 * they are duplicates of documented content and should not compete with the
 * component pages in search results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/r/", "/_next/", "/api/"],
      },
      // Ads crawlers add no value here and would only consume crawl budget.
      { userAgent: "AdsBot-Google", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
