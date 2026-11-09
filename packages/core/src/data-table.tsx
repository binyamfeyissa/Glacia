import {
  forwardRef,
  useState,
  useMemo,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./table";
import { Button } from "./button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T = Record<string, any>> {
  data: T[];
  columns: DataTableColumn<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchKey?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
  caption?: string;
}

export const DataTable: ForwardRefExoticComponent<
  DataTableProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, DataTableProps>(
  function DataTable(
    {
      data,
      columns,
      pageSize = 5,
      searchable = true,
      searchKey,
      selectable = true,
      onSelectionChange,
      className,
      caption,
    },
    ref
  ) {
    const [search, setSearch] = useState("");
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());

    // Filter
    const filteredData = useMemo(() => {
      if (!search.trim()) return data;
      const lower = search.toLowerCase();
      return data.filter((row: any) => {
        if (searchKey) {
          return String(row[searchKey] || "").toLowerCase().includes(lower);
        }
        return Object.values(row).some((val) =>
          String(val).toLowerCase().includes(lower)
        );
      });
    }, [data, search, searchKey]);

    // Sort
    const sortedData = useMemo(() => {
      if (!sortColumn) return filteredData;
      return [...filteredData].sort((a: any, b: any) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }, [filteredData, sortColumn, sortAsc]);

    // Paginate
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const paginatedData = useMemo(() => {
      const start = (page - 1) * pageSize;
      return sortedData.slice(start, start + pageSize);
    }, [sortedData, page, pageSize]);

    const handleSort = (colKey: string, sortable?: boolean) => {
      if (!sortable) return;
      if (sortColumn === colKey) {
        setSortAsc(!sortAsc);
      } else {
        setSortColumn(colKey);
        setSortAsc(true);
      }
    };

    const toggleSelectAll = (checked: boolean) => {
      if (checked) {
        const all = new Set<number>(paginatedData.map((_, i) => i));
        setSelectedIndexes(all);
        onSelectionChange?.(paginatedData);
      } else {
        setSelectedIndexes(new Set());
        onSelectionChange?.([]);
      }
    };

    const toggleSelectRow = (index: number) => {
      const next = new Set(selectedIndexes);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      setSelectedIndexes(next);
      onSelectionChange?.(paginatedData.filter((_, i) => next.has(i)));
    };

    return (
      <div ref={ref} className={cx("gl-glass gl-data-table-container", className)}>
        {/* Top Control Bar */}
        {searchable && (
          <div className="gl-data-table-toolbar">
            <Input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="gl-data-table-search"
            />
            {caption && <span className="gl-data-table-caption">{caption}</span>}
          </div>
        )}

        {/* Core Table */}
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead style={{ width: 44 }}>
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      selectedIndexes.size === paginatedData.length
                    }
                    onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  style={col.sortable ? { cursor: "pointer", userSelect: "none" } : undefined}
                >
                  <div className="gl-data-table-header-content">
                    <span>{col.header}</span>
                    {col.sortable && sortColumn === col.key && (
                      <span className="gl-sort-arrow">{sortAsc ? "▲" : "▼"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="gl-data-table-empty"
                >
                  No matching data
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row: any, i) => {
                const isSelected = selectedIndexes.has(i);
                return (
                  <TableRow key={row.id ?? i} data-selected={isSelected ? "" : undefined}>
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectRow(i)}
                          aria-label={`Select row ${i + 1}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.cell ? col.cell(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="gl-data-table-footer">
          <span className="gl-data-table-count">
            Showing {Math.min(filteredData.length, (page - 1) * pageSize + 1)} to{" "}
            {Math.min(filteredData.length, page * pageSize)} of {filteredData.length} records
          </span>
          <div className="gl-data-table-pagination">
            <Button
              size="sm"
              variant="glass"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="gl-page-indicator">
              {page} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="glass"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
