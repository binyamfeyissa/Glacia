import Link from "next/link";
import { SnowflakeIcon } from "./icons";

const COLUMNS = [
  {
    title: "Library",
    links: [
      { label: "Components", href: "/components/button" },
      { label: "Blocks", href: "/blocks/dashboard" },
      { label: "Build report", href: "/build-report" },
    ],
  },
  {
    title: "Install",
    links: [
      { label: "npm install glacia", href: "/#install" },
      { label: "npm install glacia-native", href: "/#install" },
      { label: "npx glacia add button", href: "/#install" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <span className="brand-mark">
                <SnowflakeIcon width={17} height={17} />
              </span>
              <span className="brand-name">Glacia</span>
            </Link>
            <p className="footer-tagline">
              The optics of Apple&apos;s Liquid Glass, implemented for the open web and React Native.
            </p>
            <span className="footer-license">MIT licensed · v0.1.0</span>
          </div>

          <div className="footer-columns">
            {COLUMNS.map((column) => (
              <div className="footer-column" key={column.title}>
                <h3>{column.title}</h3>
                {column.links.map((link) => (
                  <Link key={link.label} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="footer-column">
              <h3>Credits</h3>
              <a
                href="https://github.com/0kzh/glisse"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                Glisse by Kelvin Zhang
              </a>
              <a
                href="https://github.com/callstack/liquid-glass"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                @callstack/liquid-glass
              </a>
              <a
                href="https://github.com/open-pluto/glacia"
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                GitHub repository
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Glacia Contributors. Not affiliated with Apple Inc. Liquid Glass is Apple&apos;s
            design material for iOS 26; Glacia is an independent open-source implementation.
          </p>
          <span className="footer-status">
            <span className="status-dot" /> All systems normal
          </span>
        </div>
      </div>
    </footer>
  );
}
