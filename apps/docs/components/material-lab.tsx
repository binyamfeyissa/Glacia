"use client";

import { useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Calendar,
  Card,
  Chart,
  CodeBlock,
  Form,
  Input,
  Kbd,
  Label,
  SearchField,
  SegmentedControl,
  Slider,
  Switch,
} from "glacia";
import { SearchIcon, SparkIcon, HeartIcon, ShareIcon, MoreIcon } from "./icons";

const SURFACES = [
  { id: "tahoe", label: "Tahoe" },
  { id: "fluted", label: "Fluted" },
  { id: "white", label: "White" },
  { id: "graphite", label: "Dark Gray" },
] as const;

type Surface = (typeof SURFACES)[number]["id"];

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
  const [query, setQuery] = useState("");
  const [sliderVal, setSliderVal] = useState(65);
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2026, 10, 11)
  );
  const searchRef = useRef<HTMLInputElement>(null);

  // The hub search filters the cards below, live as you type.
  const q = query.trim().toLowerCase();
  const match = (keywords: string) => !q || keywords.toLowerCase().includes(q);
  const row3Match =
    match("calendar november date picker") ||
    match("apple account form passkey apple id") ||
    match("dispersion curve chart transmission index") ||
    match("liquidhero code glass button snippet");
  const anyMatch =
    match("slider refraction value") ||
    match("switch optics toggle") ||
    match("avatar team people") ||
    match("shortcut keyboard command k") ||
    row3Match;

  return (
    <div className="lab-frame">
      {/* Surface switcher bar — the library's own SegmentedControl. */}
      <div className="lab-bar">
        <span className="lab-bar-label">
          <SparkIcon width={13} height={13} />
          <span>Material hub</span>
        </span>
        <SegmentedControl
          className="lab-surface-control"
          items={SURFACES.map((item) => ({ value: item.id, label: item.label }))}
          value={surface}
          onValueChange={(value) => setSurface(value as Surface)}
          aria-label="Backdrop surface"
        />
      </div>

      {/* Live Stage with refraction backdrop */}
      <div className={`lab-stage surface-${surface}`} data-glacia-backdrop="true">
        <div className="lab-orb lab-orb-a" aria-hidden="true" />
        <div className="lab-orb lab-orb-b" aria-hidden="true" />
        <div className="lab-glow" aria-hidden="true" />

        <div className="lab-board">
          {/* Row 1 — Search Button, 3 Action Buttons, Primary & Secondary Buttons.
              (The site's floating bottom navigation IS the live TabBar — the
              same component, running as the site nav — so the hub does not
              render a second, identical TabBar here.) */}
          <div className="lab-row-top">
            <div className="lab-top-actions">
              <Button
                variant="glass"
                size="sm"
                aria-label="Search components"
                className="lab-round-search"
                onClick={() => searchRef.current?.focus()}
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
                  <HeartIcon width={17} height={17} filled={liked} />
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  aria-label="Share button"
                >
                  <ShareIcon width={17} height={17} />
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  aria-label="Three dot button"
                >
                  <MoreIcon width={17} height={17} />
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
                ref={searchRef}
                placeholder="Search components..."
                aria-label="Search components"
                className="lab-search-input"
                value={query}
                onValueChange={setQuery}
              />
            </div>

            {match("slider refraction value") && (
              <Card variant="glass" className="lab-slider-card">
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
              </Card>
            )}

            {match("switch optics toggle") && (
              <Card variant="glass" className="lab-switches-card">
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
              </Card>
            )}

            {match("avatar team people") && (
              <Card variant="glass" className="lab-avatars-card" aria-label="Avatars">
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
              </Card>
            )}

            {match("shortcut keyboard command k") && (
              <Card variant="glass" className="lab-kbd-card" aria-label="Keyboard shortcuts">
                <span className="lab-kbd-label">Shortcut</span>
                <div className="lab-kbd-cluster">
                  <Kbd size="md">⌘</Kbd>
                  <Kbd size="md">K</Kbd>
                </div>
              </Card>
            )}
          </div>

          {/* Row 3 — Calendar, Form, Chart, Code Block */}
          {row3Match && (
            <div className="lab-row-grid">
              {/* Calendar Column */}
              {match("calendar november date picker") && (
                <div className="lab-grid-col-calendar">
                  <Card variant="glass" className="lab-calendar-shell">
                    <Calendar
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                  </Card>
                </div>
              )}

              {/* Form Column */}
              {match("apple account form passkey apple id") && (
                <div className="lab-grid-col-form">
                  <Card variant="glass" className="lab-form-card">
                    <Form
                      className="lab-form-inner"
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
                  </Card>
                </div>
              )}

              {/* Chart & Code Block Column */}
              {(match("dispersion curve chart transmission index") ||
                match("liquidhero code glass button snippet")) && (
                <div className="lab-grid-col-chart">
                  {match("dispersion curve chart transmission index") && (
                    <Card variant="glass" className="lab-chart-card">
                      <div className="lab-chart-head">
                        <div>
                          <span className="lab-chart-eyebrow">Transmission Index</span>
                          <strong className="lab-chart-title">Dispersion Curve</strong>
                        </div>
                        <Kbd size="sm">60 FPS</Kbd>
                      </div>
                      <Chart data={CHART_DATA} type="line" height={125} color="#38bdf8" />
                    </Card>
                  )}

                  {match("liquidhero code glass button snippet") && (
                    <div className="lab-code-wrap">
                      <CodeBlock
                        code={CODE_EXAMPLE}
                        language="tsx"
                        filename="LiquidHero.tsx"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {!anyMatch && (
            <p className="lab-search-empty" role="status">
              No components match “{query}”.
            </p>
          )}
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
        <div className="lab-meta-item">
          <span>Navigation</span>
          <strong>The floating bar at the bottom of this page is the live TabBar</strong>
        </div>
      </div>
    </div>
  );
}
