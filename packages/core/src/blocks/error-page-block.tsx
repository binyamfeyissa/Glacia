import * as React from "react";
import { Glass } from "../glass";
import { Button } from "../button";
import { Badge } from "../badge";

export interface ErrorPageBlockProps {
  code?: "404" | "500";
}

export function ErrorPageBlock({ code = "404" }: ErrorPageBlockProps) {
  const is404 = code === "404";

  return (
    <div className="gl-error-page-block">
      <Glass className="gl-error-card">
        <div className="gl-error-badge-row">
          <Badge variant={is404 ? "secondary" : "destructive"}>
            {is404 ? "Status 404 — Not Found" : "Status 500 — Server Exception"}
          </Badge>
        </div>

        <div className="gl-error-hero-text">
          <span className="gl-error-code-huge">{code}</span>
        </div>

        <div className="gl-error-copy">
          <h2 className="gl-error-title">
            {is404 ? "This page has dissolved into thin glass" : "Optical Refraction Interrupted"}
          </h2>
          <p className="gl-error-desc">
            {is404
              ? "The destination URL does not exist or has been relocated to another coordinate in the Glacia design system."
              : "An unexpected runtime fault occurred while rendering the liquid glass refraction layer. Engineers have been notified."}
          </p>
        </div>

        <div className="gl-error-actions">
          <a href="/">
            <Button variant="filled" className="gl-error-btn-primary">
              Return to Overview
            </Button>
          </a>
          <a href="/components/button">
            <Button variant="glass" className="gl-error-btn-secondary">
              Browse Components
            </Button>
          </a>
          <a href="/build-report">
            <Button variant="ghost" className="gl-error-btn-tertiary">
              System Status
            </Button>
          </a>
        </div>
      </Glass>
    </div>
  );
}
