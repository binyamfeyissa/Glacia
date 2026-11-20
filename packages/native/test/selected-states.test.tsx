// Selected states and the second routing pass.
//
// The web marks a selection with a "lens": the selected tint, lifted by a
// shadow and edged with the same painted rim as the surface around it. The
// fallback cannot use a second `Glass` for that (glass inside glass), so these
// tests pin the painted stand-in:
//
// - a selected row renders the lens, rim included, and an unselected one doesn't,
// - the segmented control and tab bar keep their sliding indicator with a rim,
// - bar charts draw the web's gradient fill with an inset edge,
// - the AI family's five surfaces are real panel glass,
// - and the routing pass covers the surfaces that used to default.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Banner, ListItem } from "../src/Feedback";
import { ButtonGroup, ToggleGroup } from "../src/Forms2";
import { SegmentedControl } from "../src/SegmentedControl";
import { TabBar } from "../src/TabBar";
import { Select } from "../src/Form";
import { Avatar, Progress } from "../src/Display";
import { Toolbar, FAB, IconButton, SearchBar } from "../src/Bars";
import { Drawer } from "../src/Overlays";
import { NativeBarChart } from "../src/charts/BarChart";
import {
  NativePanelside,
  NativePlan,
  NativeResponse,
  NativeSources,
  NativeTask,
} from "../src/ai";

/** The painted rim of a lens or surface: an SVG stroked with a gradient. */
function hasRim(node: ParentNode) {
  const stroked = Array.from(node.querySelectorAll("rect")).find((rect) =>
    (rect.getAttribute("stroke") ?? "").startsWith("url(#"),
  );
  return Boolean(stroked);
}

/** Every rim painted under a node: one per glass surface or lens. */
function rimCount(node: ParentNode) {
  return Array.from(node.querySelectorAll("svg")).filter((svg) =>
    svg.querySelector('[id^="rim-"]'),
  ).length;
}

describe("the selected lens", () => {
  it("marks a selected list row with a lens behind its content", () => {
    const { container, getByText } = render(
      <ListItem title="Inbox" description="12 unread" selected testID="row" />,
    );

    const lens = container.querySelector('[data-testid="row-lens"]');
    expect(lens).not.toBeNull();
    // The rim is what separates a lens from a flat wash.
    expect(hasRim(lens as HTMLElement)).toBe(true);
    // The row still reads, and its own box carries no flat tint.
    const row = container.querySelector('[data-testid="row"]') as HTMLElement;
    expect(row.style.backgroundColor).not.toContain("rgba");
    expect(getByText("Inbox")).toBeTruthy();
  });

  it("does not paint a lens on an unselected row", () => {
    const { container } = render(<ListItem title="Archive" testID="row" />);
    expect(container.querySelector('[data-testid="row-lens"]')).toBeNull();
  });

  it("gives the chosen ToggleGroup item a lens inside the rail", () => {
    const { container } = render(
      <ToggleGroup
        value="week"
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
        ]}
      />,
    );
    // The rail plus the lens under the chosen item.
    expect(rimCount(container)).toBeGreaterThanOrEqual(2);
  });

  it("lifts the AI panelside's active row", () => {
    const { container } = render(
      <NativePanelside
        value="chat"
        items={[
          { id: "chat", label: "Chats" },
          { id: "prompts", label: "Prompts" },
        ]}
      />,
    );
    expect(rimCount(container)).toBeGreaterThanOrEqual(2);
  });
});

describe("the sliding indicators keep their motion and gain the light", () => {
  it("paints a rim on the segmented control's thumb", () => {
    const { container } = render(
      <SegmentedControl segments={["Day", "Week", "Month"]} selectedIndex={1} />,
    );
    // The rail and the thumb.
    expect(rimCount(container)).toBeGreaterThanOrEqual(2);
  });

  it("paints a rim on the tab bar's indicator", () => {
    const { container } = render(
      <TabBar
        items={[
          { id: "home", label: "Home" },
          { id: "search", label: "Search" },
        ]}
      />,
    );
    expect(rimCount(container)).toBeGreaterThanOrEqual(2);
  });
});

describe("charts", () => {
  it("fills bars with a vertical gradient and an inset edge", () => {
    const { container } = render(
      <NativeBarChart
        labels={["Mon", "Tue"]}
        series={[{ name: "Visits", values: [4, 9] }]}
      />,
    );

    // The gradient is identified by its id, so the assertion does not depend on
    // how the SVG element's camel-case name survives in the DOM.
    const gradients = Array.from(container.querySelectorAll('[id^="bar-"]'));
    expect(gradients.length).toBeGreaterThan(0);
    expect(gradients[0].querySelectorAll("stop").length).toBe(3);

    const bars = Array.from(container.querySelectorAll("rect")).filter((rect) =>
      (rect.getAttribute("fill") ?? "").startsWith("url(#bar-"),
    );
    expect(bars.length).toBe(2);
    // The web draws the edge inside the bar, not around it.
    expect(bars[0].getAttribute("stroke")).toBeTruthy();
    expect(Number(bars[0].getAttribute("stroke-width"))).toBeLessThanOrEqual(1);
  });
});

describe("profile routing, second pass", () => {
  it("puts the AI family's five surfaces on panel glass", () => {
    const views = [
      render(<NativePlan steps={[{ id: "1", title: "Read", status: "done" }]} />),
      render(<NativeResponse text="Done." />),
      render(<NativeTask task={{ label: "Indexing", progress: 0.4 }} />),
      render(
        <NativeSources
          sources={[{ id: "s", title: "Docs", url: "https://example.com" }]}
        />,
      ),
      render(<NativePanelside items={[{ id: "a", label: "Chats" }]} value="a" />),
    ];

    for (const view of views) {
      // Each is a Glass surface now: the fallback material and its rim exist
      // at the root.
      expect(rimCount(view.container)).toBeGreaterThanOrEqual(1);
      expect(hasRim(view.container)).toBe(true);
    }
  });

  it("routes the remaining surfaces to a profile instead of the default", () => {
    // These used to fall through to the default panel profile.
    const views = [
      render(<SearchBar placeholder="Search" />),
      render(<FAB accessibilityLabel="Compose" onPress={() => {}} />),
      render(
        <IconButton accessibilityLabel="More" icon={null} onPress={() => {}} />,
      ),
      render(<Toolbar title="Inbox" />),
      render(<Banner title="Heads up" message="Something happened." onDismiss={() => {}} />),
      render(<ButtonGroup items={[{ label: "One", onPress: () => {} }]} />),
      render(<Avatar name="Ada" />),
      render(<Progress value={40} />),
    ];

    for (const view of views) {
      // Each is a Glass surface now: the fallback material and its rim exist
      // at the root.
      expect(rimCount(view.container)).toBeGreaterThanOrEqual(1);
    }
  });
});
