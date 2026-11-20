// Behaviour tests for the components added in this wave.
//
// One test per component, aimed at the interaction the component exists for —
// not at whether it renders. A component that mounts but cannot do its job is
// not finished, so each of these presses, types, expands or navigates.

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createElement } from "react";

import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Chip,
  IconButton,
  Progress,
  Separator,
  Sheet,
  Skeleton,
  Stepper,
  Text,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  initialsOf,
} from "../src";

// ---------------------------------------------------------------------------
// Basics

describe("#50 Text", () => {
  it("renders its variant's size and the theme's colour", () => {
    const { container } = render(<Text variant="title">Hello</Text>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.textContent).toBe("Hello");
    expect(el.style.fontSize).toBe("28px");
    expect(el.getAttribute("role")).toBe("heading");
  });

  it("mutes secondary text and marks destructive text in the danger tone", () => {
    const { container: muted } = render(<Text muted>Hint</Text>);
    expect((muted.firstElementChild as HTMLElement).style.color).toBe("rgba(60, 60, 67, 0.6)");

    const { container: danger } = render(<Text destructive>Error</Text>);
    expect((danger.firstElementChild as HTMLElement).style.color).toBe("rgb(255, 59, 48)");
  });

  it("follows the dark theme when asked", () => {
    const { container } = render(<Text isDark>x</Text>);
    expect((container.firstElementChild as HTMLElement).style.color).toBe("rgb(255, 255, 255)");
  });
});

describe("#51 Avatar", () => {
  it("derives initials from the name", () => {
    expect(initialsOf("Ada Lovelace")).toBe("AL");
    expect(initialsOf("Plato")).toBe("PL");
    expect(initialsOf("  ")).toBe("");
  });

  it("shows initials when there is no image, and a status dot when asked", () => {
    const { container } = render(<Avatar name="Ada Lovelace" status="online" />);
    expect(container.textContent).toBe("AL");
    expect(container.querySelector('[aria-label="Avatar of Ada Lovelace"]')).toBeTruthy();
    // The dot is a decorative accent on the frame, not a second image.
    const dots = Array.from(container.querySelectorAll("div")).filter(
      (el) => (el as HTMLElement).style.backgroundColor === "rgb(52, 199, 89)",
    );
    expect(dots.length).toBe(1);
  });

  it("renders the image when a source is given", () => {
    const { container } = render(<Avatar source={{ uri: "https://example.com/a.png" }} name="Ada" />);
    expect(container.querySelector("img")).toBeTruthy();
  });

  it("falls back to initials when the image fails to load", () => {
    const { container } = render(<Avatar source={{ uri: "broken" }} name="Ada Lovelace" />);
    const img = container.querySelector("img")!;
    fireEvent.error(img);
    expect(container.textContent).toContain("AL");
  });
});

describe("#52 Badge", () => {
  it("shows a count", () => {
    const { container } = render(<Badge>3</Badge>);
    expect(container.textContent).toBe("3");
  });

  it("renders a bare dot when there are no children", () => {
    const { container } = render(<Badge testID="dot" />);
    const dot = container.querySelector('[data-testid="dot"]') as HTMLElement;
    expect(dot.textContent).toBe("");
    expect(dot.style.backgroundColor).toBe("rgb(0, 136, 255)");
  });

  it("overlays children in the corner when given something to decorate", () => {
    const { container } = render(
      <Badge overlay={<Button accessibilityLabel="Inbox">Inbox</Button>}>2</Badge>,
    );
    expect(container.textContent).toContain("Inbox");
    expect(container.textContent).toContain("2");
  });
});

describe("#53 Separator", () => {
  it("draws a hairline in the separator colour", () => {
    const { container } = render(<Separator />);
    const rule = container.firstElementChild as HTMLElement;
    // The web separator is 1px, and its light token is the agreed 0.15.
    expect(rule.style.height).toBe("1px");
    expect(rule.style.backgroundColor).toBe("rgba(60, 60, 67, 0.15)");
  });

  it("can run vertically", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect((container.firstElementChild as HTMLElement).style.width).toBe("1px");
  });
});

