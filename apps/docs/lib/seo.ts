import type { Metadata } from "next";

export const SITE_URL = "https://glacia.binyamfeyissa.dev";
export const SITE_NAME = "Glacia";

export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: "Glacia — Liquid Glass components for React and React Native",
};

export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

export function pageMetadata({ title, description, path, keywords }: PageMetadataInput): Metadata {
  const url = canonical(path);
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
