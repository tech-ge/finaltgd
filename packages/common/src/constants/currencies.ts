export const TGD_CODE = 'TGD' as const;
export const DECIMAL_PLACES = 4 as const;

export const SUPPORTED_FIAT = [
  'KES',
  'USD',
  'EUR',
  'GBP',
  'UGX',
  'TZS',
] as const;

export type SupportedFiat = (typeof SUPPORTED_FIAT)[number];

export function isSupportedFiat(code: string): code is SupportedFiat {
  return (SUPPORTED_FIAT as readonly string[]).includes(code.toUpperCase());
}