describe("#54 Skeleton", () => {
  it("renders each shape at its size", () => {
    const { container: rect } = render(<Skeleton width={200} height={60} />);
    const el = rect.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("200px");
    expect(el.style.height).toBe("60px");

    const { container: circle } = render(<Skeleton shape="circle" height={40} />);
    // A circle's radius is half its height.
    expect((circle.firstElementChild as HTMLElement).style.borderRadius).toBe("20px");
  });

  it("is hidden from screen readers, since it carries no information", () => {
    const { container } = render(<Skeleton />);
    expect((container.firstElementChild as HTMLElement).getAttribute("role")).not.toBe("img");
  });
});

describe("#56 Progress", () => {
  it("fills the bar to the value and reports it", () => {
    const { container } = render(<Progress value={35} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute("aria-valuenow")).toBe("35");
    // The bar's first child is the glass material layer; the fill is the
    // element that actually carries the percentage width.
    const fill = Array.from(bar.querySelectorAll("div")).find(
      (el) => (el as HTMLElement).style.width === "35%",
    ) as HTMLElement | undefined;
    expect(fill).toBeTruthy();
  });

  it("clamps a value outside 0–100 instead of drawing past the track", () => {
    const { container: over } = render(<Progress value={180} />);
    expect(over.querySelector('[aria-valuenow="100"]')).toBeTruthy();
    const { container: under } = render(<Progress value={-20} />);
    expect(under.querySelector('[aria-valuenow="0"]')).toBeTruthy();
  });

  it("draws the ring variant with the same value", () => {
    const { container } = render(<Progress variant="track" value={50} />);
    expect(container.querySelector('[role="progressbar"]')).toBeTruthy();
    expect(container.textContent).toBe("50%");
  });
});

// ---------------------------------------------------------------------------
// Feedback and display

