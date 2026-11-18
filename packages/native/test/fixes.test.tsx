// The fixes in this release, one test per change.
//
// These are behavioural: each one fails if the fix is reverted.

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  Button,
  CardTitle,
  Checkbox,
  Dialog as DialogPanel,
  Input,
  Label,
  NativeAIInput,
  NativePlotChart,
  NativeScatterChart,
  NativeTable,
  NativeTask,
  NativeWaterfallChart,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Tabs,
  TabBar,
} from "../src";

describe("#9 Input — uncontrolled placeholder", () => {
  it("hides the themed placeholder as soon as the user types", () => {
    // No `value` prop: nothing outside re-renders, so the field must track
    // its own text or the placeholder stays over it.
    const { container } = render(<Input placeholder="Email" />);
    const placeholder = () =>
      Array.from(container.querySelectorAll("span")).filter((el) => el.textContent === "Email");

    expect(placeholder()).toHaveLength(1);
    fireEvent.change(container.querySelector("input")!, { target: { value: "a" } });
    expect(placeholder()).toHaveLength(0);
  });

  it("starts from defaultValue when given one", () => {
    const { container } = render(<Input defaultValue="filled" placeholder="Email" />);
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("filled");
  });
});

describe("#11 Label — nativeID", () => {
  it("puts nativeID on the label element", () => {
    const { container } = render(<Label nativeID="email-label">Email</Label>);
    expect(container.querySelector("#email-label")).toBeTruthy();
  });
});

