import * as React from "react";
import { Glass } from "../glass";
import { Button } from "../button";
import { Badge } from "../badge";

export function LandingBlock() {
  return (
    <div className="gl-landing-block">
      {/* Floating Glass Pill Nav */}
      <div className="gl-landing-nav-wrap">
        <Glass className="gl-landing-nav-pill">
          <div className="gl-landing-nav-brand">
            <span className="gl-landing-logo">❄</span>
            <span className="gl-landing-title">Glacia</span>
          </div>
          <div className="gl-landing-nav-links">
            <span className="gl-landing-link">Features</span>
            <span className="gl-landing-link">Optics</span>
            <span className="gl-landing-link">Showcase</span>
            <span className="gl-landing-link">Pricing</span>
          </div>
          <Button size="sm" variant="filled" className="gl-landing-nav-cta">
            Download
          </Button>
        </Glass>
      </div>

      {/* Hero Section */}
      <section className="gl-landing-hero">
        <Badge variant="default" className="gl-landing-badge">
          iOS 26 & macOS Ready
        </Badge>
        <h1 className="gl-landing-headline">
          Liquid Glass for the <br />
          <span className="gl-landing-gradient-text">Modern Web & Mobile</span>
        </h1>
        <p className="gl-landing-subhead">
          Real optical refraction bending live background pixels, specular edge rim light,
          and authentic Apple HIG ergonomics from a single unified design system.
        </p>

        <div className="gl-landing-hero-actions">
          <Button size="lg" variant="filled" className="gl-hero-btn-primary">
            Explore 70 Components
          </Button>
          <Button size="lg" variant="glass" className="gl-hero-btn-secondary">
            View Live Optics
          </Button>
        </div>
      </section>

      {/* 3-Column Glass Feature Cards */}
      <section className="gl-landing-features">
        <Glass className="gl-landing-feature-card">
          <div className="gl-feature-icon-squircle">✦</div>
          <h3 className="gl-feature-title">Real Optical Physics</h3>
          <p className="gl-feature-desc">
            Not flat blur. Glacia computes true refractive displacement across SVG lens vectors,
            bending background elements organically around curved squircle contours.
          </p>
        </Glass>

        <Glass className="gl-landing-feature-card">
          <div className="gl-feature-icon-squircle"></div>
          <h3 className="gl-feature-title">Native iOS 26 UIGlassEffect</h3>
          <p className="gl-feature-desc">
            Runs real Apple native glass on iOS 26+ devices via Callstack Liquid Glass with graceful
            semi-transparent surface fallbacks for older devices and Android.
          </p>
        </Glass>

        <Glass className="gl-landing-feature-card">
          <div className="gl-feature-icon-squircle">⚡</div>
          <h3 className="gl-feature-title">Universal Fallback Ladder</h3>
          <p className="gl-feature-desc">
            Layer 1 frosted blur renders universally in Safari and Firefox; Layer 2 SVG chromatic refraction
            activates automatically on Chromium without breaking layout.
          </p>
        </Glass>
      </section>

      {/* Key Metric Banner */}
      <section className="gl-landing-metrics">
        <Glass className="gl-landing-metrics-card">
          <div className="gl-metric-item">
            <span className="gl-metric-number">70</span>
            <span className="gl-metric-caption">Web Components</span>
          </div>
          <div className="gl-metric-item">
            <span className="gl-metric-number">10</span>
            <span className="gl-metric-caption">Production Blocks</span>
          </div>
          <div className="gl-metric-item">
            <span className="gl-metric-number">0.4ms</span>
            <span className="gl-metric-caption">Refraction Latency</span>
          </div>
          <div className="gl-metric-item">
            <span className="gl-metric-number">100%</span>
            <span className="gl-metric-caption">TypeScript & HIG</span>
          </div>
        </Glass>
      </section>
    </div>
  );
}
