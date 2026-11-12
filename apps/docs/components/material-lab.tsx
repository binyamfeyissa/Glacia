"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Calendar,
  Chart,
  CodeBlock,
  Form,
  Input,
  Kbd,
  Label,
  SearchField,
  Slider,
  Switch,
  TabBar,
  type TabBarItem,
} from "glacia";
import {
  CodeIcon,
  GridIcon,
  LayersIcon,
  SearchIcon,
  SparkIcon,
  HomeIcon,
  TemplateIcon,
} from "./icons";
import { GlaciaMark } from "./glacia-mark";

const SURFACES = [
  { id: "tahoe", label: "Tahoe" },
  { id: "fluted", label: "Fluted" },
  { id: "white", label: "White" },
  { id: "graphite", label: "Dark Gray" },
] as const;

type Surface = (typeof SURFACES)[number]["id"];

/* Three action buttons glyphs (Heart, Share, Three-dots) */
const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width={17}
    height={17}
    fill={filled ? "#ff375f" : "none"}
    stroke={filled ? "#ff375f" : "currentColor"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 7a4 4 0 0 1 7 3.6C19 15.4 12 20 12 20Z" />
  </svg>
);

const ShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width={17}
    height={17}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 15V4m0 0 4 4m-4-4L8 8M5 14v5h14v-5" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

/* Exact same tabs as the website navigation tabs */
const WEBSITE_TABS: TabBarItem[] = [
  { value: "overview", label: "Overview", icon: <HomeIcon width={14} height={14} /> },
  { value: "components", label: "Components", icon: <GridIcon width={14} height={14} /> },
  { value: "blocks", label: "Blocks", icon: <LayersIcon width={14} height={14} /> },
  { value: "templates", label: "Templates", icon: <TemplateIcon width={14} height={14} /> },
  { value: "report", label: "Build report", icon: <CodeIcon width={14} height={14} /> },
];

const CODE_EXAMPLE = `import { Glass, Button } from "glacia";

export function LiquidHero() {
  return (
    <Glass refraction={0.8} specular={0.9}>
      <Button variant="glass">Liquid Glass</Button>
    </Glass>
  );
}`;

const CHART_DATA = [
  { label: "Mon", value: 38 },
  { label: "Tue", value: 65 },
  { label: "Wed", value: 48 },
  { label: "Thu", value: 89 },
  { label: "Fri", value: 74 },
  { label: "Sat", value: 92 },
  { label: "Sun", value: 85 },
];

