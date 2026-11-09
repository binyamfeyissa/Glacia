"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type BackdropType = "fluted" | "photo" | "video" | "gradient" | "plain";

interface BackdropContextValue {
  backdrop: BackdropType;
  setBackdrop: (backdrop: BackdropType) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const BackdropContext = createContext<BackdropContextValue | undefined>(undefined);

export function BackdropProvider({ children }: { children: ReactNode }) {
  const [backdrop, setBackdrop] = useState<BackdropType>("fluted");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <BackdropContext.Provider
      value={{
        backdrop,
        setBackdrop,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      <div
        className={`gl-docs-root gl-backdrop-${backdrop}`}
        data-theme={theme}
      >
        {children}
      </div>
    </BackdropContext.Provider>
  );
}

export function useBackdrop() {
  const context = useContext(BackdropContext);
  if (!context) {
    throw new Error("useBackdrop must be used within BackdropProvider");
  }
  return context;
}
