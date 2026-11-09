import * as React from "react";

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "user" | "assistant" | "system";
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ role = "user", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`gl-message gl-message-${role} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Message.displayName = "Message";

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "gradient";
}

export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ variant = "glass", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`gl-message-bubble gl-message-bubble-${variant} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
MessageBubble.displayName = "MessageBubble";

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: React.ReactNode;
}

export const MessageAvatar = React.forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ src, fallback, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-message-avatar gl-glass ${className}`} {...props}>
        {src ? (
          <img src={src} alt="Avatar" className="gl-message-avatar-img" />
        ) : (
          <span className="gl-message-avatar-fallback">{fallback || "AI"}</span>
        )}
      </div>
    );
  }
);
MessageAvatar.displayName = "MessageAvatar";

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-message-content ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
MessageContent.displayName = "MessageContent";

export interface MessageTimestampProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const MessageTimestamp = React.forwardRef<HTMLSpanElement, MessageTimestampProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <span ref={ref} className={`gl-message-timestamp ${className}`} {...props}>
        {children}
      </span>
    );
  }
);
MessageTimestamp.displayName = "MessageTimestamp";

export interface MessageStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "sent" | "delivered" | "read";
}

export const MessageStatus = React.forwardRef<HTMLSpanElement, MessageStatusProps>(
  ({ status = "read", className = "", children, ...props }, ref) => {
    return (
      <span ref={ref} className={`gl-message-status ${className}`} {...props}>
        {children || (status === "read" ? "Read" : status === "delivered" ? "Delivered" : "Sent")}
      </span>
    );
  }
);
MessageStatus.displayName = "MessageStatus";
