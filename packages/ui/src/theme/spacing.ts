export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

export const elevation = {
  none: 0,
  low: 2,
  medium: 6,
  high: 12,
} as const;

export type SpacingName = keyof typeof spacing;
