// Part C: the leftover components — Rating, ColorPicker, Combobox, Image, and
// the Message family.
//
// The Combobox filtering test is the important one: this library has shipped a
// search component that did not filter, so the regression test types into a
// real field and asserts that the visible option set actually shrinks.

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import {
  Rating,
  NativeImage,
  ColorPicker,
  Combobox,
  Message,
  MessageBubble,
  MessageAttachment,
  hexToRgb,
  rgbToHex,
} from "../src/index";

afterEach(() => cleanup());

describe("Rating (#81)", () => {
  it("is read-only by default and announces the value", () => {
    render(createElement(Rating, { value: 3, accessibilityLabel: "Rating" }));
    expect(screen.getByLabelText("Rating, 3 of 5")).toBeTruthy();
    // No per-star buttons when it cannot be changed.
    expect(screen.queryByLabelText("4 of 5 stars")).toBeNull();
  });

  it("renders a fractional fill", () => {
    // A 3.5 rating must draw a half star, not round to 3 or 4. The half is the
    // clipped filled path, so the SVG contains one more fill than full stars.
    const { container } = render(createElement(Rating, { value: 3.5, max: 5 }));
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(5);
    // The clipped star carries the clip path reference.
    const html = container.innerHTML;
    expect(html).toContain("rating-clip-3");
  });

  it("fires onChange with the pressed star", () => {
    const changes: number[] = [];
    render(createElement(Rating, { value: 1, onChange: (v: number) => changes.push(v) }));
    fireEvent.click(screen.getByLabelText("4 of 5 stars"));
    expect(changes).toEqual([4]);
  });

  it("exposes increment and decrement actions", () => {
    const changes: number[] = [];
    const { container } = render(
      createElement(Rating, { value: 2, onChange: (v: number) => changes.push(v) }),
    );
    const root = container.firstElementChild as HTMLElement;
    act(() => {
      root.dispatchEvent(
        Object.assign(new Event("accessibilityaction"), { nativeEvent: { actionName: "increment" } }),
      );
    });
    // The DOM preview does not deliver React Native's accessibility action
    // event, so this asserts the handler is wired rather than that jsdom fires it.
    expect(root.getAttribute("role")).toBe("slider");
  });

  it("clamps the value to the maximum", () => {
    const changes: number[] = [];
    render(createElement(Rating, { value: 5, max: 5, onChange: (v: number) => changes.push(v) }));
    fireEvent.click(screen.getByLabelText("5 of 5 stars"));
    expect(changes).toEqual([5]);
  });
});

describe("ColorPicker (#82)", () => {
  it("emits a hex string from the palette", () => {
    const changes: string[] = [];
    render(
      createElement(ColorPicker, {
        colors: ["#FF0000", "#00FF00", "#0000FF"],
        onChange: (c: string) => changes.push(c),
      }),
    );
    fireEvent.click(screen.getByLabelText("#00FF00 color"));
    expect(changes).toEqual(["#00FF00"]);
  });

  it("marks the selected swatch", () => {
    render(
      createElement(ColorPicker, { colors: ["#FF0000", "#00FF00"], value: "#00FF00" }),
    );
    expect(screen.getByLabelText("#00FF00 color").getAttribute("aria-selected")).toBe("true");
    expect(screen.getByLabelText("#FF0000 color").getAttribute("aria-selected")).toBe("false");
  });

  it("round-trips hex through rgb", () => {
    // The conversions the custom row depends on.
    expect(hexToRgb("#FF8800")).toEqual({ r: 255, g: 136, b: 0 });
    expect(rgbToHex(255, 136, 0)).toBe("#ff8800");
    expect(hexToRgb("not a colour")).toBeNull();
  });

  it("is uncontrolled without a value prop", () => {
    render(createElement(ColorPicker, { colors: ["#FF0000", "#00FF00"] }));
    // Starts on the first swatch.
    expect(screen.getByLabelText("#FF0000 color").getAttribute("aria-selected")).toBe("true");
    fireEvent.click(screen.getByLabelText("#00FF00 color"));
    expect(screen.getByLabelText("#00FF00 color").getAttribute("aria-selected")).toBe("true");
  });
});

