"use client";

import { useState } from "react";

/** A copyable command or code panel that uses the site's real clipboard path. */
export function CopyBlock({
  code,
  language = "bash",
  label,
}: {
  code: string;
  language?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard can be unavailable */
    }
  };

  return (
    <div className="copy-block">
      <div className="copy-block-bar">
        <span className="copy-block-lang">{label ?? language}</span>
        <button type="button" onClick={copy} className="copy-block-button">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="copy-block-code">
        <code>{code}</code>
      </pre>
    </div>
  );
}
