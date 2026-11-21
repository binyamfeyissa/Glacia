import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../src";

function Palette() {
  return (
    <Command>
      <CommandInput placeholder="Search settings…" />
      <CommandList>
        <CommandEmpty>No settings match.</CommandEmpty>
        <CommandGroup heading="Quick Jump">
          <CommandItem>
            <span>Wi-Fi Network</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <span>Displays &amp; True Tone</span>
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="System">
          <CommandItem>
            <span>Sound Output</span>
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function search(text: string) {
  fireEvent.change(screen.getByPlaceholderText("Search settings…"), {
    target: { value: text },
  });
}

test("shows every item and no empty state before searching", () => {
  render(<Palette />);
  expect(screen.getByText("Wi-Fi Network")).toBeTruthy();
  expect(screen.getByText("Displays & True Tone")).toBeTruthy();
  expect(screen.getByText("Sound Output")).toBeTruthy();
  expect(screen.queryByText("No settings match.")).toBeNull();
});

test("filters items by their text as the user types", () => {
  render(<Palette />);
  search("sound");
  expect(screen.queryByText("Wi-Fi Network")).toBeNull();
  expect(screen.queryByText("Displays & True Tone")).toBeNull();
  expect(screen.getByText("Sound Output")).toBeTruthy();
  expect(screen.queryByText("No settings match.")).toBeNull();
});

test("matches case-insensitively and against partial words", () => {
  render(<Palette />);
  search("WI-F");
  expect(screen.getByText("Wi-Fi Network")).toBeTruthy();
  expect(screen.queryByText("Sound Output")).toBeNull();
});

test("shows the empty state and hides empty groups when nothing matches", () => {
  render(<Palette />);
  search("zzzz");
  expect(screen.getByText("No settings match.")).toBeTruthy();
  expect(screen.queryByText("Wi-Fi Network")).toBeNull();
  const quickJump = screen.getByText("Quick Jump").closest(".gl-command-group");
  expect((quickJump as HTMLElement).style.display).toBe("none");
});

test("restores every item when the search is cleared", () => {
  render(<Palette />);
  search("sound");
  expect(screen.queryByText("Wi-Fi Network")).toBeNull();
  search("");
  expect(screen.getByText("Wi-Fi Network")).toBeTruthy();
  expect(screen.getByText("Sound Output")).toBeTruthy();
  expect(screen.queryByText("No settings match.")).toBeNull();
});

test("matches an item by its value prop when its content is not text", () => {
  render(
    <Command>
      <CommandInput placeholder="Search settings…" />
      <CommandList>
        <CommandItem value="bluetooth pairing">
          <svg aria-hidden="true" />
        </CommandItem>
        <CommandItem value="airplane mode">
          <svg aria-hidden="true" />
        </CommandItem>
      </CommandList>
    </Command>
  );
  const options = () => document.querySelectorAll('[role="option"]');
  expect(options()).toHaveLength(2);
  search("blue");
  expect(options()).toHaveLength(1);
});
