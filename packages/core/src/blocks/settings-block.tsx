import { useState } from "react";
import { Glass } from "../glass";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Item } from "../item";
import { Switch } from "../switch";
import { Slider } from "../slider";
import { SegmentedControl } from "../segmented-control";
import { Button } from "../button";
import { Avatar, AvatarFallback } from "../avatar";
import { Separator } from "../separator";

export interface SettingsBlockProps {
  initialSection?: string;
  onSave?: () => void;
}

export function SettingsBlock({ initialSection = "appearance", onSave }: SettingsBlockProps) {
  const [activeNav, setActiveNav] = useState(initialSection);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBrightness, setAutoBrightness] = useState(true);
  const [volume, setVolume] = useState(75);
  const [accentColor, setAccentColor] = useState("blue");
  const [notifications, setNotifications] = useState(true);

  const navItems = [
    { id: "apple-id", label: "Apple ID", icon: "👤", badge: "Personal" },
    { id: "general", label: "General", icon: "⚙️" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "sound", label: "Sound & Haptics", icon: "🔊" },
    { id: "privacy", label: "Privacy & Security", icon: "🛡️" },
  ];

  return (
    <div className="gl-settings-block">
      {/* Settings Navigation Sidebar */}
      <aside className="gl-glass gl-settings-sidebar">
        {/* User Card */}
        <div className="gl-settings-user-card">
          <Avatar className="gl-settings-user-avatar">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="gl-settings-user-info">
            <span className="gl-settings-user-name">Jane Doe</span>
            <span className="gl-settings-user-id">Apple Account, iCloud+</span>
          </div>
        </div>

        <Separator className="my-3" />

        <nav className="gl-settings-nav-list" role="tablist">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeNav === item.id}
              className="gl-settings-nav-item"
              data-active={activeNav === item.id ? "" : undefined}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="gl-settings-nav-icon">{item.icon}</span>
              <span className="gl-settings-nav-label">{item.label}</span>
              {item.badge && (
                <span className="gl-settings-nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Settings Panel */}
      <main className="gl-settings-main">
        {activeNav === "appearance" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance &amp; Theme</CardTitle>
                <CardDescription>
                  Configure system display mode and Liquid Glass optical refraction strength.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Item
                  title="Dark Interface Mode"
                  description="Optimizes contrast for high-refraction glass panels"
                  accessory={
                    <Switch
                      checked={darkMode}
                      onCheckedChange={(checked) => setDarkMode(checked)}
                    />
                  }
                />
                <Separator />
                <Item
                  title="Accent Color"
                  description="Applied to active glass controls and highlights"
                  accessory={
                    <SegmentedControl
                      value={accentColor}
                      onValueChange={(val: string) => setAccentColor(val)}
                      items={[
                        { value: "blue", label: "Blue" },
                        { value: "purple", label: "Purple" },
                        { value: "orange", label: "Amber" },
                      ]}
                    />
                  }
                />
                <Separator />
                <Item
                  title="True Tone &amp; Brightness"
                  description="Automatically adapt glass reflectance to ambient lighting"
                  accessory={
                    <Switch
                      checked={autoBrightness}
                      onCheckedChange={(checked) => setAutoBrightness(checked)}
                    />
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sound &amp; Haptics</CardTitle>
                <CardDescription>Adjust feedback volume for button clicks and toggles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs opacity-80">
                    <span>Output Volume</span>
                    <span className="font-mono">{volume}%</span>
                  </div>
                  <Slider
                    value={volume}
                    onValueChange={(val: number) => setVolume(val)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost">Reset Defaults</Button>
              <Button variant="filled" onClick={onSave}>Save Preferences</Button>
            </div>
          </div>
        )}

        {activeNav !== "appearance" && (
          <Card>
            <CardHeader>
              <CardTitle className="capitalize">{activeNav.replace("-", " ")}</CardTitle>
              <CardDescription>System preferences and configuration options for {activeNav}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Item
                title="Enable Feature"
                description={`Turn on background synchronization for ${activeNav}`}
                accessory={
                  <Switch
                    checked={notifications}
                    onCheckedChange={(c) => setNotifications(c)}
                  />
                }
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
