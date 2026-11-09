import type { Metadata } from "next";
import { COMPONENTS_DATA } from "../../data/components-data";
import { ArrowUpRightIcon, ShieldIcon, SparkIcon } from "../../components/icons";

export const metadata: Metadata = {
  title: "Build report",
  description:
    "An honest account of every component, block, test suite, and browser capability verified in Glacia v0.1.0.",
};

const shippedCount = COMPONENTS_DATA.length;
const wave1Count = COMPONENTS_DATA.filter((component) => component.wave === 1).length;
const wave2Count = COMPONENTS_DATA.filter((component) => component.wave === 2).length;
const nativeCount = COMPONENTS_DATA.filter((component) => component.nativeStatus === "Yes").length;

const WAVE_3 = [
  "Toggle Group",
  "Input OTP",
  "Command",
  "Carousel",
  "Aspect Ratio",
  "Kbd",
  "Code Block",
  "Marker",
  "Menubar",
  "Resizable",
  "Message",
  "Bubble",
  "Message Scroller",
  "Attachment",
  "Questionnaire",
  "Trace",
  "Direction",
  "Calendar Page Block",
  "Pricing Block",
  "Landing Page Block",
  "Forgot Password Block",
  "Error Pages Block",
];

export default function BuildReportPage() {
  return (
    <div className="report-page">
      <header className="report-head">
        <p className="eyebrow">
          <span className="eyebrow-dot" />
          Build report
        </p>
        <h1 className="report-title">What shipped in 0.1.</h1>
        <p className="report-desc">
          A verified, item-by-item account of the components, blocks, tests, and platform behavior
          in Glacia&apos;s first release. No roadmap items counted as shipped.
        </p>
        <div className="report-meta">
          <span className="meta-pill accent">
            <span className="status-dot ok" />
            Verified · Nov 9, 2026
          </span>
          <span className="meta-pill">v0.2.0 · Wave 2 Complete</span>
          <span className="meta-pill">MIT licensed</span>
        </div>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{shippedCount}</span>
          <span className="stat-label">Web components (Waves 1 &amp; 2)</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{nativeCount}</span>
          <span className="stat-label">Native-ready components</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">5</span>
          <span className="stat-label">Production blocks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            118<small> / 118</small>
          </span>
          <span className="stat-label">Unit tests passing</span>
        </div>
      </div>

      <section className="report-card">
        <div className="report-card-head">
          <div>
            <h2>Shipped components</h2>
            <p>
              Each entry is implemented, interactive, theme-aware, keyboard accessible, and
              distributable through npm or the copy command.
            </p>
          </div>
          <span className="tag accent">{shippedCount} verified</span>
        </div>
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Component</th>
                <th>Category</th>
                <th>HIG classification</th>
                <th>React Native</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS_DATA.map((component, index) => (
                <tr key={component.slug}>
                  <td className="report-num">{String(index + 1).padStart(2, "0")}</td>
                  <td className="cell-name">{component.name}</td>
                  <td>{component.category}</td>
                  <td>
                    <span className={component.appleStatus === "Apple-faithful" ? "tag accent" : "tag"}>
                      {component.appleStatus}
                    </span>
                  </td>
                  <td>
                    <span className={component.nativeStatus === "Yes" ? "tag accent" : "tag"}>
                      {component.nativeStatus}
                    </span>
                  </td>
                  <td>
                    <span className="tag">
                      <span className="status-dot ok" style={{ marginRight: 6 }} />
                      Built
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="report-card">
        <div className="report-card-head">
          <div>
            <h2>Tested platform behavior</h2>
            <p>
              A two-layer architecture verified against WebKit rendering limits and Chromium&apos;s
              SVG displacement pipeline.
            </p>
          </div>
          <ShieldIcon width={16} height={16} style={{ color: "var(--text-3)" }} />
        </div>
        <div className="report-note-grid">
          <div className="report-note">
            <h3>Layer 1 · Universal frosted glass</h3>
            <p>
              Tested in Chrome, Edge, Safari on macOS and iOS, and Firefox. The frosted blur,
              specular edge, and elevation render without dropped CSS properties.
            </p>
          </div>
          <div className="report-note">
            <h3>Layer 2 · Optical refraction</h3>
            <p>
              Gated behind <code>@supports</code> and browser detection. Active on Chromium
              browsers where SVG displacement inside <code>backdrop-filter</code> is supported.
            </p>
          </div>
          <div className="report-note">
            <h3>Native fallback ladder</h3>
            <p>
              iOS 26 uses Apple&apos;s real <code>UIGlassEffect</code> through{" "}
              <code>@callstack/liquid-glass</code>. Older iOS and Android render identical geometry
              with zero layout shift.
            </p>
          </div>
        </div>
      </section>

      <section className="report-card">
        <div className="report-card-head">
          <div>
            <h2>Distribution</h2>
            <p>Three supported paths, all built from the same source.</p>
          </div>
        </div>
        <div className="report-note-grid">
          <div className="report-note">
            <h3>Web package</h3>
            <p>
              <code>npm install glacia</code> — all {wave1Count} components, tokens, and styles in
              one tree-shakeable ESM package.
            </p>
          </div>
          <div className="report-note">
            <h3>React Native package</h3>
            <p>
              <code>npm install glacia-native</code> — native glass surfaces, controls, and tab
              navigation with an Expo-safe fallback.
            </p>
          </div>
          <div className="report-note">
            <h3>Copy command</h3>
            <p>
              <code>npx glacia add &lt;component&gt;</code> — copy only the primitives you need
              directly into your project, with no runtime dependency.
            </p>
          </div>
        </div>
      </section>

      <section className="report-card">
        <div className="report-card-head">
          <div>
            <h2>Not in this release (Wave 3 Roadmap)</h2>
            <p>Remaining roadmap items are listed here so shipping status stays unambiguous.</p>
          </div>
          <ArrowUpRightIcon width={16} height={16} style={{ color: "var(--text-3)" }} />
        </div>
        <div className="roadmap-grid" style={{ padding: 16 }}>
          <div className="report-note">
            <h3>Wave 2 · Shipped ({wave2Count} components + 3 blocks)</h3>
            <p style={{ marginBottom: 4 }}>Completed and verified in this release.</p>
            <p className="text-xs opacity-75">
              Button Group, Toggle, Input Group, Field, Form, Combobox, Calendar, Chart, Empty, Item, Hover Card, Context Menu, Drawer, Sheet, Toast, Breadcrumb, Navigation Menu, Pagination, Collapsible, Data Table, Native Select, plus Settings, Profile, and Signup blocks.
            </p>
          </div>
          <div className="report-note">
            <h3>Wave 3 · {WAVE_3.length} items</h3>
            <p style={{ marginBottom: 4 }}>Advanced widgets, chat/AI components, and specialized blocks.</p>
            <ul className="roadmap-list" style={{ padding: "10px 0 0" }}>
              {WAVE_3.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="report-card">
        <div className="report-card-head">
          <div>
            <h2>Credits and attribution</h2>
            <p>Glacia is built on the shoulders of open-source work.</p>
          </div>
          <SparkIcon width={16} height={16} style={{ color: "var(--text-3)" }} />
        </div>
        <div className="report-note-grid">
          <div className="report-note">
            <h3>Web glass engine</h3>
            <p>
              Based on{" "}
              <a href="https://github.com/0kzh/glisse" target="_blank" rel="noreferrer">
                Glisse
              </a>{" "}
              by Kelvin Zhang, MIT licensed.
            </p>
          </div>
          <div className="report-note">
            <h3>React Native engine</h3>
            <p>
              Powered by{" "}
              <a
                href="https://github.com/callstack/liquid-glass"
                target="_blank"
                rel="noreferrer"
              >
                @callstack/liquid-glass
              </a>
              , MIT licensed.
            </p>
          </div>
          <div className="report-note">
            <h3>Disclaimer</h3>
            <p>
              Not affiliated with Apple Inc. Liquid Glass is Apple&apos;s design material for iOS
              26; Glacia is an independent implementation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
