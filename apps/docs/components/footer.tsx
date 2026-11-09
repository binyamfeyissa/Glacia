import Link from "next/link";

export function Footer() {
  return (
    <footer className="gl-glass gl-site-footer">
      <div className="gl-footer-container">
        <div className="gl-footer-top">
          <div className="gl-footer-brand">
            <span className="gl-logo-mark">❄</span>
            <span className="gl-logo-text">Glacia</span>
            <p className="gl-footer-tagline">
              Apple's Liquid Glass, with real optical refraction on web and iOS, from one unified API.
            </p>
          </div>
          <div className="gl-footer-links">
            <div className="gl-footer-col">
              <h4>Documentation</h4>
              <Link href="/">Home</Link>
              <Link href="/components/button">Components</Link>
              <Link href="/blocks/dashboard">Dashboard Block</Link>
              <Link href="/blocks/login">Login Block</Link>
              <Link href="/build-report">Build Report</Link>
            </div>
            <div className="gl-footer-col">
              <h4>Install</h4>
              <code>npm install glacia</code>
              <code>npm install glacia-native</code>
              <code>npx glacia add &lt;name&gt;</code>
            </div>
            <div className="gl-footer-col">
              <h4>Attribution & Open Source</h4>
              <p className="gl-attribution-text">
                Web glass engine based on{" "}
                <a
                  href="https://github.com/0kzh/glisse"
                  target="_blank"
                  rel="noreferrer"
                  className="gl-footer-link"
                >
                  Glisse
                </a>{" "}
                by Kelvin Zhang (MIT).
              </p>
              <p className="gl-attribution-text">
                React Native glass powered by{" "}
                <a
                  href="https://github.com/callstack/liquid-glass"
                  target="_blank"
                  rel="noreferrer"
                  className="gl-footer-link"
                >
                  @callstack/liquid-glass
                </a>{" "}
                (MIT).
              </p>
            </div>
          </div>
        </div>

        <div className="gl-footer-bottom">
          <p className="gl-disclaimer">
            Not affiliated with Apple Inc. Liquid Glass is Apple's design material for iOS 26;
            Glacia is an independent open-source implementation.
          </p>
          <p className="gl-copyright">
            © 2026 Glacia Contributors. Released under the MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
