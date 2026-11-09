"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("glacia-theme", next);
    } catch {
      /* storage can be unavailable in private contexts */
    }
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light appearance" : "Switch to dark appearance"}
      title={theme === "dark" ? "Light appearance" : "Dark appearance"}
    >
      {theme === "dark" ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
    </button>
  );
}
