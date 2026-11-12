import type { ReactNode } from "react";

import { colors } from "./internal/tokens";
import { primitives } from "./charts/primitives";

export interface NativeTableColumn {
  key: string;
  header: string;
  /** Relative width. Columns without one share the remainder. */
  width?: number;
  /** Right-align numeric columns so digits line up. */
  align?: "left" | "right" | "center";
  /** Renders the cell as a caption under the row on a narrow screen. */
  primary?: boolean;
}

export interface NativeTableRow {
  id: string;
  cells: Record<string, ReactNode>;
}

export interface NativeTableProps {
  columns: NativeTableColumn[];
  rows: NativeTableRow[];
  /** Tap handler for a whole row. */
  onRowPress?: (row: NativeTableRow) => void;
  /** Text direction for right-aligned columns; defaults to left. */
  caption?: string;
  isDark?: boolean;
  style?: any;
  emptyMessage?: string;
}

/**
 * Tabular data laid out for a phone.
 *
 * A wide table cannot simply shrink: at phone width the columns become
 * unreadable. Instead the first column is promoted to a row title and the rest
 * are laid out as labelled pairs beneath it, which keeps every value readable
 * without horizontal scrolling.
 */
export function NativeTable({
  columns,
  rows,
  onRowPress,
  caption,
  isDark = false,
  style,
  emptyMessage = "No rows to display",
}: NativeTableProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  if (rows.length === 0) {
    return (
      <View style={[{ paddingVertical: 20, alignItems: "center" }, style]}>
        <Text style={{ fontSize: 12, color: theme.muted }}>{emptyMessage}</Text>
      </View>
    );
  }

  // The first column becomes the row's title when the caller marks none.
  const primaryKey = columns.find((column) => column.primary)?.key ?? columns[0]?.key;
  const primaryColumn = columns.find((column) => column.key === primaryKey);
  const detailColumns = columns.filter((column) => column.key !== primaryKey);

  return (
    <View style={style}>
      {caption && (
        <Text style={{ fontSize: 11, color: theme.muted, marginBottom: 8 }}>{caption}</Text>
      )}

      {rows.map((row) => {
        const RowWrapper: any = onRowPress ? Pressable : View;
        const wrapperProps = onRowPress
          ? {
              accessibilityRole: "button",
              accessibilityLabel: String(row.cells[primaryKey ?? ""] ?? ""),
              onPress: () => onRowPress(row),
            }
          : { accessibilityRole: "text" };

        return (
          <RowWrapper
            key={row.id}
            {...wrapperProps}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: theme.edge,
            }}
          >
            {primaryColumn && (
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: theme.foreground,
                  textAlign: primaryColumn.align ?? "left",
                }}
              >
                {row.cells[primaryColumn.key] ?? ""}
              </Text>
            )}

            {detailColumns.length > 0 && (
              <View style={{ marginTop: 6, gap: 4 }}>
                {detailColumns.map((column) => (
                  <View
                    key={column.key}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 12,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: theme.muted }}>{column.header}</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.foreground,
                        textAlign: column.align ?? "left",
                      }}
                    >
                      {row.cells[column.key] ?? ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </RowWrapper>
        );
      })}
    </View>
  );
}

export interface NativeScrollAreaProps {
  children?: ReactNode;
  /** Fixed height. Without one the area grows with its content. */
  maxHeight?: number;
  /** Adds a bordered, tinted frame around the content. */
  bordered?: boolean;
  horizontal?: boolean;
  isDark?: boolean;
  style?: any;
  /** Announced to screen readers. */
  accessibilityLabel?: string;
}

/**
 * A bounded scroll region.
 *
 * Uses the platform ScrollView rather than drawing a custom scrollbar: the OS
 * scroll indicator is the one users already recognise, and it stays correct
 * under momentum, bouncing and accessibility settings.
 */
export function NativeScrollArea({
  children,
  maxHeight,
  bordered = false,
  horizontal = false,
  isDark = false,
  style,
  accessibilityLabel,
}: NativeScrollAreaProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, getScrollView } = primitives();

  const ScrollView = getScrollView();

  const containerStyle = {
    maxHeight,
    borderRadius: bordered ? 12 : undefined,
    borderWidth: bordered ? 1 : 0,
    borderColor: theme.edge,
    overflow: "hidden",
    ...style,
  };

  if (!ScrollView) {
    // Off-device there is no ScrollView; render the content in a clipped box so
    // layout still matches instead of dropping children.
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={{ ...containerStyle, overflow: "auto" }}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <ScrollView
        horizontal={horizontal}
        showsVerticalScrollIndicator
        showsHorizontalScrollIndicator={horizontal}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </ScrollView>
    </View>
  );
}
