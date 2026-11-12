import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Checkbox,
  Field,
  Input,
  Label,
  RadioGroup,
  Select,
  Textarea,
} from "../src";

describe("Input", () => {
  it("reports typed text", () => {
    const onChangeText = vi.fn();
    const { container } = render(
      <Input value="" onChangeText={onChangeText} placeholder="Email" />,
    );
    fireEvent.change(container.querySelector("input")!, { target: { value: "a@b.c" } });
    expect(onChangeText).toHaveBeenCalledWith("a@b.c");
  });

  it("shows the placeholder only while empty", () => {
    const { rerender, container } = render(<Input value="" placeholder="Email" />);
    // The input also carries the placeholder as its aria-label, so count spans only.
    const placeholders = () => Array.from(container.querySelectorAll("span")).filter((el) => el.textContent === "Email");
    expect(placeholders()).toHaveLength(1);
    rerender(<Input value="filled" placeholder="Email" />);
    expect(placeholders()).toHaveLength(0);
  });

  it("marks the field invalid through the border colour", () => {
    const { container } = render(<Input value="" invalid />);
    const style = getComputedStyle(container.firstElementChild as Element);
    // Destructive red, not the neutral edge colour.
    expect(style.borderColor).toContain("255");
  });

  it("disables editing when disabled", () => {
    const { container } = render(<Input value="x" disabled />);
    expect((container.querySelector("input") as HTMLInputElement).disabled).toBe(true);
  });

  it("uses the accessibility label for screen readers", () => {
    const { container } = render(<Input value="" accessibilityLabel="Search" />);
    expect(container.querySelector("input")!.getAttribute("aria-label")).toBe("Search");
  });

  it("renders a multiline textarea with the requested row count", () => {
    const { container } = render(<Textarea value="" rows={6} />);
    const field = container.querySelector("textarea")!;
    expect(field).toBeTruthy();
    expect(field.getAttribute("rows")).toBe("6");
  });
});

describe("Field", () => {
  it("renders label, control and description in order", () => {
    const { container } = render(
      <Field label="Email" description="We never share this">
        <Input value="" />
      </Field>,
    );
    const text = container.textContent ?? "";
    expect(text.indexOf("Email")).toBeLessThan(text.indexOf("We never share this"));
  });

  it("marks a required field", () => {
    render(<Field label="Name" required><Input value="" /></Field>);
    expect(screen.getByText("*")).toBeTruthy();
  });

  it("shows the error instead of the description", () => {
    render(
      <Field label="Email" description="Helper" error="Required">
        <Input value="" />
      </Field>,
    );
    expect(screen.getByText("Required")).toBeTruthy();
    expect(screen.queryByText("Helper")).toBeNull();
  });

  it("announces an error as an alert", () => {
    const { container } = render(<Field label="Email" error="Required" />);
    expect(container.querySelector('[role="alert"]')!.textContent).toBe("Required");
  });
});

describe("Label", () => {
  it("renders its text", () => {
    render(<Label>Amount</Label>);
    expect(screen.getByText("Amount")).toBeTruthy();
  });
});

describe("Checkbox", () => {
  it("toggles on press", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange} label="Agree" />,
    );
    fireEvent.click(container.querySelector('[role="checkbox"]')!);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("exposes its checked state", () => {
    const { container } = render(<Checkbox checked label="Agree" />);
    expect(container.querySelector('[role="checkbox"]')!.getAttribute("aria-checked")).toBe("true");
  });

  it("does not fire when disabled", () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Checkbox disabled onCheckedChange={onCheckedChange} label="Agree" />);
    fireEvent.click(container.querySelector('[role="checkbox"]')!);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("shows a dash when indeterminate", () => {
    const { container } = render(<Checkbox indeterminate label="Some" />);
    // the dash is a View; the tick glyph must be absent
    expect(container.textContent).not.toContain("✓");
  });
});

describe("RadioGroup", () => {
  const options = [
    { value: "sm", label: "Small" },
    { value: "lg", label: "Large" },
  ];

  it("renders one radio per option", () => {
    const { container } = render(<RadioGroup options={options} value="sm" />);
    expect(container.querySelectorAll('[role="radio"]')).toHaveLength(2);
  });

  it("reports the chosen value", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup options={options} value="sm" onValueChange={onValueChange} />,
    );
    fireEvent.click(container.querySelectorAll('[role="radio"]')[1]!);
    expect(onValueChange).toHaveBeenCalledWith("lg");
  });

  it("marks the current selection", () => {
    const { container } = render(<RadioGroup options={options} value="lg" />);
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios[1]!.getAttribute("aria-checked")).toBe("true");
    expect(radios[0]!.getAttribute("aria-checked")).toBe("false");
  });
});

describe("Select", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];

  it("shows the placeholder until opened", () => {
    render(<Select options={options} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeTruthy();
    expect(screen.queryByText("Beta")).toBeNull();
  });

  it("lists options after pressing", () => {
    const { container } = render(<Select options={options} placeholder="Pick one" />);
    fireEvent.click(container.querySelector('[role="button"][aria-expanded="false"]')!);
    const rows = Array.from(container.querySelectorAll('[aria-selected]'));
    expect(rows.map((r) => r.getAttribute("aria-label"))).toEqual(["Alpha", "Beta"]);
  });

  it("reports the chosen value and closes", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Select options={options} onValueChange={onValueChange} placeholder="Pick one" />,
    );
    fireEvent.click(container.querySelector('[aria-expanded="false"]')!);
    // Option rows carry aria-selected; the trigger does not.
    const option = container.querySelector('[aria-selected]')!.parentElement!
      .querySelectorAll('[aria-selected]')[1]!;
    fireEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith("b");
    // the list is closed again, so no option rows remain
    expect(container.querySelectorAll('[aria-selected]')).toHaveLength(0);
  });

  it("shows the selected label on the trigger", () => {
    const { container } = render(<Select options={options} value="a" />);
    const trigger = container.querySelector('[aria-expanded]')!;
    expect(trigger.getAttribute("aria-label")).toBe("Alpha");
    expect(trigger.textContent).toContain("Alpha");
    // Closed by default, so no option rows are rendered.
    expect(container.querySelectorAll("[aria-selected]")).toHaveLength(0);
  });
});
