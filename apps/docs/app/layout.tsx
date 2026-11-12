import type { Metadata } from "next";
import "./globals.css";
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
  metadataBase: new URL("https://glacia.dev"),
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
  openGraph: {
    title: "Glacia — Liquid Glass for React & React Native",
    description:
      "Real optical refraction, specular highlights, and native iOS 26 glass from one unified API.",
    type: "website",
    images: [{ url: "/glacia-icon-512.png", width: 512, height: 512, alt: "Glacia" }],
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
