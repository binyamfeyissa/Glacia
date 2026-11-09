import {
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

export interface ToastData {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: "default" | "success" | "error" | "info";
  duration?: number;
}

type ToastListener = (toasts: ToastData[]) => void;

let toastsState: ToastData[] = [];
const listeners = new Set<ToastListener>();

function notify() {
  listeners.forEach((l) => l([...toastsState]));
}

export const toast = (title: ReactNode, options?: Omit<ToastData, "id" | "title">) => {
  const id = Math.random().toString(36).slice(2, 9);
  const newToast: ToastData = {
    id,
    title,
    ...options,
    duration: options?.duration ?? 4000,
  };
  toastsState = [...toastsState, newToast];
  notify();

  const duration = newToast.duration ?? 4000;
  if (duration > 0) {
    setTimeout(() => {
      toastsState = toastsState.filter((t) => t.id !== id);
      notify();
    }, duration);
  }
  return id;
};

toast.success = (title: ReactNode, options?: Omit<ToastData, "id" | "title" | "type">) =>
  toast(title, { ...options, type: "success" });

toast.error = (title: ReactNode, options?: Omit<ToastData, "id" | "title" | "type">) =>
  toast(title, { ...options, type: "error" });

toast.info = (title: ReactNode, options?: Omit<ToastData, "id" | "title" | "type">) =>
  toast(title, { ...options, type: "info" });

toast.dismiss = (id?: string) => {
  if (id) {
    toastsState = toastsState.filter((t) => t.id !== id);
  } else {
    toastsState = [];
  }
  notify();
};

export interface ToasterProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center" | "top-center";
  className?: string;
}

export function Toaster({ position = "bottom-right", className }: ToasterProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className={cx("gl-toaster", `gl-toaster-${position}`, className)} tabIndex={-1}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="gl-glass gl-toast"
          data-type={t.type || "default"}
          role="status"
        >
          <div className="gl-toast-body">
            {t.title && <div className="gl-toast-title">{t.title}</div>}
            {t.description && <div className="gl-toast-description">{t.description}</div>}
          </div>
          {t.action && (
            <button
              type="button"
              className="gl-toast-action"
              onClick={() => {
                t.action?.onClick();
                toast.dismiss(t.id);
              }}
            >
              {t.action.label}
            </button>
          )}
          <button
            type="button"
            className="gl-toast-close"
            onClick={() => toast.dismiss(t.id)}
            aria-label="Dismiss toast"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
