"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CodeBlock({
  code,
  filename,
  className = "",
}: {
  code: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be unavailable */
    }
  };

  return (
    <div className={`code-block ${className}`}>
      <div className="code-block-bar">
        <span className="code-block-filename">
          <span className="code-dot" aria-hidden="true" />
          {filename ?? "example.tsx"}
        </span>
        <button type="button" className="code-copy" onClick={copy}>
          {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-block-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
