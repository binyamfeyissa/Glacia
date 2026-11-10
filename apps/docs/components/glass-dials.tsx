"use client";

import { useEffect, useState } from "react";
import { resweepGlass } from "glacia";
import { SparkIcon, CloseIcon } from "./icons";

export function GlassDials() {
  const [open, setOpen] = useState(false);
  const [bend, setBend] = useState(0.45);
  const [dispersion, setDispersion] = useState(0.40);
  const [frost, setFrost] = useState(3);
  const [rim, setRim] = useState(0.13);

  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const b = parseFloat(style.getPropertyValue("--gl-glass-bend"));
    const d = parseFloat(style.getPropertyValue("--gl-glass-dispersion"));
    const f = parseFloat(style.getPropertyValue("--gl-blur"));
    const r = parseFloat(style.getPropertyValue("--gl-rim-shine"));
    if (Number.isFinite(b)) setBend(b);
    if (Number.isFinite(d)) setDispersion(d);
    if (Number.isFinite(f)) setFrost(f);
    if (Number.isFinite(r)) setRim(r);
  }, []);

  const update = (
    nextBend: number,
    nextDispersion: number,
    nextFrost: number,
    nextRim: number,
  ) => {
    const root = document.documentElement;
    root.style.setProperty("--gl-glass-bend", String(nextBend));
    root.style.setProperty("--gl-glass-dispersion", String(nextDispersion));
    root.style.setProperty("--gl-blur", `${nextFrost}px`);
    root.style.setProperty("--gl-glass-frost", String(nextFrost / 3));
    root.style.setProperty("--gl-rim-shine", String(nextRim));
    window.dispatchEvent(new Event("glacia:glass-update"));
    resweepGlass();
  };

  const handleBend = (v: number) => {
    setBend(v);
    update(v, dispersion, frost, rim);
  };

  const handleDispersion = (v: number) => {
    setDispersion(v);
    update(bend, v, frost, rim);
  };

  const handleFrost = (v: number) => {
    setFrost(v);
    update(bend, dispersion, v, rim);
  };

  const handleRim = (v: number) => {
    setRim(v);
    update(bend, dispersion, frost, v);
  };

  const resetDefaults = () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const defaultRim = isLight ? 0.30 : 0.13;
    setBend(0.45);
    setDispersion(0.40);
    setFrost(3);
    setRim(defaultRim);
    update(0.45, 0.40, 3, defaultRim);
  };

  return (
    <div className="glass-dials-widget">
      {!open ? (
        <button
          type="button"
          className="gl-glass glass-dials-trigger"
          onClick={() => setOpen(true)}
          aria-label="Open Liquid Glass Dials"
          title="Tweak Liquid Glass Optics"
        >
          <SparkIcon width={14} height={14} />
          <span>Glass Optics</span>
        </button>
      ) : (
        <div className="gl-glass glass-dials-panel">
          <div className="glass-dials-head">
            <div className="glass-dials-title">
              <SparkIcon width={14} height={14} />
              <span>Liquid Glass Dials</span>
            </div>
            <div className="glass-dials-actions">
              <button
                type="button"
                className="glass-dials-reset"
                onClick={resetDefaults}
                title="Reset to Glisse reference defaults"
              >
                Reset
              </button>
              <button
                type="button"
                className="glass-dials-close"
                onClick={() => setOpen(false)}
                aria-label="Close Dials"
              >
                <CloseIcon width={14} height={14} />
              </button>
            </div>
          </div>

          <div className="glass-dials-body">
            {/* Bend Dial */}
            <div className="glass-dial-row">
              <div className="glass-dial-label">
                <span>Bend</span>
                <span className="glass-dial-value">{bend.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="glass-dial-slider"
                min={0}
                max={1.5}
                step={0.05}
                value={bend}
                onChange={(e) => handleBend(parseFloat(e.target.value))}
                aria-label="Bend strength"
              />
            </div>

            {/* Dispersion Dial */}
            <div className="glass-dial-row">
              <div className="glass-dial-label">
                <span>Dispersion</span>
                <span className="glass-dial-value">{dispersion.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="glass-dial-slider"
                min={0}
                max={1.5}
                step={0.05}
                value={dispersion}
                onChange={(e) => handleDispersion(parseFloat(e.target.value))}
                aria-label="Chromatic dispersion"
              />
            </div>

            {/* Frost Dial */}
            <div className="glass-dial-row">
              <div className="glass-dial-label">
                <span>Frost</span>
                <span className="glass-dial-value">{frost}px</span>
              </div>
              <input
                type="range"
                className="glass-dial-slider"
                min={0}
                max={16}
                step={1}
                value={frost}
                onChange={(e) => handleFrost(parseFloat(e.target.value))}
                aria-label="Frost blur radius"
              />
            </div>

            {/* Rim Dial */}
            <div className="glass-dial-row">
              <div className="glass-dial-label">
                <span>Rim</span>
                <span className="glass-dial-value">{rim.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="glass-dial-slider"
                min={0}
                max={1}
                step={0.01}
                value={rim}
                onChange={(e) => handleRim(parseFloat(e.target.value))}
                aria-label="Rim shine intensity"
              />
            </div>
          </div>

          <div className="glass-dials-foot">
            <span>Updates all 72 components live</span>
          </div>
        </div>
      )}
    </div>
  );
}
