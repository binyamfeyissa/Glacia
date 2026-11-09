"use client";

import { useBackdrop, type BackdropType } from "./backdrop-context";
import { Button } from "glacia";

export function BackdropSwitcher() {
  const { backdrop, setBackdrop, theme, toggleTheme } = useBackdrop();

  const options: { id: BackdropType; label: string }[] = [
    { id: "photo", label: "📷 Photo" },
    { id: "video", label: "🎬 Moving Video" },
    { id: "gradient", label: "🎨 Gradient" },
    { id: "plain", label: "◻ Plain" },
  ];

  return (
    <div className="gl-backdrop-bar">
      <span className="gl-backdrop-label">Backdrop:</span>
      <div className="gl-backdrop-buttons">
        {options.map((opt) => (
          <Button
            key={opt.id}
            size="sm"
            variant={backdrop === opt.id ? "filled" : "glass"}
            onClick={() => setBackdrop(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <Button size="sm" variant="glass" onClick={toggleTheme} className="gl-theme-btn">
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </Button>
    </div>
  );
}