export function MaterialLab() {
  const [surface, setSurface] = useState<Surface>("tahoe");
  const [activeTab, setActiveTab] = useState("overview");
  const [sliderVal, setSliderVal] = useState(65);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2026, 10, 11)
  );

  return (
    <div className="lab-frame">
      {/* Surface switcher bar */}
      <div className="lab-bar">
        <span className="lab-bar-label">
          <SparkIcon width={13} height={13} />
          <span>Material hub</span>
        </span>
        <div className="surface-chips" role="tablist" aria-label="Backdrop surface">
          {SURFACES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={surface === item.id}
              className="surface-chip"
              data-active={surface === item.id}
              onClick={() => setSurface(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Stage with refraction backdrop */}
      <div className={`lab-stage surface-${surface}`} data-glacia-backdrop="true">
        <div className="lab-orb lab-orb-a" aria-hidden="true" />
        <div className="lab-orb lab-orb-b" aria-hidden="true" />
        <div className="lab-glow" aria-hidden="true" />

        <div className="lab-board">
          {/* Row 1 — Compact Website Tabs, Search Button, 3 Action Buttons, Primary & Secondary Buttons */}
          <div className="lab-row-top">
            <div className="lab-tabs-wrap">
              <TabBar
                items={WEBSITE_TABS}
                value={activeTab}
                onValueChange={setActiveTab}
                aria-label="Navigation tabs"
              />
            </div>

            <div className="lab-top-actions">
              <Button
                variant="glass"
                size="sm"
                aria-label="Search button"
                className="lab-round-search"
              >
                <SearchIcon width={18} height={18} />
              </Button>

              <div className="lab-action-triad" role="group" aria-label="Action buttons">
                <Button
                  variant="glass"
                  size="sm"
                  aria-label="Heart button"
                  onClick={() => setLiked(!liked)}
                  className={liked ? "is-liked" : ""}
                >
                  <HeartIcon filled={liked} />
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  aria-label="Share button"
                >
                  <ShareIcon />
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  aria-label="Three dot button"
                >
                  <MoreIcon />
                </Button>
              </div>

              <div className="lab-btn-pair">
                <Button variant="filled" size="sm" className="lab-primary-pill">
                  Primary Button
                </Button>
                <Button variant="glass" size="sm" className="lab-secondary-pill">
                  Secondary Button
                </Button>
              </div>
            </div>
          </div>

          {/* Row 2 — Search, Slider, Switch, Avatars, Kbd */}
          <div className="lab-row-controls">
            <div className="lab-search-wrap">
              <SearchField
                placeholder="Search components..."
                aria-label="Search"
                className="lab-search-input"
              />
            </div>

            <div className="gl-glass lab-slider-card" suppressHydrationWarning>
              <div className="lab-slider-meta">
                <span className="lab-slider-label">Slider</span>
                <span className="lab-slider-val">{sliderVal}%</span>
              </div>
              <Slider
                value={sliderVal}
                min={0}
                max={100}
                aria-label="Refraction slider"
                onValueChange={(v) => setSliderVal(typeof v === "number" ? v : 65)}
              />
            </div>

            <div className="gl-glass lab-switches-card" suppressHydrationWarning>
              <div className="lab-switch-unit">
                <span className="lab-switch-label">Switch</span>
                <Switch
                  checked={switchA}
                  onCheckedChange={setSwitchA}
                  aria-label="Primary switch"
                />
              </div>
              <div className="lab-switch-unit">
                <span className="lab-switch-label">Optics</span>
                <Switch
                  checked={switchB}
                  onCheckedChange={setSwitchB}
                  aria-label="Secondary switch"
                />
              </div>
            </div>

            <div className="gl-glass lab-avatars-card" aria-label="Avatars" suppressHydrationWarning>
              <div className="lab-avatars-row">
                <Avatar className="lab-avatar-item">
                  <AvatarImage src="/avatars/avatar-1.jpg" alt="Sarah Chen" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <Avatar className="lab-avatar-item">
                  <AvatarImage src="/avatars/avatar-2.jpg" alt="Alex Rivera" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <Avatar className="lab-avatar-item">
                  <AvatarImage src="/avatars/avatar-3.jpg" alt="Elena Rostova" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <Avatar className="lab-avatar-item lab-avatar-count">
                  <AvatarFallback>+4</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="gl-glass lab-kbd-card" aria-label="Keyboard shortcuts" suppressHydrationWarning>
              <span className="lab-kbd-label">Shortcut</span>
              <div className="lab-kbd-cluster">
                <Kbd size="md">⌘</Kbd>
                <Kbd size="md">K</Kbd>
              </div>
            </div>
          </div>

          {/* Row 3 — Calendar, Form, Chart, Code Block */}
          <div className="lab-row-grid">
            {/* Calendar Column */}
            <div className="lab-grid-col-calendar">
              <div className="gl-glass lab-calendar-shell" suppressHydrationWarning>
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
            </div>

            {/* Form Column */}
            <div className="lab-grid-col-form">
              <Form
                className="gl-glass lab-form-card"
                  suppressHydrationWarning
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="lab-form-head">
                  <div>
                    <h4 className="lab-form-title">Apple Account</h4>
                    <span className="lab-form-desc">Manage passkeys and sync</span>
                  </div>
                  <Kbd size="sm">⌘S</Kbd>
                </div>

                <div className="lab-form-body">
                  <div className="lab-form-field">
                    <Label htmlFor="hub-email">Apple ID</Label>
                    <Input
                      id="hub-email"
                      type="email"
                      defaultValue="user@apple.com"
                      placeholder="user@apple.com"
                    />
                  </div>

                  <div className="lab-form-row">
                    <Label htmlFor="hub-passkey" className="lab-form-row-label">
                      Passkey Authentication
                    </Label>
                    <Switch
                      id="hub-passkey"
                      checked={passkeyActive}
                      onCheckedChange={setPasskeyActive}
                      aria-label="Passkey Authentication"
                    />
                  </div>
                </div>

                <Button type="submit" variant="filled" size="sm" className="lab-form-btn">
                  Save Changes
                </Button>
              </Form>
            </div>

            {/* Chart & Code Block Column */}
            <div className="lab-grid-col-chart">
              <div className="gl-glass lab-chart-card" suppressHydrationWarning>
                <div className="lab-chart-head">
                  <div>
                    <span className="lab-chart-eyebrow">Transmission Index</span>
                    <strong className="lab-chart-title">Dispersion Curve</strong>
                  </div>
                  <Kbd size="sm">60 FPS</Kbd>
                </div>
                <Chart data={CHART_DATA} type="line" height={125} color="#38bdf8" />
              </div>

              <div className="lab-code-wrap">
                <CodeBlock
                  code={CODE_EXAMPLE}
                  language="tsx"
                  filename="LiquidHero.tsx"
                />
              </div>
            </div>
          </div>
        </div>

        <span className="lab-stage-caption">Rendered live · every control is a Glacia component</span>
      </div>

      {/* Footer metadata */}
      <div className="lab-meta">
        <div className="lab-meta-item">
          <span>Layer 1</span>
          <strong>Frosted blur, rim light, soft depth</strong>
        </div>
        <div className="lab-meta-item">
          <span>Layer 2</span>
          <strong>SVG refraction on Chromium</strong>
        </div>
        <div className="lab-meta-item">
          <span>Native</span>
          <strong>iOS 26 UIGlassEffect</strong>
        </div>
      </div>
    </div>
  );
}
