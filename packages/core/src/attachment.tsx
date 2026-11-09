import * as React from "react";

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: string;
  type?: "image" | "pdf" | "audio" | "code" | "file";
  src?: string;
  onRemove?: () => void;
  onPreview?: () => void;
}

export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      name,
      size,
      type = "file",
      src,
      onRemove,
      onPreview,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`gl-attachment gl-glass ${className}`}
        onClick={onPreview}
        role={onPreview ? "button" : undefined}
        tabIndex={onPreview ? 0 : undefined}
        {...props}
      >
        {src && type === "image" ? (
          <div className="gl-attachment-thumbnail">
            <img src={src} alt={name} />
          </div>
        ) : (
          <div className={`gl-attachment-icon-plate gl-attachment-${type}`}>
            {type === "pdf" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            ) : type === "audio" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
            )}
          </div>
        )}
        <div className="gl-attachment-meta">
          <span className="gl-attachment-name" title={name}>{name}</span>
          {size && <span className="gl-attachment-size">{size}</span>}
        </div>
        {onRemove && (
          <button
            type="button"
            className="gl-attachment-remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${name}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Attachment.displayName = "Attachment";
