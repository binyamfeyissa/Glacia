"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";
import { CheckIcon, CopyIcon } from "./icons";

const SURFACES = [
  { id: "tahoe", label: "Tahoe" },
  { id: "fluted", label: "Fluted" },
  { id: "aurora", label: "Aurora" },
  { id: "graphite", label: "Graphite" },
] as const;

type Surface = (typeof SURFACES)[number]["id"];

export interface ComponentPreviewProps {
  name: string;
  slug: string;
  children: React.ReactNode;
  code: string;
}

export function ComponentPreview({ name, slug, children, code }: ComponentPreviewProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [surface, setSurface] = useState<Surface>("tahoe");
  const [installTab, setInstallTab] = useState<"npm" | "cli">("npm");
  const [copied, setCopied] = useState(false);

  const command = installTab === "npm" ? "npm install glacia" : `npx glacia add ${slug}`;

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be unavailable */
    }
  };

  return (
    <div className="preview">
      <div className="preview-bar">
        <div className="preview-tabs" role="tablist" aria-label="Preview mode">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "preview"}
            data-active={tab === "preview"}
            className="preview-tab"
            onClick={() => setTab("preview")}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "code"}
            data-active={tab === "code"}
            className="preview-tab"
            onClick={() => setTab("code")}
          >
            Code
          </button>
        </div>

        {tab === "preview" && (
          <div className="preview-surfaces">
            <span className="preview-surfaces-label">Surface</span>
            {SURFACES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`surface-swatch swatch-${item.id}`}
                data-active={surface === item.id}
                onClick={() => setSurface(item.id)}
                aria-label={`${item.label} surface`}
                title={item.label}
              />
            ))}
          </div>
        )}
      </div>

      {tab === "preview" ? (
        <div
          className={`preview-stage surface-${surface}`}
          data-glacia-backdrop="true"
          data-glisse-backdrop="true"
        >
          <span className="preview-stage-label">
            {name} · {SURFACES.find((item) => item.id === surface)?.label}
          </span>
          <div className="demo-surface">{children}</div>
        </div>
      ) : (
        <div className="preview-code">
          <CodeBlock code={code} filename={`${slug}.tsx`} />
        </div>
      )}

      <div className="preview-foot">
        <div className="preview-install-tabs" role="tablist" aria-label="Install method">
          <button
            type="button"
            role="tab"
            aria-selected={installTab === "npm"}
            data-active={installTab === "npm"}
            className="preview-install-tab"
            onClick={() => setInstallTab("npm")}
          >
            npm
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={installTab === "cli"}
            data-active={installTab === "cli"}
            className="preview-install-tab"
            onClick={() => setInstallTab("cli")}
          >
            CLI
          </button>
        </div>
        <div className="preview-command">
          <code>{command}</code>
          <button type="button" onClick={copyInstall}>
            {copied ? <CheckIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
