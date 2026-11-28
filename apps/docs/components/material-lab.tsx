"use client";

import { memo, useCallback, useRef, useState } from "react";
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

/* Performance: the interactive demos below own their own state and are
   memoised on the single `visible` prop the hub search drives. Dragging the
   slider or flipping a switch used to re-render the whole hub — Calendar,
   Chart and CodeBlock included — on every tick; now only the demo itself
   re-renders. The search in the parent still re-renders this file's shell,
   but the memoised demos skip unless their own visibility flips. */

// Row 1 — Search Button, 3 Action Buttons, Primary & Secondary Buttons.
// (The site's floating bottom navigation IS the live TabBar — the same
// component, running as the site nav — so the hub does not render a second,
// identical TabBar here.)
const TopActions = memo(function TopActions({
  onSearchClick,
}: {
  onSearchClick: () => void;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="lab-row-top">
      <div className="lab-top-actions">
        <Button
          variant="glass"
          size="sm"
          aria-label="Search components"
          className="lab-round-search"
          onClick={onSearchClick}
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
  );
});

// Slider — sits DIRECTLY on the hub backdrop, no Card behind it (the
// background card was removed so the slider reads as part of the stage).
const SliderDemo = memo(function SliderDemo({ visible }: { visible: boolean }) {
  const [sliderVal, setSliderVal] = useState(65);
  if (!visible) return null;
  return (
    <div className="lab-slider-bare">
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
  );
});

// Switch + Optics — also directly on the backdrop, no Card behind them.
const SwitchesDemo = memo(function SwitchesDemo({
  visible,
}: {
  visible: boolean;
}) {
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  if (!visible) return null;
  return (
    <div className="lab-switches-bare">
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
  );
});

const CalendarDemo = memo(function CalendarDemo({
  visible,
}: {
  visible: boolean;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2026, 10, 11)
  );
  if (!visible) return null;
  return (
    <div className="lab-grid-col-calendar">
      <Card variant="glass" className="lab-calendar-shell">
        <Calendar selected={selectedDate} onSelect={setSelectedDate} />
      </Card>
    </div>
  );
});

const AccountFormDemo = memo(function AccountFormDemo({
  visible,
}: {
  visible: boolean;
}) {
  const [passkeyActive, setPasskeyActive] = useState(true);
  if (!visible) return null;
  return (
    <div className="lab-grid-col-form">
      <Card variant="glass" className="lab-form-card">
        <Form className="lab-form-inner" onSubmit={(e) => e.preventDefault()}>
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
  );
});

const ChartAndCodeDemo = memo(function ChartAndCodeDemo({
  chartVisible,
  codeVisible,
}: {
  chartVisible: boolean;
  codeVisible: boolean;
}) {
  if (!chartVisible && !codeVisible) return null;
  return (
    <div className="lab-grid-col-chart">
      {chartVisible && (
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

      {codeVisible && (
        <div className="lab-code-wrap">
          <CodeBlock
            code={CODE_EXAMPLE}
            language="tsx"
            filename="LiquidHero.tsx"
          />
        </div>
      )}
    </div>
  );
});

// Row 3 — Calendar, Form, Chart & Code Block. Memoised on the four match
// flags so typing in the hub search does not re-render it unless a flag flips.
const GridRow = memo(function GridRow({
  calendarVisible,
  formVisible,
  chartVisible,
  codeVisible,
}: {
  calendarVisible: boolean;
  formVisible: boolean;
  chartVisible: boolean;
  codeVisible: boolean;
}) {
  return (
    <div className="lab-row-grid">
      <CalendarDemo visible={calendarVisible} />
      <AccountFormDemo visible={formVisible} />
      <ChartAndCodeDemo chartVisible={chartVisible} codeVisible={codeVisible} />
    </div>
  );
});

export function MaterialLab() {
  const [surface, setSurface] = useState<Surface>("tahoe");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Stable callback so the memoised TopActions never re-renders for it.
  const focusSearch = useCallback(() => searchRef.current?.focus(), []);

  // The hub search filters the cards below, live as you type.
  const q = query.trim().toLowerCase();
  const match = (keywords: string) => !q || keywords.toLowerCase().includes(q);
  const sliderVisible = match("slider refraction value");
  const switchesVisible = match("switch optics toggle");
  const avatarsVisible = match("avatar team people");
  const shortcutVisible = match("shortcut keyboard command k");
  const calendarVisible = match("calendar november date picker");
  const formVisible = match("apple account form passkey apple id");
  const chartVisible = match("dispersion curve chart transmission index");
  const codeVisible = match("liquidhero code glass button snippet");
  const row3Match = calendarVisible || formVisible || chartVisible || codeVisible;
  const anyMatch =
    sliderVisible ||
    switchesVisible ||
    avatarsVisible ||
    shortcutVisible ||
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
          <TopActions onSearchClick={focusSearch} />

          {/* Row 2 — Search, Slider, Switches, Avatars, Kbd */}
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

            <SliderDemo visible={sliderVisible} />
            <SwitchesDemo visible={switchesVisible} />

            {avatarsVisible && (
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

            {shortcutVisible && (
              <Card variant="glass" className="lab-kbd-card" aria-label="Keyboard shortcuts">
                <span className="lab-kbd-label">Shortcut</span>
                <div className="lab-kbd-cluster">
                  <Kbd size="md">⌘</Kbd>
                  <Kbd size="md">K</Kbd>
                </div>
              </Card>
            )}
          </div>

          {/* Row 3 — Calendar, Form, Chart & Code Block */}
          {row3Match && (
            <GridRow
              calendarVisible={calendarVisible}
              formVisible={formVisible}
              chartVisible={chartVisible}
              codeVisible={codeVisible}
            />
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
