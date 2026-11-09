import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Text,
  Textarea,
  Label,
  Badge,
  Avatar,
  AvatarFallback,
  Separator,
  Skeleton,
  Spinner,
  Progress,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  ScrollArea,
  toast,
} from "../src";

describe("Wave 1 Components", () => {
  it("renders Card with header, content, and footer", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Glacia Card</CardTitle>
          <CardDescription>Liquid Glass Card</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>,
    );

    const card = screen.getByTestId("card");
    expect(card.classList.contains("gl-glass")).toBe(true);
    expect(card.classList.contains("gl-card")).toBe(true);
    expect(screen.getByText("Glacia Card")).toBeDefined();
    expect(screen.getByText("Body content")).toBeDefined();
    expect(screen.getByText("Footer actions")).toBeDefined();
  });

  it("renders Text variants correctly", () => {
    const { container } = render(
      <>
        <Text variant="h1">Heading 1</Text>
        <Text variant="p">Paragraph text</Text>
        <Text variant="lead">Lead text</Text>
      </>,
    );

    expect(screen.getByText("Heading 1").tagName).toBe("H1");
    expect(screen.getByText("Paragraph text").tagName).toBe("P");
    expect(container.querySelector(".gl-text-lead")).toBeDefined();
  });

  it("renders Textarea with focus and error attributes", () => {
    render(<Textarea placeholder="Type something..." error data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea.getAttribute("data-error")).toBe("");
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
  });

  it("renders Label associated with input", () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </div>,
    );
    expect(screen.getByText("Test Label")).toBeDefined();
  });

  it("renders Badge variants", () => {
    render(
      <>
        <Badge variant="default">New</Badge>
        <Badge variant="secondary">Beta</Badge>
        <Badge variant="destructive">Critical</Badge>
      </>,
    );
    expect(screen.getByText("New").getAttribute("data-variant")).toBe("default");
    expect(screen.getByText("Beta").getAttribute("data-variant")).toBe("secondary");
    expect(screen.getByText("Critical").getAttribute("data-variant")).toBe("destructive");
  });

  it("renders Avatar with fallback", () => {
    render(
      <Avatar>
        <AvatarFallback>GL</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("GL")).toBeDefined();
  });

  it("renders Separator with orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.querySelector(".gl-separator-v")).toBeDefined();
  });

  it("renders Skeleton with shimmer", () => {
    const { container } = render(<Skeleton className="w-20 h-4" />);
    expect(container.querySelector(".gl-skeleton")).toBeDefined();
  });

  it("renders Spinner with status role", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("renders Progress with indicator", () => {
    render(<Progress value={65} data-testid="progress" />);
    const progress = screen.getByTestId("progress");
    expect(progress.classList.contains("gl-progress")).toBe(true);
  });

  it("renders Checkbox and handles click", () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(checkbox);
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
  });

  it("renders RadioGroup with items", () => {
    render(
      <RadioGroup defaultValue="apple">
        <RadioGroupItem value="apple" aria-label="Apple" />
        <RadioGroupItem value="orange" aria-label="Orange" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    expect(radios[0]?.getAttribute("aria-checked")).toBe("true");
    expect(radios[1]?.getAttribute("aria-checked")).toBe("false");
  });

  it("renders Tabs with triggers and active content", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );

    expect(screen.getByText("Content 1")).toBeDefined();
  });

  it("renders Table with header, rows, and cells", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByText("Header")).toBeDefined();
    expect(screen.getByText("Data 1")).toBeDefined();
  });

  it("renders Sidebar and toggles state via SidebarTrigger", () => {
    render(
      <SidebarProvider defaultOpen={true}>
        <Sidebar data-testid="sidebar">
          <SidebarTrigger data-testid="trigger" />
        </Sidebar>
      </SidebarProvider>,
    );

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar.getAttribute("data-state")).toBe("expanded");
    fireEvent.click(screen.getByTestId("trigger"));
    expect(sidebar.getAttribute("data-state")).toBe("collapsed");
  });

  it("renders ScrollArea with viewport", () => {
    const { container } = render(
      <ScrollArea style={{ height: 100 }}>
        <div>Scrollable content</div>
      </ScrollArea>,
    );
    expect(container.querySelector(".gl-scroll-viewport")).toBeDefined();
  });

  it("toast dispatcher functions properly", () => {
    const id = toast("Message sent!", { description: "Your message is delivered." });
    expect(id).toBeDefined();
    expect(typeof id).toBe("string");
  });
});
