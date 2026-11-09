import { useState } from "react";
import {
  Glass,
  Button,
  Switch,
  Slider,
  SegmentedControl,
  TabBar,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  isGlassSupported,
} from "glacia-native";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [switchValue, setSwitchValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(65);
  const [segment, setSegment] = useState("Day");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#fff",
      }}
    >
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Glacia Native Showcase</h1>
        <p style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>
          Hardware Glass Status: {isGlassSupported ? "Active (iOS 26+)" : "Fallback Active (Android / Older iOS)"}
        </p>
      </header>

      {/* 1. Glass Card */}
      <Card style={{ marginBottom: 20 }}>
        <CardHeader>
          <CardTitle>Liquid Glass Container</CardTitle>
          <CardDescription>
            Real refraction via UIGlassEffect on iOS 26+, smooth fallback on Android.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", gap: 12 }}>
            <Button
              variant="filled"
              accessibilityLabel="Primary button"
              onPress={() => alert("Button pressed!")}
            >
              Primary Action
            </Button>
            <Button
              variant="glass"
              accessibilityLabel="Secondary glass button"
              onPress={() => alert("Glass action")}
            >
              Glass Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Controls Section */}
      <Glass style={{ padding: 18, borderRadius: 20, marginBottom: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Notifications</span>
          <Switch
            accessibilityLabel="Notifications switch"
            checked={switchValue}
            onCheckedChange={setSwitchValue}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span>Sound Volume</span>
            <span>{sliderValue}%</span>
          </div>
          <Slider
            accessibilityLabel="Sound volume"
            value={sliderValue}
            onValueChange={setSliderValue}
          />
        </div>

        <div>
          <span style={{ fontSize: 13, display: "block", marginBottom: 6 }}>View Range</span>
          <SegmentedControl
            values={["Day", "Week", "Month", "Year"]}
            selectedIndex={["Day", "Week", "Month", "Year"].indexOf(segment)}
            onValueChange={(val) => setSegment(val)}
          />
        </div>
      </Glass>

      {/* 3. Bottom Tab Bar */}
      <TabBar
        items={[
          { id: "home", label: "Home" },
          { id: "explore", label: "Explore" },
          { id: "activity", label: "Activity" },
          { id: "profile", label: "Profile" },
        ]}
        activeId={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
