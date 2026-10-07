import React from 'react';

import { colors } from '../theme/colors.js';
import { radius, spacing } from '../theme/spacing.js';
import { typography } from '../theme/typography.js';

export interface Column<Row> {
  key: string;
  header: string;
  render: (row: Row) => React.ReactNode;
}

export interface TableProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  emptyLabel?: string;
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  emptyLabel = 'No data',
}: TableProps<Row>): React.ReactElement {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: colors.surfaceElevated }}>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: 'left',
                  padding: spacing.md,
                  color: colors.textSecondary,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.semibold,
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: spacing.lg,
                  textAlign: 'center',
                  color: colors.textMuted,
                  fontFamily: typography.fontFamily,
                  fontSize: typography.sizes.sm,
                }}
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} style={{ borderTop: `1px solid ${colors.border}` }}>
                {columns.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      padding: spacing.md,
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily,
                      fontSize: typography.sizes.sm,
                    }}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