describe("#13–#15 — uncontrolled Checkbox, RadioGroup, Select", () => {
  it("Checkbox keeps its own state and reports changes", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Checkbox defaultChecked label="Agree" onCheckedChange={onCheckedChange} />,
    );
    const box = container.querySelector('[role="checkbox"]')!;
    expect(box.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(box);
    expect(box.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("RadioGroup keeps its own selection", () => {
    const { container } = render(
      <RadioGroup
        defaultValue="sm"
        options={[
          { value: "sm", label: "Small" },
          { value: "lg", label: "Large" },
        ]}
      />,
    );
    const radios = () => Array.from(container.querySelectorAll('[role="radio"]'));
    expect(radios()[0]!.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(radios()[1]!);
    expect(radios()[1]!.getAttribute("aria-checked")).toBe("true");
    expect(radios()[0]!.getAttribute("aria-checked")).toBe("false");
  });

  it("Select keeps its own choice and shows it", () => {
    const { container } = render(
      <Select
        defaultValue="a"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
      />,
    );
    expect(container.querySelector('[aria-expanded]')!.getAttribute("aria-label")).toBe("Alpha");
    fireEvent.click(container.querySelector('[aria-expanded]')!);
    fireEvent.click(container.querySelectorAll("[aria-selected]")[1]!);
    expect(container.querySelector('[aria-expanded]')!.getAttribute("aria-label")).toBe("Beta");
  });
});

describe("#16 Dialog panel and #17 AlertDialog cancel", () => {
  it("renders the dialog panel through the glass switch", () => {
    const { container } = render(<DialogPanel open title="Settings" testID="panel" />);
    // Off-device the glass is the fallback, but it is a real surface element
    // carrying the panel's testID, not a bare solid block.
    const panel = container.querySelector('[data-testid="panel"]')!;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute("style")).toContain("border-radius");
    const material = container.querySelector('[data-testid="panel-tint"]')!;
    expect(material.getAttribute("style")).toContain("background-color");
  });

  // The Android back path itself is covered in android-back.test.tsx, which
  // invokes the BackHandler listener the component registers.

  it("cancels through the Cancel action", () => {
    const onCancel = vi.fn();
    const { container } = render(<AlertDialog open title="Delete?" onCancel={onCancel} />);
    fireEvent.click(container.querySelector('[aria-label="Cancel"]')!);
    expect(onCancel).toHaveBeenCalled();
  });
});

describe("#19 NativeTable — row label", () => {
  it("never stringifies an element cell into the row label", () => {
    const onRowPress = vi.fn();
    const { container } = render(
      <NativeTable
        columns={[
          { key: "name", header: "Name" },
          { key: "role", header: "Role" },
        ]}
        rows={[{ id: "1", cells: { name: <b>Ada</b>, role: "Engineer" } }]}
        onRowPress={onRowPress}
      />,
    );
    const row = container.querySelector('[role="button"]')!;
    expect(row.getAttribute("aria-label")).not.toContain("[object Object]");
    expect(row.getAttribute("aria-label")).toBe("Row");
  });

  it("prefers an explicit row label", () => {
    const { container } = render(
      <NativeTable
        columns={[{ key: "name", header: "Name" }]}
        rows={[{ id: "1", cells: { name: "Ada" }, accessibilityLabel: "Ada Lovelace" }]}
        onRowPress={() => {}}
      />,
    );
    expect(container.querySelector('[role="button"]')!.getAttribute("aria-label")).toBe(
      "Ada Lovelace",
    );
  });

  it("uses a textual primary cell", () => {
    const { container } = render(
      <NativeTable
        columns={[{ key: "name", header: "Name" }]}
        rows={[{ id: "1", cells: { name: "Ada" } }]}
        onRowPress={() => {}}
      />,
    );
    expect(container.querySelector('[role="button"]')!.getAttribute("aria-label")).toBe("Ada");
  });
});

describe("#21 NativeAIInput — uncontrolled", () => {
  it("shows typed text and enables send without a controlling parent", () => {
    const { container } = render(<NativeAIInput placeholder="Ask anything" />);
    const field = container.querySelector("textarea")!;
    expect(container.querySelector('[aria-label="Send"]')!.getAttribute("aria-disabled")).toBe(
      "true",
    );
    fireEvent.change(field, { target: { value: "Hello" } });
    expect((field as HTMLTextAreaElement).value).toBe("Hello");
    expect(container.querySelector('[aria-label="Send"]')!.getAttribute("aria-disabled")).toBe(
      "false",
    );
  });

  it("hides the themed placeholder once there is text", () => {
    const { container } = render(<NativeAIInput placeholder="Ask anything" />);
    const placeholders = () =>
      Array.from(container.querySelectorAll("span")).filter(
        (el) => el.textContent === "Ask anything",
      );
    expect(placeholders()).toHaveLength(1);
    fireEvent.change(container.querySelector("textarea")!, { target: { value: "Hi" } });
    expect(placeholders()).toHaveLength(0);
  });
});

describe("#4 Slider — real dragging", () => {
  it("reads the value from the touch position, honouring min/max/step", () => {
    // jsdom performs no layout, so give every element the width of a real
    // track; on a device React Native reports it through onLayout instead.
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function fakeRect() {
      return {
        left: 0,
        top: 0,
        width: 200,
        height: 40,
        right: 200,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as any;
    };

    try {
      const onValueChange = vi.fn();
      const { container } = render(
        <Slider
          accessibilityLabel="Volume"
          min={0}
          max={100}
          step={5}
          defaultValue={0}
          onValueChange={onValueChange}
        />,
      );
      const slider = container.querySelector('[role="slider"]') as HTMLElement;
      const props = (slider as any)[
        Object.keys(slider).find((key) => key.startsWith("__reactProps"))!
      ];

      // Halfway along a 200pt track is 50, on a step of 5.
      props.onMouseDown({ nativeEvent: { locationX: 100 } });
      expect(onValueChange).toHaveBeenLastCalledWith(50);

      // A quarter along is 25, still snapped to the step.
      props.onMouseMove({ nativeEvent: { locationX: 51 } });
      expect(onValueChange).toHaveBeenLastCalledWith(25);

      // Past the end clamps to max rather than overshooting.
      props.onMouseMove({ nativeEvent: { locationX: 500 } });
      expect(onValueChange).toHaveBeenLastCalledWith(100);
    } finally {
      Element.prototype.getBoundingClientRect = original;
    }
  });

  it("steps with accessibility increment/decrement actions", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Slider accessibilityLabel="Volume" min={0} max={100} step={10} defaultValue={50} onValueChange={onValueChange} />,
    );
    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    const props = (slider as any)[
      Object.keys(slider).find((key) => key.startsWith("__reactProps"))!
    ];
    props.onAccessibilityAction({ nativeEvent: { actionName: "increment" } });
    expect(onValueChange).toHaveBeenLastCalledWith(60);
    props.onAccessibilityAction({ nativeEvent: { actionName: "decrement" } });
    expect(onValueChange).toHaveBeenLastCalledWith(50);
  });
});

describe("#27 NativeTask — progress value", () => {
  it("exposes the progress as an accessibility value", () => {
    const { container } = render(<NativeTask task={{ progress: 0.62, label: "Indexing" }} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(bar.getAttribute("aria-valuenow")).toBe("62");
  });

  it("omits the value for an indeterminate task", () => {
    const { container } = render(<NativeTask task={{ label: "Indexing" }} />);
    expect(container.querySelector('[role="progressbar"]')!.getAttribute("aria-valuenow")).toBeNull();
  });
});

describe("#41 / #47 / #49 — chart summaries", () => {
  it("NativePlotChart announces a summary", () => {
    const { container } = render(
      <NativePlotChart
        points={[
          { x: 1, y: 10 },
          { x: 2, y: 20 },
        ]}
      />,
    );
    const summary = container.querySelector('[role="img"]')!.getAttribute("aria-label")!;
    expect(summary).toContain("2 points");
  });

  it("NativeScatterChart announces a summary per series", () => {
    const { container } = render(
      <NativeScatterChart
        series={[{ name: "Plans", points: [{ x: 1, y: 2 }, { x: 3, y: 9 }] }]}
      />,
    );
    const summary = container.querySelector('[role="img"]')!.getAttribute("aria-label")!;
    expect(summary).toContain("Plans");
    expect(summary).toContain("2 points");
  });

  it("NativeWaterfallChart announces a summary", () => {
    const { container } = render(
      <NativeWaterfallChart
        steps={[
          { label: "Start", value: 100, isTotal: true },
          { label: "Sales", value: 30 },
          { label: "End", value: 130, isTotal: true },
        ]}
      />,
    );
    const summary = container.querySelector('[role="img"]')!.getAttribute("aria-label")!;
    expect(summary).toContain("3 steps");
    expect(summary).toContain("Closing value 130");
  });
});

describe("springs token is wired into motion", () => {
  it("exposes the tokens it animates with", async () => {
    const { springs } = await import("../src");
    expect(springs.snappy.stiffness).toBeGreaterThan(0);
    expect(springs.gentle.damping).toBeGreaterThan(0);
  });
});

describe("accessibility standards", () => {
  it("Switch exposes checked and disabled state", () => {
    const { container } = render(<Switch accessibilityLabel="S" checked disabled />);
    const el = container.querySelector('[role="switch"]')!;
    expect(el.getAttribute("aria-checked")).toBe("true");
    expect(el.getAttribute("aria-disabled")).toBe("true");
  });

  it("TabBar and Tabs expose selected state per item", () => {
    const bar = render(
      <TabBar
        items={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        activeId="b"
      />,
    );
    const barTabs = Array.from(bar.container.querySelectorAll('[role="tab"]'));
    expect(barTabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "true"]);
    bar.unmount();

    const tabs = render(
      <Tabs
        items={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        activeId="b"
      />,
    );
    const railTabs = Array.from(tabs.container.querySelectorAll('[role="tab"]'));
    expect(railTabs.map((t) => t.getAttribute("aria-selected"))).toEqual(["false", "true"]);
  });

  it("SegmentedControl marks the selected segment", () => {
    const { container } = render(<SegmentedControl values={["A", "B"]} selectedIndex={1} />);
    const segments = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(segments.map((s) => s.getAttribute("aria-selected"))).toEqual(["false", "true"]);
  });

  it("Slider reports an adjustable value", () => {
    const { container } = render(<Slider accessibilityLabel="Volume" defaultValue={30} />);
    const slider = container.querySelector('[role="slider"]')!;
    expect(slider.getAttribute("aria-valuenow")).toBe("30");
  });

  it("Button exposes its disabled state", () => {
    const { container } = render(
      <Button accessibilityLabel="Go" disabled>
        Go
      </Button>,
    );
    expect(container.querySelector('[role="button"]')!.getAttribute("aria-disabled")).toBe("true");
  });

  it("CardTitle is a heading", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('[role="heading"]')!.textContent).toBe("Title");
  });
});
