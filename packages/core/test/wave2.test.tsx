import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ButtonGroup,
  Toggle,
  InputGroup,
  InputGroupAddon,
  Field,
  Form,
  Combobox,
  Calendar,
  Chart,
  Empty,
  Item,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  DataTable,
  SettingsBlock,
  ProfileBlock,
  SignupBlock,
} from "../src";

describe("Wave 2 Components & Blocks", () => {
  it("renders ButtonGroup with segmented variant and horizontal orientation", () => {
    const { container } = render(
      <ButtonGroup variant="segmented" orientation="horizontal">
        <button type="button">Day</button>
        <button type="button">Week</button>
        <button type="button">Month</button>
      </ButtonGroup>
    );
    const group = container.querySelector(".gl-button-group");
    expect(group).not.toBeNull();
    expect(group?.getAttribute("data-variant")).toBe("segmented");
    expect(group?.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("renders Toggle with controllable pressed state", () => {
    const { container } = render(
      <Toggle defaultPressed={false}>Live Photos</Toggle>
    );
    const btn = container.querySelector(".gl-toggle") as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    expect(btn.getAttribute("data-state")).toBe("on");
  });

  it("renders InputGroup with leading and trailing addons", () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon align="leading">$</InputGroupAddon>
        <input type="text" placeholder="Amount" />
        <InputGroupAddon align="trailing">USD</InputGroupAddon>
      </InputGroup>
    );
    const group = container.querySelector(".gl-input-group");
    expect(group).not.toBeNull();
    expect(container.querySelectorAll(".gl-input-group-addon").length).toBe(2);
  });

  it("renders Field with label, required star, and error message", () => {
    render(
      <Field
        label="Account Email"
        required
        description="We'll send updates here."
        error="Please provide a valid email."
      >
        <input type="email" id="test-email" />
      </Field>
    );
    expect(screen.getByText("Account Email")).not.toBeNull();
    expect(screen.getByText("*")).not.toBeNull();
    expect(screen.getByText("Please provide a valid email.")).not.toBeNull();
  });

  it("renders Form container", () => {
    const { container } = render(
      <Form aria-label="Settings form">
        <div>Form Content</div>
      </Form>
    );
    const form = container.querySelector("form.gl-form");
    expect(form).not.toBeNull();
  });

  it("renders Combobox and expands options on click", () => {
    const options = [
      { value: "cupertino", label: "Cupertino" },
      { value: "austin", label: "Austin" },
    ];
    render(<Combobox options={options} placeholder="Choose headquarters..." />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).not.toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByText("Cupertino")).not.toBeNull();
    expect(screen.getByText("Austin")).not.toBeNull();
  });

  it("renders Calendar with month title and weekdays", () => {
    const { container } = render(<Calendar />);
    const cal = container.querySelector(".gl-calendar");
    expect(cal).not.toBeNull();
    expect(screen.getByText("Su")).not.toBeNull();
    expect(screen.getByText("Mo")).not.toBeNull();
  });

  it("renders Chart with data points", () => {
    const data = [
      { label: "Mon", value: 10 },
      { label: "Tue", value: 25 },
      { label: "Wed", value: 40 },
    ];
    const { container } = render(<Chart data={data} type="bar" />);
    // The chart draws no card of its own; it sits on the caller's surface.
    expect(container.querySelector(".gl-chart")).not.toBeNull();
    expect(container.querySelector(".gl-chart-card")).toBeNull();
    expect(screen.getByText("Mon")).not.toBeNull();
    expect(screen.getByText("Wed")).not.toBeNull();
  });

  it("renders Empty state with title, description, and action", () => {
    render(
      <Empty
        title="No Notifications"
        description="You're all caught up on announcements."
        action={<button type="button">Refresh</button>}
      />
    );
    expect(screen.getByText("No Notifications")).not.toBeNull();
    expect(screen.getByText("You're all caught up on announcements.")).not.toBeNull();
    expect(screen.getByText("Refresh")).not.toBeNull();
  });

  it("renders Item settings row with title, description, and accessory", () => {
    render(
      <Item
        icon={<span>⚙️</span>}
        title="Wi-Fi"
        description="Connected to Apple Campus"
        accessory={<span>›</span>}
        interactive
      />
    );
    expect(screen.getByText("Wi-Fi")).not.toBeNull();
    expect(screen.getByText("Connected to Apple Campus")).not.toBeNull();
    expect(screen.getByText("›")).not.toBeNull();
  });

  it("renders Breadcrumb navigation hierarchy", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByText("Home")).not.toBeNull();
    expect(screen.getByText("Settings")).not.toBeNull();
  });

  it("renders Pagination with previous, page numbers, and next", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
    expect(screen.getByText("Previous")).not.toBeNull();
    expect(screen.getByText("1")).not.toBeNull();
    expect(screen.getByText("Next")).not.toBeNull();
  });

  it("renders Collapsible with trigger and content", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Show Details</CollapsibleTrigger>
        <CollapsibleContent>Secret Liquid Glass Recipes</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText("Show Details")).not.toBeNull();
    expect(screen.getByText("Secret Liquid Glass Recipes")).not.toBeNull();
  });

  it("renders DataTable with data rows and search toolbar", () => {
    const data = [
      { id: 1, name: "MacBook Pro", category: "Hardware" },
      { id: 2, name: "Logic Pro", category: "Software" },
    ];
    const columns = [
      { key: "name", header: "Product Name" },
      { key: "category", header: "Category" },
    ];
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByText("MacBook Pro")).not.toBeNull();
    expect(screen.getByText("Logic Pro")).not.toBeNull();
  });

  it("renders SettingsBlock with navigation and appearance settings", () => {
    render(<SettingsBlock />);
    expect(screen.getByText("Appearance & Theme")).not.toBeNull();
    expect(screen.getByText("Dark Interface Mode")).not.toBeNull();
  });

  it("renders ProfileBlock with user name and linked devices", () => {
    render(<ProfileBlock />);
    expect(screen.getByText("Alexander Wright")).not.toBeNull();
    expect(screen.getByText("iPhone 16 Pro Max")).not.toBeNull();
  });

  it("renders SignupBlock with inputs and strength meter", () => {
    render(<SignupBlock />);
    expect(screen.getByText("Create Your Account")).not.toBeNull();
    expect(screen.getByPlaceholderText("jane@icloud.com")).not.toBeNull();
  });
});
