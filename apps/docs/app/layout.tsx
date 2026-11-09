import type { Metadata } from "next";
import "./globals.css";
import { BackdropProvider } from "../components/backdrop-context";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "Glacia — Apple's Liquid Glass UI Kit for React & React Native",
  description:
    "Apple's Liquid Glass, with real optical refraction — not frosted blur — on web and on iOS, from one unified API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <BackdropProvider>
          <Header />
          {children}
          <Footer />
        </BackdropProvider>
      </body>
    </html>
  );
}
