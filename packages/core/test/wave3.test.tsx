import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ToggleGroup,
  ToggleGroupItem,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  Carousel,
  CarouselContent,
  CarouselItem,
  Kbd,
  CodeBlock,
  Marker,
  TextMarker,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  Message,
  MessageBubble,
  MessageAvatar,
  MessageContent,
  MessageScroller,
  MessageDateDivider,
  Attachment,
  Questionnaire,
  QuestionnaireStep,
  QuestionnaireOption,
  DirectionProvider,
  useDirection,
  CalendarPageBlock,
  PricingBlock,
  LandingBlock,
  ForgotPasswordBlock,
  ErrorPageBlock,
} from "../src";

describe("Wave 3 Components & Blocks", () => {
  it("renders ToggleGroup with items and handles selection", () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="bold">
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
      </ToggleGroup>
    );
    const group = container.querySelector(".gl-toggle-group");
    expect(group).not.toBeNull();
    const items = container.querySelectorAll(".gl-toggle-group-item");
    expect(items.length).toBe(2);
    expect(items[0]?.getAttribute("data-state")).toBe("on");
    expect(items[1]?.getAttribute("data-state")).toBe("off");
  });

  it("renders InputOTP with slots and secret code", () => {
    const { container } = render(
      <InputOTP maxLength={6} defaultValue="123">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
    const slots = container.querySelectorAll(".gl-input-otp-slot");
    expect(slots.length).toBe(6);
    expect(slots[0]?.textContent).toBe("1");
    expect(slots[1]?.textContent).toBe("2");
    expect(slots[2]?.textContent).toBe("3");
    expect(slots[3]?.textContent).toBe("");
  });

  it("renders Command palette with input and list", () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search actions..." />
        <CommandList>
          <CommandItem>Open Project</CommandItem>
          <CommandItem>Preferences</CommandItem>
        </CommandList>
      </Command>
    );
    const input = container.querySelector(".gl-command-input") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.placeholder).toBe("Search actions...");
    const items = container.querySelectorAll(".gl-command-item");
    expect(items.length).toBe(2);
  });

  it("renders Carousel with content and items", () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    const carousel = container.querySelector(".gl-carousel-root");
    expect(carousel).not.toBeNull();
    const slides = container.querySelectorAll(".gl-carousel-item");
    expect(slides.length).toBe(2);
  });

  it("renders Kbd with modifiers", () => {
    const { container } = render(<Kbd size="md">⌘K</Kbd>);
    const kbd = container.querySelector(".gl-kbd");
    expect(kbd).not.toBeNull();
    expect(kbd?.textContent).toBe("⌘K");
  });

  it("renders CodeBlock with filename and window dots", () => {
    const { container } = render(
      <CodeBlock code="const a = 10;" filename="index.ts" language="typescript" />
    );
    const codeBlock = container.querySelector(".gl-code-block");
    expect(codeBlock).not.toBeNull();
    const dots = container.querySelectorAll(".gl-control-dot");
    expect(dots.length).toBe(3);
    expect(container.querySelector(".gl-code-block-filename")?.textContent).toBe("index.ts");
  });

  it("renders Marker and TextMarker", () => {
    const { container } = render(
      <div>
        <Marker color="blue" label="Cupertino" />
        <p>This is <TextMarker variant="yellow">highlighted</TextMarker> text.</p>
      </div>
    );
    expect(container.querySelector(".gl-marker-root")).not.toBeNull();
    expect(container.querySelector(".gl-text-marker")).not.toBeNull();
  });

  it("renders Menubar with triggers", () => {
    const { container } = render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );
    const triggers = container.querySelectorAll(".gl-menubar-trigger");
    expect(triggers.length).toBe(2);
    expect(triggers[0]?.textContent).toBe("File");
  });

  it("renders Message and speech bubble", () => {
    const { container } = render(
      <Message role="assistant">
        <MessageAvatar fallback="AI" />
        <MessageBubble>
          <MessageContent>Hello, I am Glacia.</MessageContent>
        </MessageBubble>
      </Message>
    );
    expect(container.querySelector(".gl-message-assistant")).not.toBeNull();
    expect(container.querySelector(".gl-message-bubble")).not.toBeNull();
    expect(container.querySelector(".gl-message-content")?.textContent).toBe("Hello, I am Glacia.");
  });

  it("renders MessageScroller and DateDivider", () => {
    const { container } = render(
      <MessageScroller>
        <MessageDateDivider>Today 9:41 AM</MessageDateDivider>
        <Message role="user">
          <MessageBubble>Test</MessageBubble>
        </Message>
      </MessageScroller>
    );
    expect(container.querySelector(".gl-message-scroller")).not.toBeNull();
    expect(container.querySelector(".gl-message-date-divider")?.textContent).toBe("Today 9:41 AM");
  });

  it("renders Attachment with metadata and remove callback", () => {
    let removed = false;
    const { container } = render(
      <Attachment
        name="Keynote.pdf"
        size="4.2 MB"
        type="pdf"
        onRemove={() => { removed = true; }}
      />
    );
    expect(container.querySelector(".gl-attachment-name")?.textContent).toBe("Keynote.pdf");
    expect(container.querySelector(".gl-attachment-size")?.textContent).toBe("4.2 MB");
    const removeBtn = container.querySelector(".gl-attachment-remove-btn") as HTMLButtonElement;
    fireEvent.click(removeBtn);
    expect(removed).toBe(true);
  });

  it("renders Questionnaire with steps and options", () => {
    const { container } = render(
      <Questionnaire currentStep={1} totalSteps={3}>
        <QuestionnaireStep title="Appearance Preference" description="Select your preferred mode">
          <QuestionnaireOption label="Dark Mode" description="Deep OLED blacks" selected />
          <QuestionnaireOption label="Light Mode" description="Vibrant daylight glass" />
        </QuestionnaireStep>
      </Questionnaire>
    );
    expect(container.querySelector(".gl-questionnaire-title")?.textContent).toBe("Appearance Preference");
    const options = container.querySelectorAll(".gl-questionnaire-option");
    expect(options.length).toBe(2);
    expect(options[0]?.getAttribute("aria-checked")).toBe("true");
  });

  it("renders DirectionProvider and detects RTL", () => {
    function DirTest() {
      const { dir, isRTL } = useDirection();
      return <div data-testid="dir-info">{dir}:{String(isRTL)}</div>;
    }

    const { getByTestId } = render(
      <DirectionProvider dir="rtl">
        <DirTest />
      </DirectionProvider>
    );
    expect(getByTestId("dir-info").textContent).toBe("rtl:true");
  });

  it("renders CalendarPageBlock", () => {
    const { container } = render(<CalendarPageBlock />);
    expect(container.querySelector(".gl-calendar-page-block")).not.toBeNull();
    expect(container.querySelector(".gl-cal-sidebar-title")?.textContent).toBe("Calendar");
  });

  it("renders PricingBlock with billing toggle", () => {
    const { container } = render(<PricingBlock />);
    expect(container.querySelector(".gl-pricing-block")).not.toBeNull();
    expect(container.querySelectorAll(".gl-pricing-card").length).toBe(3);
  });

  it("renders LandingBlock", () => {
    const { container } = render(<LandingBlock />);
    expect(container.querySelector(".gl-landing-block")).not.toBeNull();
    expect(container.querySelector(".gl-landing-headline")).not.toBeNull();
  });

  it("renders ForgotPasswordBlock", () => {
    const { container } = render(<ForgotPasswordBlock />);
    expect(container.querySelector(".gl-forgot-password-block")).not.toBeNull();
    expect(container.querySelector(".gl-auth-title")?.textContent).toBe("Apple ID Recovery");
  });

  it("renders ErrorPageBlock with status codes", () => {
    const { container } = render(<ErrorPageBlock code="404" />);
    expect(container.querySelector(".gl-error-code-huge")?.textContent).toBe("404");
  });
});