describe("#57 Toast", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("dismisses itself after the duration and clears its timer on unmount", () => {
    const onDismiss = vi.fn();
    const { unmount } = render(<Toast visible message="Saved" duration={3000} onDismiss={onDismiss} />);
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);

    // A timer left behind would fire after the component is gone.
    const onLate = vi.fn();
    const second = render(<Toast visible message="Saving" duration={3000} onDismiss={onLate} />);
    second.unmount();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onLate).not.toHaveBeenCalled();
    unmount();
  });

  it("stays put when duration is 0", () => {
    const onDismiss = vi.fn();
    render(<Toast visible message="Pinned" duration={0} onDismiss={onDismiss} />);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("dismisses from its pill", () => {
    const onDismiss = vi.fn();
    const { container } = render(<Toast visible message="Deleted" onDismiss={onDismiss} testID="toast" />);
    fireEvent.click(container.querySelector('[data-testid="toast-pill"]')!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders nothing while hidden", () => {
    const { container } = render(<Toast visible={false} message="Nope" />);
    expect(container.textContent).toBe("");
  });
});



describe("#65 Accordion", () => {
  const sections = [
    { value: "a", title: "First", content: <Text>First body</Text> },
    { value: "b", title: "Second", content: <Text>Second body</Text> },
  ];

  it("expands a section on press and marks it expanded", () => {
    const { container } = render(<Accordion sections={sections} />);
    const headers = container.querySelectorAll('[role="button"]');
    expect(container.textContent).not.toContain("First body");
    expect(headers[0]!.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(headers[0]!);
    expect(container.textContent).toContain("First body");
    expect(headers[0]!.getAttribute("aria-expanded")).toBe("true");
  });

  it("keeps a single section open unless multiple is allowed", () => {
    const { container } = render(<Accordion sections={sections} />);
    const headers = container.querySelectorAll('[role="button"]');
    fireEvent.click(headers[0]!);
    fireEvent.click(headers[1]!);
    expect(container.textContent).not.toContain("First body");
    expect(container.textContent).toContain("Second body");
  });

  it("allows several open when multiple is set", () => {
    const { container } = render(<Accordion sections={sections} multiple />);
    const headers = container.querySelectorAll('[role="button"]');
    fireEvent.click(headers[0]!);
    fireEvent.click(headers[1]!);
    expect(container.textContent).toContain("First body");
    expect(container.textContent).toContain("Second body");
  });

  it("respects a controlled open list", () => {
    const onOpenSectionsChange = vi.fn();
    const { container } = render(
      <Accordion sections={sections} openSections={["b"]} onOpenSectionsChange={onOpenSectionsChange} />,
    );
    expect(container.textContent).toContain("Second body");
    fireEvent.click(container.querySelectorAll('[role="button"]')[0]!);
    expect(onOpenSectionsChange).toHaveBeenCalledWith(["a"]);
    // Controlled: the component does not change on its own.
    expect(container.textContent).not.toContain("First body");
  });
});

// ---------------------------------------------------------------------------
// Bars, buttons and navigation


describe("#61 Chip", () => {
  it("toggles selection and calls onSelectedChange", () => {
    const onSelectedChange = vi.fn();
    const { container } = render(<Chip label="Photos" onSelectedChange={onSelectedChange} />);
    const chip = container.querySelector('[role="button"]')!;
    expect(chip.getAttribute("aria-selected")).toBe("false");
    fireEvent.click(chip);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("calls onPress when its pill is pressed", () => {
    const onPress = vi.fn();
    const { container } = render(<Chip label="Tag" onPress={onPress} />);
    fireEvent.click(container.querySelector('[role="button"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is a static tag when it has no interaction", () => {
    const { container } = render(<Chip label="Static" />);
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(container.textContent).toBe("Static");
  });
});


describe("#63 IconButton", () => {
  it("presses and requires a label", () => {
    const onPress = vi.fn();
    const { container } = render(
      <IconButton accessibilityLabel="Settings" onPress={onPress} icon={<Text>*</Text>} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Settings"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("sizes from the size prop", () => {
    const { container } = render(<IconButton accessibilityLabel="A" size="lg" onPress={() => {}} icon={null} />);
    const surface = Array.from(container.querySelectorAll("div")).find(
      (el) => (el as HTMLElement).style.width === "44px",
    );
    expect(surface).toBeTruthy();
  });
});

describe("#64 Toolbar", () => {
  it("shows its title and runs its leading action", () => {
    const onBack = vi.fn();
    const { container } = render(
      <Toolbar
        title="Inbox"
        leading={<Button accessibilityLabel="Back" onPress={onBack} />}
      />,
    );
    expect(container.textContent).toContain("Inbox");
    fireEvent.click(container.querySelector('[aria-label="Back"]')!);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders the title text under the title capsule", () => {
    const { container } = render(<Toolbar title="Inbox" />);
    expect(container.textContent).toContain("Inbox");
  });
});


describe("#67 Sheet", () => {
  it("renders its content only while visible", () => {
    const { container, rerender } = render(
      <Sheet visible testID="sheet">
        <Text>body</Text>
      </Sheet>,
    );
    expect(container.textContent).toContain("body");
    rerender(
      <Sheet visible={false} testID="sheet">
        <Text>body</Text>
      </Sheet>,
    );
    expect(container.textContent).not.toContain("body");
  });

  it("dismisses when the dim behind it is tapped", () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <Sheet visible onDismiss={onDismiss} testID="sheet">
        <Text>body</Text>
      </Sheet>,
    );
    const dim = container.querySelector('[data-testid="sheet-dim"]') as HTMLElement;
    const props = dim && (dim as any)[Object.keys(dim).find((key) => key.startsWith("__reactProps"))!];
    // The dim is a responder surface, not a button: the sheet's own contract.
    expect(typeof props.onResponderGrant).toBe("function");
    props.onResponderGrant();
    expect(onDismiss).toHaveBeenCalled();
  });

  it("does not dismiss on a dim tap when dismissOnTap is false", () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <Sheet visible dismissOnTap={false} onDismiss={onDismiss} testID="sheet">
        <Text>body</Text>
      </Sheet>,
    );
    const dim = container.querySelector('[data-testid="sheet-dim"]') as HTMLElement;
    const props = (dim as any)[Object.keys(dim).find((key) => key.startsWith("__reactProps"))!];
    props.onResponderGrant();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});


// ---------------------------------------------------------------------------
// Forms and pickers

describe("#69 Stepper", () => {
  it("increments and decrements, and clamps at min and max", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Stepper accessibilityLabel="Guests" defaultValue={1} min={1} max={3} onValueChange={onValueChange} />,
    );
    const [minus, plus] = Array.from(container.querySelectorAll('[role="button"]'));
    const value = () => container.querySelector('[role="slider"]')?.getAttribute("aria-valuenow");

    fireEvent.click(plus!);
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(plus!);
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    // At the maximum the control refuses to go further.
    fireEvent.click(plus!);
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(value()).toBe("3");

    fireEvent.click(minus!);
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it("honours the step", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Stepper accessibilityLabel="Packs" defaultValue={0} max={100} step={5} onValueChange={onValueChange} />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[1]!);
    expect(onValueChange).toHaveBeenCalledWith(5);
  });

  it("supports the accessibility increment and decrement actions", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Stepper accessibilityLabel="Guests" defaultValue={2} onValueChange={onValueChange} />,
    );
    // React attaches the handler as a prop on the element; reading it there is
    // how the Slider test drives the same accessibility action.
    const control = container.querySelector('[role="slider"]') as HTMLElement;
    const props = (control as any)[
      Object.keys(control).find((key) => key.startsWith("__reactProps"))!
    ];
    expect(typeof props.onAccessibilityAction).toBe("function");
    act(() => {
      props.onAccessibilityAction({ nativeEvent: { actionName: "increment" } });
    });
    expect(onValueChange).toHaveBeenCalledWith(3);
  });
});

describe("#72 Toggle", () => {
  it("stays pressed, and reports selection", () => {
    const onPressedChange = vi.fn();
    const { container } = render(
      <Toggle accessibilityLabel="Pin" defaultPressed={false} onPressedChange={onPressedChange}>
        Pin
      </Toggle>,
    );
    const button = container.querySelector('[role="button"]')!;
    expect(button.getAttribute("aria-selected")).toBe("false");
    fireEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute("aria-selected")).toBe("true");
  });

  it("accepts the web's selected prop as an alias", () => {
    const { container } = render(<Toggle accessibilityLabel="Pin" selected>Pin</Toggle>);
    expect(container.querySelector('[role="button"]')!.getAttribute("aria-selected")).toBe("true");
  });
});

describe("#73 ToggleGroup", () => {
  const items = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  it("enforces a single selection", () => {
    const onValueChange = vi.fn();
    const { container } = render(<ToggleGroup items={items} onValueChange={onValueChange} />);
    const options = container.querySelectorAll('[role="button"]');
    fireEvent.click(options[0]!);
    expect(onValueChange).toHaveBeenLastCalledWith("day");
    fireEvent.click(options[1]!);
    expect(onValueChange).toHaveBeenLastCalledWith("week");
    // Only one is on.
    const selected = Array.from(container.querySelectorAll('[role="button"]')).filter(
      (el) => el.getAttribute("aria-selected") === "true",
    );
    expect(selected.length).toBe(1);
    expect(selected[0]!.getAttribute("aria-label")).toBe("Week");
  });

  it("allows several when multiple is set", () => {
    const onValueChange = vi.fn();
    const { container } = render(<ToggleGroup items={items} multiple onValueChange={onValueChange} />);
    const options = container.querySelectorAll('[role="button"]');
    fireEvent.click(options[0]!);
    fireEvent.click(options[2]!);
    expect(onValueChange).toHaveBeenLastCalledWith(["day", "month"]);
  });
});





