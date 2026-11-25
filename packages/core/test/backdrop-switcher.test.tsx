import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { BackdropSwitcher, defaultBackdropItems } from "../src/backdrop-switcher";

test("offers the three backdrops, one checked, chosen by click", () => {
  const onValueChange = vi.fn();
  render(
    <BackdropSwitcher
      aria-label="Backdrop"
      defaultValue="dark"
      onValueChange={onValueChange}
    />,
  );
  expect(screen.getByRole("radiogroup", { name: "Backdrop" })).toBeTruthy();
  expect(screen.getAllByRole("radio").map((radio) => radio.textContent)).toEqual([
    "Dark",
    "Light",
    "Image",
  ]);
  expect(
    screen.getAllByRole("radio").map((radio) => radio.getAttribute("aria-checked")),
  ).toEqual(["true", "false", "false"]);

  fireEvent.click(screen.getByRole("radio", { name: "Image" }));
  expect(onValueChange).toHaveBeenLastCalledWith("image");
  expect(screen.getByRole("radio", { name: "Image" }).getAttribute("aria-checked")).toBe(
    "true",
  );
});

test("defaults to the three backdrop items", () => {
  expect(defaultBackdropItems.map((item) => item.value)).toEqual([
    "dark",
    "light",
    "image",
  ]);
});

test("accepts an items override", () => {
  render(
    <BackdropSwitcher
      aria-label="Backdrop"
      items={[
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ]}
      defaultValue="light"
    />,
  );
  expect(screen.getAllByRole("radio")).toHaveLength(2);
  expect(screen.queryByRole("radio", { name: "Image" })).toBeNull();
});

test("custom items widen onValueChange to their value type", () => {
  // If the generic did not widen, this mock's parameter type would not
  // satisfy onValueChange and tsc would fail the test file.
  const onValueChange = vi.fn<(value: "sepia" | "mono") => void>();
  render(
    <BackdropSwitcher
      aria-label="Backdrop"
      items={[
        { value: "sepia", label: "Sepia" },
        { value: "mono", label: "Mono" },
      ]}
      defaultValue="mono"
      onValueChange={onValueChange}
    />,
  );
  fireEvent.click(screen.getByRole("radio", { name: "Sepia" }));
  expect(onValueChange).toHaveBeenCalledWith("sepia");
});
