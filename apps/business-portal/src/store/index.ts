export interface BusinessState {
  businessId: number | null;
  storefrontSlug: string | null;
}

export const initialBusinessState: BusinessState = {
  businessId: null,
  storefrontSlug: null,
};
