"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

const MANAGERS = [
  { id: "npm", cmd: "npm install glacia" },
  { id: "pnpm", cmd: "pnpm add glacia" },
  { id: "yarn", cmd: "yarn add glacia" },
  { id: "bun", cmd: "bun add glacia" },
] as const;

type Manager = (typeof MANAGERS)[number]["id"];

export function InstallCommand({ compact = false }: { compact?: boolean }) {
  const [manager, setManager] = useState<Manager>("npm");
  const [copied, setCopied] = useState(false);

  const command = MANAGERS.find((m) => m.id === manager)?.cmd ?? MANAGERS[0].cmd;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be unavailable */
    }
  };

  return (
    <div className={`install ${compact ? "install-compact" : ""}`}>
      {!compact && (
        <div className="install-managers" role="tablist" aria-label="Package manager">
          {MANAGERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={manager === item.id}
              className="install-manager"
              data-active={manager === item.id}
              onClick={() => setManager(item.id)}
            >
              {item.id}
            </button>
          ))}
        </div>
      )}
      <code className="install-command">{command}</code>
      <button type="button" className="install-copy" onClick={copy} aria-label="Copy install command">
        {copied ? <CheckIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
