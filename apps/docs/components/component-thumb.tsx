"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Progress,
  SearchField,
  SegmentedControl,
  Slider,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
} from "glacia";

export function ComponentThumb({ slug, name }: { slug: string; name?: string }) {
  switch (slug) {
    case "button":
      return (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="filled" size="sm">
            Continue
          </Button>
          <Button variant="glass" size="sm">
            Cancel
          </Button>
        </div>
      );

    case "segmented-control":
      return (
        <SegmentedControl
          defaultValue="day"
          items={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      );

    case "switch":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Switch defaultChecked aria-label="Rim light" />
          <span style={{ fontSize: 12, color: "var(--gl-muted)" }}>Rim light</span>
        </div>
      );

    case "slider":
      return (
        <div style={{ width: 210 }}>
          <Slider defaultValue={65} aria-label="Value" />
        </div>
      );

    case "search-field":
      return (
        <div style={{ width: 240 }}>
          <SearchField placeholder="Search" />
        </div>
      );

    case "tabs":
      return (
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
          </TabsList>
        </Tabs>
      );

    case "progress":
      return (
        <div style={{ width: 200 }}>
          <Progress value={72} aria-label="Progress" />
        </div>
      );

    case "badge":
      return (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <Badge>New</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">v0.1</Badge>
        </div>
      );

    case "avatar":
      return (
        <div style={{ display: "flex" }}>
          <Avatar>
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <Avatar style={{ marginLeft: -8 }}>
            <AvatarFallback>GL</AvatarFallback>
          </Avatar>
          <Avatar style={{ marginLeft: -8 }}>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      );

    default:
      return (
        <div className="thumb-specimen">
          <div className="thumb-specimen-shine" aria-hidden="true" />
          <span className="thumb-specimen-kicker">Glacia</span>
          <span className="thumb-specimen-title">{name ?? "Component"}</span>
          <span className="thumb-specimen-bar" />
          <span className="thumb-specimen-bar short" />
        </div>
      );
  }
}
