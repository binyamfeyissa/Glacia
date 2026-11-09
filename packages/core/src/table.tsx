import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cx } from "./internal/cx";

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  function Table({ className, ...props }, ref) {
    return (
      <div className="gl-table-wrapper">
        <table ref={ref} className={cx("gl-glass gl-table", className)} {...props} />
      </div>
    );
  },
);

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={cx("gl-table-header", className)} {...props} />;
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={cx("gl-table-body", className)} {...props} />;
  },
);

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter({ className, ...props }, ref) {
    return <tfoot ref={ref} className={cx("gl-table-footer", className)} {...props} />;
  },
);

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...props }, ref) {
    return <tr ref={ref} className={cx("gl-table-row", className)} {...props} />;
  },
);

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  function TableHead({ className, ...props }, ref) {
    return <th ref={ref} className={cx("gl-table-head", className)} {...props} />;
  },
);

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  function TableCell({ className, ...props }, ref) {
    return <td ref={ref} className={cx("gl-table-cell", className)} {...props} />;
  },
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} className={cx("gl-table-caption", className)} {...props} />;
  },
);
