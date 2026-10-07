import type { StockProjection } from './PredictiveStock.js';

export interface ReorderDecision {
  productId: string;
  shouldReorder: boolean;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
}

export function decide(projection: StockProjection): ReorderDecision {
  const { daysUntilStockout, recommendedReorderQty } = projection;

  if (daysUntilStockout <= 3) {
    return {
      productId: projection.productId,
      shouldReorder: true,
      quantity: recommendedReorderQty,
      urgency: 'high',
    };
  }
  if (daysUntilStockout <= 7) {
    return {
      productId: projection.productId,
      shouldReorder: true,
      quantity: recommendedReorderQty,
      urgency: 'medium',
    };
  }
  if (daysUntilStockout <= 14) {
    return {
      productId: projection.productId,
      shouldReorder: true,
      quantity: recommendedReorderQty,
      urgency: 'low',
    };
  }
  return {
    productId: projection.productId,
    shouldReorder: false,
    quantity: 0,
    urgency: 'low',
  };
}
