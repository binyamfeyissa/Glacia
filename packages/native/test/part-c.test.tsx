// Part C: the donor-source components that survive this rebuild —
// ColorPicker and Combobox. Rating, Image, the Message family and the table
// were old-package components and are out of scope (master prompt §2.3).

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { ColorPicker, Combobox, hexToRgb, rgbToHex } from "../src";

afterEach(cleanup);

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
