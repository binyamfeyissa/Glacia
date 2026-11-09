import * as React from "react";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code,
      language = "typescript",
      filename,
      showLineNumbers = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code", err);
      }
    };

    const lines = code.trim().split("\n");

    return (
      <div
        ref={ref}
        className={`gl-code-block gl-glass ${className}`}
        {...props}
      >
        <div className="gl-code-block-header">
          <div className="gl-window-controls" aria-hidden="true">
            <span className="gl-control-dot gl-dot-close" />
            <span className="gl-control-dot gl-dot-minimize" />
            <span className="gl-control-dot gl-dot-maximize" />
          </div>
          {filename && <span className="gl-code-block-filename">{filename}</span>}
          <div className="gl-code-block-actions">
            {language && <span className="gl-code-block-lang">{language}</span>}
            <button
              type="button"
              onClick={handleCopy}
              className="gl-code-copy-btn gl-glass"
              aria-label={copied ? "Copied" : "Copy code"}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="gl-code-block-body">
          <pre className="gl-code-pre">
            <code>
              {lines.map((line, idx) => (
                <div key={idx} className="gl-code-line">
                  {showLineNumbers && (
                    <span className="gl-code-line-number" aria-hidden="true">
                      {idx + 1}
                    </span>
                  )}
                  <span className="gl-code-line-content">{line || " "}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";
