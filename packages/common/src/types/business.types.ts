import type { Decimal } from 'decimal.js';

export interface Storefront {
  storefrontId: number;
  businessId: number;
  slug: string;
  displayName: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  storefrontSlug: string;
  name: string;
  description: string;
  priceTgd: Decimal;
  isActive: boolean;
}

export interface QrPayload {
  storefrontSlug: string;
  businessAccountId: number;
  amountTgd: string;
  reference: string;
  issuedAt: number;
}

export interface HeatmapCell {
  latBucket: number;
  lonBucket: number;
  count: number;
  intensity: number;
}

export interface DemandForecast {
  productId: string;
  horizonDays: number;
  forecastPerDay: number[];
  totalForecast: number;
}