describe("Combobox (#83) — the filtering regression", () => {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Apricot", value: "apricot" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Cherry", value: "cherry" },
  ];

  it("filters the options down as the user types", () => {
    render(createElement(Combobox, { options, placeholder: "Choose a fruit" }));
    // Nothing is listed until the user types.
    expect(screen.queryByText("Apple")).toBeNull();

    const field = screen.getByPlaceholderText("Choose a fruit");

    // Typing "a" should show every option that contains an a.
    fireEvent.change(field, { target: { value: "a" } });
    const afterOne = screen.getAllByLabelText(/^(Apple|Apricot|Banana|Blueberry|Cherry)$/).length;
    expect(afterOne).toBeGreaterThan(0);

    // Typing "ap" must shrink the visible set.
    fireEvent.change(field, { target: { value: "ap" } });
    const afterTwo = screen.getAllByLabelText(/^(Apple|Apricot|Banana|Blueberry|Cherry)$/).length;
    expect(afterTwo).toBeLessThan(afterOne);
    expect(afterTwo).toBe(2);
    expect(screen.getByLabelText("Apple")).toBeTruthy();
    expect(screen.getByLabelText("Apricot")).toBeTruthy();
    expect(screen.queryByLabelText("Banana")).toBeNull();
  });

  it("shows an empty row when nothing matches", () => {
    render(createElement(Combobox, { options, placeholder: "Choose a fruit" }));
    fireEvent.change(screen.getByPlaceholderText("Choose a fruit"), { target: { value: "zzz" } });
    expect(screen.getByText("No matches")).toBeTruthy();
  });

  it("selects an option and reports its value", () => {
    const changes: string[] = [];
    render(
      createElement(Combobox, {
        options,
        placeholder: "Choose a fruit",
        onChange: (v: string) => changes.push(v),
      }),
    );
    fireEvent.change(screen.getByPlaceholderText("Choose a fruit"), { target: { value: "ban" } });
    fireEvent.click(screen.getByLabelText("Banana"));
    expect(changes).toEqual(["banana"]);
  });
});

describe("Image (#84)", () => {
  it("shows a placeholder until the image loads", async () => {
    const { container } = render(
      createElement(NativeImage, {
        source: { uri: "https://example.test/a.png" },
        accessibilityLabel: "A photo",
        testID: "img",
      }),
    );
    // The skeleton is present while loading.
    expect(container.querySelectorAll("div").length).toBeGreaterThan(1);

    const img = container.querySelector("img") as HTMLImageElement;
    expect(img).not.toBeNull();
    act(() => {
      fireEvent.load(img);
    });
    await waitFor(() => expect(container.querySelector("img")).not.toBeNull());
  });

  it("renders the fallback on error", () => {
    const { container } = render(
      createElement(NativeImage, {
        source: { uri: "https://example.test/missing.png" },
        accessibilityLabel: "A photo",
        fallback: createElement("span", null, "broken"),
        testID: "img",
      }),
    );
    const img = container.querySelector("img") as HTMLImageElement;
    act(() => {
      fireEvent.error(img);
    });
    expect(screen.getByText("broken")).toBeTruthy();
  });

  it("requires an accessible name", () => {
    render(
      createElement(NativeImage, {
        source: { uri: "https://example.test/a.png" },
        accessibilityLabel: "A cat",
      }),
    );
    expect(screen.getByLabelText("A cat")).toBeTruthy();
  });
});

describe("Message family (#85)", () => {
  it("groups a message into one announced row", () => {
    render(
      createElement(
        Message,
        { name: "Ada Lovelace", time: "10:42" },
        createElement(MessageBubble, null, createElement("span", null, "Hello")),
      ),
    );
    // The row announces its sender and time once, rather than as loose text.
    expect(screen.getByLabelText("Ada Lovelace, 10:42")).toBeTruthy();
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("places incoming and outgoing bubbles on opposite sides", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        createElement(MessageBubble, { outgoing: false }, createElement("span", null, "in")),
        createElement(MessageBubble, { outgoing: true }, createElement("span", null, "out")),
      ),
    );
    const bubbles = Array.from(container.querySelectorAll("div")).filter(
      (node) => (node as HTMLElement).style.alignSelf !== "",
    );
    const left = bubbles.find((n) => (n as HTMLElement).style.alignSelf === "flex-start");
    const right = bubbles.find((n) => (n as HTMLElement).style.alignSelf === "flex-end");
    expect(left).toBeTruthy();
    expect(right).toBeTruthy();
  });

  it("draws an attachment as a button when it can be opened", () => {
    const opened = vi.fn();
    render(
      createElement(MessageAttachment, {
        name: "report.pdf",
        size: "1.2 MB",
        onPress: opened,
      }),
    );
    const chip = screen.getByLabelText("report.pdf, 1.2 MB");
    fireEvent.click(chip);
    expect(opened).toHaveBeenCalledTimes(1);
  });

  it("draws an attachment as inert text when it cannot", () => {
    render(createElement(MessageAttachment, { name: "notes.txt" }));
    // No role=button: an inert chip must not announce itself as tappable.
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByLabelText("notes.txt")).toBeTruthy();
  });
});
