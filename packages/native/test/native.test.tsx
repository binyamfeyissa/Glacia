import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
  CardFooter,
  isGlassSupported,
} from "../src";

describe("Glacia Native Components", () => {
  it("exports isGlassSupported as boolean", () => {
    expect(typeof isGlassSupported).toBe("boolean");
  });

  it("renders Glass container", () => {
    const { container } = render(<Glass effect="regular">Glass content</Glass>);
    expect(container.textContent).toContain("Glass content");
  });

  it("renders Button with accessibilityLabel and fires click", () => {
    let pressed = false;
    render(
      <Button
        accessibilityLabel="Action button"
        variant="filled"
        onPress={() => {
          pressed = true;
        }}
      >
        Press Me
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Action button" });
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(pressed).toBe(true);
  });

  it("renders Switch and toggles state", () => {
    let checked = false;
    render(
      <Switch
        accessibilityLabel="Dark mode switch"
        onCheckedChange={(c) => {
          checked = c;
        }}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "Dark mode switch" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(toggle);
    expect(checked).toBe(true);
  });

  it("renders Slider with value", () => {
    const { container } = render(
      <Slider
        accessibilityLabel="Volume"
        min={0}
        max={100}
        defaultValue={75}
      />,
    );
    const range = container.querySelector('input[type="range"]') as HTMLInputElement;
    expect(range.value).toBe("75");
  });

  it("renders SegmentedControl with options and handles selection", () => {
    let selected = "Day";
    render(
      <SegmentedControl
        values={["Day", "Week", "Month"]}
        selectedIndex={0}
        onValueChange={(val) => {
          selected = val;
        }}
      />,
    );

    const weekBtn = screen.getByText("Week");
    fireEvent.click(weekBtn);
    expect(selected).toBe("Week");
  });

  it("renders TabBar and switches active tabs", () => {
    let active = "home";
    render(
      <TabBar
        items={[
          { id: "home", label: "Home" },
          { id: "search", label: "Search" },
          { id: "profile", label: "Profile" },
        ]}
        defaultActiveId="home"
        onTabChange={(id) => {
          active = id;
        }}
      />,
    );

    const searchTab = screen.getByText("Search");
    fireEvent.click(searchTab);
    expect(active).toBe("search");
  });

  it("renders Card with all slots", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Native Card</CardTitle>
          <CardDescription>iOS 26 Liquid Glass</CardDescription>
        </CardHeader>
        <CardContent>Card body content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Native Card")).toBeDefined();
    expect(screen.getByText("iOS 26 Liquid Glass")).toBeDefined();
    expect(screen.getByText("Card body content")).toBeDefined();
    expect(screen.getByText("Footer actions")).toBeDefined();
  });
});
