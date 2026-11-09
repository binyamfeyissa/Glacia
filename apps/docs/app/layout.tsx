import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: {
    default: "Glacia — Liquid Glass for React & React Native",
    template: "%s — Glacia",
  },
  description:
    "A React and React Native component library built on the real optics of Apple's Liquid Glass: refraction, specular rim light, and depth across every platform.",
  metadataBase: new URL("https://glacia.dev"),
  openGraph: {
    title: "Glacia — Liquid Glass for React & React Native",
    description:
      "Real optical refraction, specular highlights, and native iOS 26 glass from one unified API.",
    type: "website",
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
      </body>
    </html>
  );
}
