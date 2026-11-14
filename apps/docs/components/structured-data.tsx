import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "../lib/seo";

/**
 * Site-level structured data, rendered once in the root layout.
 *
 * Only facts that are true and verifiable are declared: what the software is,
 * what it runs on, where its source lives, and that it costs nothing. There is
 * deliberately no aggregateRating, no review and no offer price — inventing
 * those is both dishonest and a structured-data violation Google penalises.
 */

const REPO = "https://github.com/binyamfeyissa/Glacia";

/** Both packages, described from their real package.json metadata. */
const softwareApplications = [
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#glacia`,
    name: "Glacia",
    alternateName: "glacia",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "UI Component Library",
    operatingSystem: "Web browser",
    description:
      "Liquid Glass UI components for React on the web, with SVG backdrop refraction, specular rim light and depth. Copy-in source via the Glacia CLI.",
    url: SITE_URL,
    downloadUrl: "https://www.npmjs.com/package/glacia",
    softwareVersion: "0.3.4",
    programmingLanguage: ["TypeScript", "JavaScript"],
    runtimePlatform: "React 18+, React 19",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    author: { "@id": `${SITE_URL}/#author` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#glacia-native`,
    name: "glacia-native",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "UI Component Library",
    operatingSystem: "iOS, Android",
    description:
      "Liquid Glass components for React Native and Expo. Uses native UIGlassEffect on iOS 26 and a tinted fallback elsewhere.",
    url: `${SITE_URL}/platform/mobile`,
    downloadUrl: "https://www.npmjs.com/package/glacia-native",
    softwareVersion: "0.3.4",
    programmingLanguage: ["TypeScript", "JavaScript"],
    runtimePlatform: "React Native 0.80+, Expo",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    author: { "@id": `${SITE_URL}/#author` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
];

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#author`,
      name: "Binyam Feyissa",
      url: "https://github.com/binyamfeyissa",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      sameAs: [REPO, "https://www.npmjs.com/package/glacia"],
      founder: { "@id": `${SITE_URL}/#author` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Liquid Glass UI components for React and React Native, built on real optical refraction.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    ...softwareApplications,
  ],
};

export function SiteStructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes nothing that could close the script tag here:
      // every value is a literal from this file or the site constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/**
 * Breadcrumb structured data.
 *
 * Search engines show this in place of a raw URL, so it is worth emitting on
 * every page that has a hierarchy. Items are ordered root first.
 */
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * A technical article, for guides.
 *
 * `TechArticle` is the right type for a how-to aimed at developers; `Article`
 * would imply editorial news content.
 */
export function TechArticleStructuredData({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image = SOCIAL_IMAGE.url,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  const url = `${SITE_URL}${path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: `${SITE_URL}${image}`,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#author` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@type": "SoftwareApplication", name: SITE_NAME, url: SITE_URL },
    proficiencyLevel: "Expert",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
