import type { DemandForecast } from './DemandForecast.js';

export interface StockInput {
  productId: string;
  currentStock: number;
  reorderLeadDays: number;
}

export interface StockProjection {
  productId: string;
  daysUntilStockout: number;
  recommendedReorderQty: number;
}

export function project(
  stock: StockInput,
  forecast: DemandForecast,
): StockProjection {
  const avgPerDay =
    forecast.forecastPerDay.length > 0
      ? forecast.totalForecast / forecast.forecastPerDay.length
      : 0;

  if (avgPerDay <= 0) {
    return {
      productId: stock.productId,
      daysUntilStockout: Number.POSITIVE_INFINITY,
      recommendedReorderQty: 0,
    };
  }

  const days = Math.floor(stock.currentStock / avgPerDay);
  const requiredForLeadTime = avgPerDay * (stock.reorderLeadDays + 7);
  const shortfall = Math.max(0, requiredForLeadTime - stock.currentStock);

  return {
    productId: stock.productId,
    daysUntilStockout: days,
    recommendedReorderQty: Math.ceil(shortfall),
  };
}
