import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { Accordion as RadixAccordion } from "radix-ui";
import { cx } from "./internal/cx";

export const Accordion = RadixAccordion.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof RadixAccordion.Item>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <RadixAccordion.Item
      ref={ref}
      className={cx("gl-glass gl-accordion-item", className)}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  ElementRef<typeof RadixAccordion.Trigger>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Header className="gl-accordion-header">
      <RadixAccordion.Trigger
        ref={ref}
        className={cx("gl-accordion-trigger", className)}
        {...props}
      >
        {children}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="gl-accordion-chevron"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof RadixAccordion.Content>,
  ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Content
      ref={ref}
      className={cx("gl-accordion-content", className)}
      {...props}
    >
      <div className="gl-accordion-body">{children}</div>
    </RadixAccordion.Content>
  );
});
