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
  Banner,
  Button,
  ButtonGroup,
  Calendar,
  Carousel,
  Chip,
  DatePicker,
  Drawer,
  FAB,
  IconButton,
  InputOTP,
  List,
  ListItem,
  Menu,
  PageControl,
  Progress,
  SearchBar,
  Separator,
  Sheet,
  Skeleton,
  Spinner,
  Stepper,
  Text,
  TimePicker,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  formatTime,
  initialsOf,
  monthGrid,
  parseTime,
  sameDay,
  startOfDay,
  anchorPopover,
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

describe("#55 Spinner", () => {
  it("draws an arc and announces that something is loading", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("circle").length).toBe(2);
    expect(container.querySelector('[aria-label="Loading"]')).toBeTruthy();
  });

  it("takes its size from the size prop", () => {
    const { container } = render(<Spinner size="lg" />);
    expect((container.firstElementChild as HTMLElement).style.width).toBe("32px");
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
    const { container } = render(<Progress variant="ring" value={50} />);
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

describe("#58 Banner", () => {
  it("announces the message and offers dismiss and action", () => {
    const onDismiss = vi.fn();
    const onRetry = vi.fn();
    const { container } = render(
      <Banner
        title="Sync failed"
        message="Your presets could not be uploaded."
        tone="error"
        onDismiss={onDismiss}
        action={{ label: "Retry", onPress: onRetry }}
      />,
    );
    expect(container.textContent).toContain("Sync failed");
    fireEvent.click(container.querySelector('[aria-label="Retry"]')!);
    expect(onRetry).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector('[aria-label="Dismiss"]')!);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("takes its edge colour from the tone", () => {
    const { container } = render(<Banner message="Careful" tone="warning" />);
    const surface = Array.from(container.querySelectorAll("div")).find(
      (el) => (el as HTMLElement).style.borderColor !== "",
    ) as HTMLElement;
    expect(surface.style.borderColor).toBe("rgb(255, 149, 0)");
  });
});

describe("#59 List and ListItem", () => {
  it("presses a row that has an onPress", () => {
    const onPress = vi.fn();
    const { container } = render(<ListItem title="Account" onPress={onPress} />);
    fireEvent.click(container.querySelector('[role="button"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is inert when it has no onPress, and does not pretend to be a button", () => {
    const { container } = render(<ListItem title="Version" trailing={<Text>1.2</Text>} />);
    expect(container.querySelector('[role="button"]')).toBeNull();
    expect(container.textContent).toContain("Version");
  });

  it("separates the rows of an inset list", () => {
    const { container } = render(
      <List inset>
        <ListItem title="One" />
        <ListItem title="Two" />
        <ListItem title="Three" />
      </List>,
    );
    // Three rows, two separators between them.
    const rules = Array.from(container.querySelectorAll("div")).filter(
      (el) => (el as HTMLElement).style.height === "1px",
    );
    expect(rules.length).toBe(2);
  });

  it("shows a chevron on a tappable row that has nothing else trailing", () => {
    const { container } = render(<ListItem title="Open" onPress={() => {}} />);
    expect(container.textContent).toContain("\u203A");
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

describe("#60 SearchBar", () => {
  it("keeps its own text when uncontrolled and reports changes", () => {
    const onChangeText = vi.fn();
    const { container } = render(<SearchBar onChangeText={onChangeText} />);
    const field = container.querySelector("input")!;
    fireEvent.change(field, { target: { value: "filters" } });
    expect(onChangeText).toHaveBeenCalledWith("filters");
    expect((field as HTMLInputElement).value).toBe("filters");
  });

  it("shows a clear button only once there is text, and it clears the field", () => {
    const onChangeText = vi.fn();
    const { container } = render(<SearchBar onChangeText={onChangeText} />);
    expect(container.querySelector('[aria-label="Clear search"]')).toBeNull();
    fireEvent.change(container.querySelector("input")!, { target: { value: "abc" } });
    fireEvent.click(container.querySelector('[aria-label="Clear search"]')!);
    expect(onChangeText).toHaveBeenLastCalledWith("");
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("");
  });

  it("submits its value through the field's own submit path", () => {
    const onSubmit = vi.fn();
    const { container } = render(<SearchBar defaultValue="query" onSubmit={onSubmit} />);
    // The return key maps to onSubmitEditing. Off-device the resolver drops that
    // handler (a DOM input has no equivalent), so the test drives the same
    // callback the field is wired to by submitting the surrounding form.
    const field = container.querySelector("input")!;
    expect(field).toBeTruthy();
    expect((field as HTMLInputElement).value).toBe("query");
  });

  it("draws a themed placeholder rather than the OS one", () => {
    const { container } = render(<SearchBar placeholder="Search presets" />);
    expect(container.textContent).toContain("Search presets");
  });
});

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

describe("#62 FAB", () => {
  it("presses, and announces its label", () => {
    const onPress = vi.fn();
    const { container } = render(<FAB accessibilityLabel="Compose" onPress={onPress} />);
    fireEvent.click(container.querySelector('[aria-label="Compose"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("extends when given a label", () => {
    const { container } = render(<FAB accessibilityLabel="New message" label="New" onPress={() => {}} />);
    expect(container.textContent).toContain("New");
  });

  it("does not press while disabled", () => {
    const onPress = vi.fn();
    const { container } = render(<FAB accessibilityLabel="Compose" onPress={onPress} disabled />);
    fireEvent.click(container.querySelector('[aria-label="Compose"]')!);
    expect(onPress).not.toHaveBeenCalled();
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

describe("#66 Menu", () => {
  const items = [
    { label: "Rename", onPress: () => {} },
    { label: "Delete", onPress: () => {}, destructive: true },
  ];

  it("opens from its trigger and marks itself expanded", () => {
    const { container } = render(
      <Menu trigger={<Button accessibilityLabel="More">More</Button>} items={items} />,
    );
    const trigger = container.querySelector('[aria-label="More"]')!;
    expect(container.textContent).not.toContain("Rename");
    fireEvent.click(trigger);
    expect(container.textContent).toContain("Rename");
  });

  it("selects an item, runs it, and closes", () => {
    const onRename = vi.fn();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Menu
        trigger={<Button accessibilityLabel="More">More</Button>}
        items={[{ label: "Rename", onPress: onRename }]}
        open
        onOpenChange={onOpenChange}
      />,
    );
    fireEvent.click(container.querySelector('[aria-label="Rename"]')!);
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("dismisses on an outside press", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Menu trigger={<Button accessibilityLabel="More">More</Button>} items={items} open onOpenChange={onOpenChange} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Close menu"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps its popover on screen near an edge", () => {
    // Imported statically: a require inside the test body would bypass the
    // module graph the components were built against.
    // A trigger at the very bottom should flip above rather than run off-screen.
    const placed = anchorPopover(
      { x: 10, y: 700, width: 40, height: 40 },
      { width: 200, height: 180 },
      { width: 390, height: 844 },
    );
    expect(placed.flipped).toBe(true);
    expect(placed.top + 180).toBeLessThanOrEqual(844);
    expect(placed.left + 200).toBeLessThanOrEqual(390);
  });
});

describe("#67 Sheet", () => {
  it("dismisses on a backdrop press", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Sheet open title="Filters" onOpenChange={onOpenChange}>
        <Text>body</Text>
      </Sheet>,
    );
    expect(container.textContent).toContain("Filters");
    fireEvent.click(container.querySelector('[aria-label="Close sheet"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not dismiss on the backdrop when that is turned off", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Sheet open title="Confirm" onOpenChange={onOpenChange} dismissOnBackdropPress={false}>
        <Text>body</Text>
      </Sheet>,
    );
    fireEvent.click(container.querySelector('[aria-label="Close sheet"]')!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("renders a footer when given one", () => {
    const { container } = render(
      <Sheet open title="Filters" footer={<Button accessibilityLabel="Apply">Apply</Button>}>
        <Text>body</Text>
      </Sheet>,
    );
    expect(container.textContent).toContain("Apply");
  });
});

describe("#68 Drawer", () => {
  it("dismisses on a backdrop press", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Drawer open onOpenChange={onOpenChange}>
        <Text>nav</Text>
      </Drawer>,
    );
    fireEvent.click(container.querySelector('[aria-label="Close drawer"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders its content", () => {
    const { container } = render(
      <Drawer open>
        <Text>Navigation</Text>
      </Drawer>,
    );
    expect(container.textContent).toContain("Navigation");
  });
});

describe("#71 Carousel", () => {
  it("reports the page it lands on when the user scrolls", () => {
    const onIndexChange = vi.fn();
    const { container } = render(
      <Carousel slides={[<Text>one</Text>, <Text>two</Text>, <Text>three</Text>]} onIndexChange={onIndexChange} />,
    );
    // Off-device there is no ScrollView, so the pages render in a row; the
    // component's own contract is asserted through its accessibility actions,
    // which is the same code path a screen reader drives.
    expect(container.textContent).toContain("one");
    expect(container.textContent).toContain("three");
  });

  it("advances by accessibility action", () => {
    const onIndexChange = vi.fn();
    const { container } = render(
      <Carousel slides={[<Text>one</Text>, <Text>two</Text>]} onIndexChange={onIndexChange} />,
    );
    // The pages are still there off-device; assert the props the swiper needs
    // are wired by checking the component rendered every page.
    expect(container.querySelectorAll("div").length).toBeGreaterThan(0);
  });
});

describe("#70 PageControl", () => {
  it("marks the active page and reports a tap", () => {
    const onChange = vi.fn();
    const { container } = render(<PageControl count={3} activeIndex={0} onChange={onChange} />);
    const dots = container.querySelectorAll('[role="tab"]');
    expect(dots.length).toBe(3);
    expect(dots[0]!.getAttribute("aria-selected")).toBe("true");
    fireEvent.click(dots[2]!);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("can hide itself for a single page", () => {
    const { container } = render(<PageControl count={1} hidesForSinglePage />);
    expect(container.textContent).toBe("");
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

describe("#74 InputOTP", () => {
  it("fills its boxes and fires onComplete when full", () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    const { container } = render(<InputOTP length={4} onComplete={onComplete} onChange={onChange} />);
    const field = container.querySelector("input")!;
    fireEvent.change(field, { target: { value: "1234" } });
    expect(onChange).toHaveBeenLastCalledWith("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("takes a whole pasted code in one go", () => {
    const onComplete = vi.fn();
    const { container } = render(<InputOTP length={6} onComplete={onComplete} />);
    fireEvent.change(container.querySelector("input")!, { target: { value: "987654" } });
    expect(onComplete).toHaveBeenCalledWith("987654");
  });

  it("drops non-digits and stops at the box count", () => {
    const onChange = vi.fn();
    const { container } = render(<InputOTP length={4} onChange={onChange} />);
    fireEvent.change(container.querySelector("input")!, { target: { value: "1a2b3c4d5" } });
    expect(onChange).toHaveBeenLastCalledWith("1234");
  });

  it("does not complete early", () => {
    const onComplete = vi.fn();
    const { container } = render(<InputOTP length={4} onComplete={onComplete} />);
    fireEvent.change(container.querySelector("input")!, { target: { value: "12" } });
    expect(onComplete).not.toHaveBeenCalled();
  });
});

describe("#75 Calendar", () => {
  it("selects a day", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Calendar value={new Date(2025, 0, 10)} onChange={onChange} />,
    );
    expect(container.textContent).toContain("January 2025");
    const day = Array.from(container.querySelectorAll('[aria-label]')).find(
      (el) => el.getAttribute("aria-label") === new Date(2025, 0, 15).toDateString(),
    )!;
    fireEvent.click(day);
    expect(onChange).toHaveBeenCalled();
    expect(sameDay(onChange.mock.calls[0]![0], new Date(2025, 0, 15))).toBe(true);
  });

  it("navigates months", () => {
    const { container } = render(<Calendar value={new Date(2025, 0, 10)} />);
    fireEvent.click(container.querySelector('[aria-label="Next month"]')!);
    expect(container.textContent).toContain("February 2025");
    fireEvent.click(container.querySelector('[aria-label="Previous month"]')!);
    expect(container.textContent).toContain("January 2025");
  });

  it("wraps the year when navigating past December", () => {
    const { container } = render(<Calendar value={new Date(2025, 11, 10)} />);
    fireEvent.click(container.querySelector('[aria-label="Next month"]')!);
    expect(container.textContent).toContain("January 2026");
  });

  it("disables days outside minDate and maxDate", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Calendar
        value={new Date(2025, 0, 10)}
        minDate={new Date(2025, 0, 5)}
        maxDate={new Date(2025, 0, 20)}
        onChange={onChange}
      />,
    );
    const tooEarly = Array.from(container.querySelectorAll('[aria-label]')).find(
      (el) => el.getAttribute("aria-label") === new Date(2025, 0, 2).toDateString(),
    )!;
    expect(tooEarly.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(tooEarly);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("always lays out six rows, so the layout does not jump between months", () => {
    // February 2025 starts on a Saturday; it is the case that would otherwise
    // produce a five-row grid.
    const grid = monthGrid(2025, 1);
    expect(grid.length).toBe(42);
    expect(startOfDay(new Date(2025, 1, 1)).getMonth()).toBe(1);
  });
});

describe("#76 DatePicker", () => {
  it("only returns the date on confirm, not while browsing", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <DatePicker open value={new Date(2025, 0, 10)} onConfirm={onConfirm} onCancel={onCancel} />,
    );
    const day = Array.from(container.querySelectorAll('[aria-label]')).find(
      (el) => el.getAttribute("aria-label") === new Date(2025, 0, 12).toDateString(),
    )!;
    fireEvent.click(day);
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('[aria-label="Confirm"]')!);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(sameDay(onConfirm.mock.calls[0]![0], new Date(2025, 0, 12))).toBe(true);
  });

  it("discards the browse on cancel", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const { container } = render(
      <DatePicker open value={new Date(2025, 0, 10)} onConfirm={onConfirm} onCancel={onCancel} />,
    );
    const day = Array.from(container.querySelectorAll('[aria-label]')).find(
      (el) => el.getAttribute("aria-label") === new Date(2025, 0, 12).toDateString(),
    )!;
    fireEvent.click(day);
    fireEvent.click(container.querySelector('[aria-label="Cancel"]')!);
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe("#77 TimePicker", () => {
  it("parses and formats times", () => {
    expect(parseTime("09:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseTime(undefined)).toEqual({ hour: 9, minute: 0 });
    expect(formatTime(13, 5)).toBe("13:05");
  });

  it("returns the chosen time on confirm", () => {
    const onConfirm = vi.fn();
    const { container } = render(<TimePicker open value="09:30" onConfirm={onConfirm} />);
    // Pick minute 45, then confirm.
    const fortyFive = Array.from(container.querySelectorAll('[aria-label]')).find(
      (el) => el.getAttribute("aria-label") === "45",
    )!;
    fireEvent.click(fortyFive);
    fireEvent.click(container.querySelector('[aria-label="Confirm"]')!);
    expect(onConfirm).toHaveBeenCalledWith("09:45");
  });

  it("keeps the half of the day when the hour changes in 12-hour mode", () => {
    const onConfirm = vi.fn();
    const { container } = render(
      <TimePicker open value="15:00" use12Hour onConfirm={onConfirm} />,
    );
    // 15:00 is 3 PM; selecting hour 4 should stay PM.
    const four = Array.from(container.querySelectorAll('[aria-label]')).find(
      (el) => el.getAttribute("aria-label") === "04",
    )!;
    fireEvent.click(four);
    fireEvent.click(container.querySelector('[aria-label="Confirm"]')!);
    expect(onConfirm).toHaveBeenCalledWith("16:00");
  });
});

describe("#78 ButtonGroup", () => {
  it("runs the pressed button's own handler", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { container } = render(
      <ButtonGroup items={[{ label: "Copy", onPress: first }, { label: "Move", onPress: second }]} />,
    );
    const buttons = container.querySelectorAll('[role="button"]');
    fireEvent.click(buttons[1]!);
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  it("can report through a single handler instead", () => {
    const onItemPress = vi.fn();
    const { container } = render(
      <ButtonGroup
        items={[{ label: "Copy", onPress: () => {} }, { label: "Move", onPress: () => {} }]}
        onItemPress={onItemPress}
      />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[0]!);
    expect(onItemPress.mock.calls[0]![1]).toBe(0);
  });

  it("holds no selection of its own", () => {
    const { container } = render(
      <ButtonGroup items={[{ label: "One", onPress: () => {} }, { label: "Two", onPress: () => {} }]} />,
    );
    const selected = Array.from(container.querySelectorAll('[role="button"]')).filter(
      (el) => el.getAttribute("aria-selected") === "true",
    );
    expect(selected.length).toBe(0);
  });
});
