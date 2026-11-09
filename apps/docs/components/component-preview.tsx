"use client";

import { useState, type ReactNode } from "react";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "glacia";

export interface ComponentPreviewProps {
  name: string;
  slug: string;
  children: ReactNode;
  code: string;
}

export function ComponentPreview({ name, slug, children, code }: ComponentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [installTab, setInstallTab] = useState<"npm" | "cli">("npm");

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInstall = () => {
    const cmd = installTab === "npm" ? "npm install glacia" : `npx glacia add ${slug}`;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gl-preview-container">
      {/* Install command selector */}
      <div className="gl-install-bar">
        <div className="gl-install-tabs">
          <Button
            size="sm"
            variant={installTab === "npm" ? "filled" : "ghost"}
            onClick={() => setInstallTab("npm")}
          >
            NPM Package
          </Button>
          <Button
            size="sm"
            variant={installTab === "cli" ? "filled" : "ghost"}
            onClick={() => setInstallTab("cli")}
          >
            Glacia Copy Command
          </Button>
        </div>
        <div className="gl-install-code-box" onClick={copyInstall} role="button" tabIndex={0}>
          <code>{installTab === "npm" ? "npm install glacia" : `npx glacia add ${slug}`}</code>
          <span className="gl-copy-hint">{copied ? "✓ Copied" : "Copy"}</span>
        </div>
      </div>

      {/* Live Stage */}
      <div className="gl-preview-stage" data-glacia-backdrop>
        {/* Optical detail background pattern to reveal refraction */}
        <div className="gl-stage-detail-layer">
          <span className="gl-stage-text-bg">LIQUID GLASS REFRACTION</span>
        </div>
        <div className="gl-preview-render">{children}</div>
      </div>

      {/* Code Sample */}
      <div className="gl-code-box">
        <div className="gl-code-header">
          <span className="gl-code-filename">{slug}.tsx</span>
          <Button size="sm" variant="glass" onClick={copyCode}>
            {copied ? "✓ Copied Code" : "Copy Code"}
          </Button>
        </div>
        <pre className="gl-code-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
