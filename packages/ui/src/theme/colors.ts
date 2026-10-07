export const colors = {
  background: '#0B0F1A',
  surface: '#121826',
  surfaceElevated: '#1A2234',
  border: '#232B3D',
  borderStrong: '#33405A',

  textPrimary: '#F5F7FB',
  textSecondary: '#A7B1C4',
  textMuted: '#6F7B92',

  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primaryDisabled: '#1E3A8A',

  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',

  accentPurple: '#8B5CF6',
  accentTeal: '#14B8A6',

  overlay: 'rgba(11, 15, 26, 0.75)',
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;
