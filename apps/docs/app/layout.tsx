import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME, SOCIAL_IMAGE } from "../lib/seo";
import { SiteStructuredData } from "../components/structured-data";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { GlassDials } from "../components/glass-dials";

export const metadata: Metadata = {
  title: {
    default: "Glacia — Liquid Glass for React & React Native",
    template: "%s — Glacia",
  },
  description:
    "A React and React Native component library built on the real optics of Apple's Liquid Glass: refraction, specular rim light, and depth across every platform.",
  metadataBase: new URL(SITE_URL),
  // Icons resolve from app/icon.png, app/apple-icon.png and app/favicon.ico,
  // but the Open Graph fields are declared explicitly so shared links carry
  // the real mark rather than a bare title.
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  applicationName: SITE_NAME,
  authors: [{ name: "Binyam Feyissa", url: "https://github.com/binyamfeyissa" }],
  creator: "Binyam Feyissa",
  publisher: SITE_NAME,
  category: "technology",
  alternates: { canonical: SITE_URL + "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Glacia — Liquid Glass for React & React Native",
    description:
      "Real optical refraction, specular highlights, and native iOS 26 glass from one unified API.",
    url: SITE_URL + "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glacia — Liquid Glass for React & React Native",
    description:
      "Real optical refraction, specular highlights, and native iOS 26 glass from one unified API.",
    images: [SOCIAL_IMAGE.url],
  },
};

const themeScript = `
(function () {
  try {
    var param = new URLSearchParams(window.location.search).get('theme');
    var stored = localStorage.getItem('glacia-theme');
    var theme = param === 'light' || param === 'dark'
      ? param
      : stored === 'light' || stored === 'dark'
        ? stored
        : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteStructuredData />
        <div className="site-aurora" aria-hidden="true" />
        <div className="site-grain" aria-hidden="true" />
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
        <GlassDials />
      </body>
    </html>
  );
}
