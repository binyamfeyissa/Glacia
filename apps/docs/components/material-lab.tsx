"use client";

import { useState } from "react";
import { Button, SegmentedControl, Slider, Switch, resweepGlass } from "glacia";
import { SnowflakeIcon, SparkIcon } from "./icons";

const SURFACES = [
  { id: "tahoe", label: "Tahoe" },
  { id: "aurora", label: "Aurora" },
  { id: "fluted", label: "Fluted" },
  { id: "dusk", label: "Dusk" },
  { id: "graphite", label: "Graphite" },
  { id: "video", label: "Video" },
] as const;

type Surface = (typeof SURFACES)[number]["id"];

export function MaterialLab() {
  const [surface, setSurface] = useState<Surface>("tahoe");

  return (
    <div className="lab-frame">
      <div className="lab-bar">
        <span className="lab-bar-label">
          <SparkIcon width={13} height={13} />
          <span>Material lab</span>
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

      <div
        className={`lab-stage surface-${surface}`}
        data-glacia-backdrop="true"
        data-glisse-backdrop="true"
      >
        {surface === "video" ? (
          <video
            className="lab-stage-video"
            autoPlay
            loop
            muted
            playsInline
            poster="/wallpapers/flow-poster.jpg"
            aria-hidden="true"
          >
            <source src="/wallpapers/flow-loop.mp4" type="video/mp4" />
          </video>
        ) : null}
        <div className="lab-orb lab-orb-a" aria-hidden="true" />
        <div className="lab-orb lab-orb-b" aria-hidden="true" />
        <div className="lab-grid" aria-hidden="true" />

        <div className="lab-widgets">
          <div className="gl-glass lab-card lab-player">
            <div className="lab-album" aria-hidden="true">
              <SnowflakeIcon width={24} height={24} />
            </div>
            <div className="lab-player-meta">
              <span className="lab-overline">Now playing</span>
              <strong>Liquid Motion</strong>
              <small>Glacia Sound System</small>
            </div>
            <div className="lab-player-controls">
              <button type="button" className="lab-control-button" aria-label="Previous track">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
                  <path d="M4 3h1.6v10H4zM12.5 3v10L6 8z" />
                </svg>
              </button>
              <button type="button" className="lab-control-button is-play" aria-label="Play">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.4v9.2L12.4 8z" />
                </svg>
              </button>
              <button type="button" className="lab-control-button" aria-label="Next track">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
                  <path d="M10.4 3H12v10h-1.6zM3.5 3v10L10 8z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="gl-glass lab-card lab-mix">
            <div className="lab-mix-head">
              <span>Optical mix</span>
              <span className="lab-live">Live</span>
            </div>
            <div className="lab-row">
              <span className="lab-row-label">Bend</span>
              <div className="lab-control">
                <Slider
                  defaultValue={45}
                  min={0}
                  max={150}
                  aria-label="Bend strength"
                  onValueChange={(val) => {
                    const bend = typeof val === "number" ? val / 100 : 0.45;
                    document.documentElement.style.setProperty("--gl-glass-bend", String(bend));
                    resweepGlass();
                  }}
                />
              </div>
            </div>
            <div className="lab-row">
              <span className="lab-row-label">Dispersion</span>
              <div className="lab-control">
                <Slider
                  defaultValue={40}
                  min={0}
                  max={150}
                  aria-label="Dispersion"
                  onValueChange={(val) => {
                    const disp = typeof val === "number" ? val / 100 : 0.40;
                    document.documentElement.style.setProperty("--gl-glass-dispersion", String(disp));
                    resweepGlass();
                  }}
                />
              </div>
            </div>
            <div className="lab-row">
              <span className="lab-row-label">Frost</span>
              <div className="lab-control">
                <Slider
                  defaultValue={20}
                  min={0}
                  max={100}
                  aria-label="Frost"
                  onValueChange={(val) => {
                    const frost = typeof val === "number" ? Math.round((val / 100) * 16) : 3;
                    document.documentElement.style.setProperty("--gl-blur", `${frost}px`);
                    resweepGlass();
                  }}
                />
              </div>
            </div>
            <div className="lab-row">
              <span className="lab-row-label">Rim</span>
              <div className="lab-control">
                <Slider
                  defaultValue={13}
                  min={0}
                  max={100}
                  aria-label="Rim shine"
                  onValueChange={(val) => {
                    const shine = typeof val === "number" ? val / 100 : 0.13;
                    document.documentElement.style.setProperty("--gl-rim-shine", String(shine));
                    resweepGlass();
                  }}
                />
              </div>
            </div>
          </div>

          <div className="gl-glass lab-toolbar">
            <SegmentedControl
              defaultValue="day"
              items={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
            />
            <div className="lab-toolbar-actions">
              <Button size="sm" variant="glass">
                Share
              </Button>
              <Button size="sm" variant="filled">
                Export
              </Button>
            </div>
          </div>
        </div>

        <span className="lab-stage-caption">Rendered live · no screenshots</span>
      </div>

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
