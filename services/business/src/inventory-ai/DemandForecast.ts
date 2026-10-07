export interface DemandInput {
  productId: string;
  historicalSales: number[];
  horizonDays: number;
}

export interface DemandForecast {
  productId: string;
  horizonDays: number;
  forecastPerDay: number[];
  totalForecast: number;
}

function movingAverage(values: number[], window: number): number {
  if (values.length === 0) {
    return 0;
  }
  const slice = values.slice(-window);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

export function forecast(input: DemandInput): DemandForecast {
  const baseline = movingAverage(input.historicalSales, 7);
  const forecastPerDay = new Array<number>(input.horizonDays).fill(baseline);
  const total = forecastPerDay.reduce((a, b) => a + b, 0);
  return {
    productId: input.productId,
    horizonDays: input.horizonDays,
    forecastPerDay,
    totalForecast: Number(total.toFixed(2)),
  };
}
