/** Market distribution parameters (mocked) */
export const MARKET = {
  minPrice: 50,
  maxPrice: 800,
  mean: 280,
  stdDev: 120,
  defaultRangeLow: 300,
  defaultRangeHigh: 700,
  defaultThreshold: 500,
} as const;

export type PredictionMode = "range" | "above" | "below";

export function pdf(x: number): number {
  const { mean, stdDev } = MARKET;
  const z = (x - mean) / stdDev;
  return Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
}

export function probabilityInRange(low: number, high: number): number {
  const steps = 200;
  const lo = Math.max(MARKET.minPrice, Math.min(low, high));
  const hi = Math.min(MARKET.maxPrice, Math.max(low, high));
  if (hi <= lo) return 0;

  let total = 0;
  let rangeMass = 0;
  const dx = (MARKET.maxPrice - MARKET.minPrice) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = MARKET.minPrice + i * dx;
    const p = pdf(x);
    total += p * dx;
    if (x >= lo && x <= hi) rangeMass += p * dx;
  }

  return total > 0 ? rangeMass / total : 0;
}

export function resolveForecastRange(
  mode: PredictionMode,
  rangeLow: number,
  rangeHigh: number,
  threshold: number
): { low: number; high: number } {
  switch (mode) {
    case "above":
      return { low: threshold, high: MARKET.maxPrice };
    case "below":
      return { low: MARKET.minPrice, high: threshold };
    default:
      return {
        low: Math.min(rangeLow, rangeHigh),
        high: Math.max(rangeLow, rangeHigh),
      };
  }
}

export interface ForecastMetrics {
  winProbability: number;
  potentialReturn: number;
  receiveIfCorrect: number;
}

const STAKE_USD = 1;

export function computeMetrics(low: number, high: number): ForecastMetrics {
  const winProbability = probabilityInRange(low, high);
  const clampedProb = Math.max(winProbability, 0.005);
  const potentialReturn = Math.min(25, 1 / clampedProb);
  const receiveIfCorrect = potentialReturn * STAKE_USD;

  return {
    winProbability,
    potentialReturn,
    receiveIfCorrect,
  };
}

export function formatForecastLabel(
  mode: PredictionMode,
  rangeLow: number,
  rangeHigh: number,
  threshold: number
): string {
  switch (mode) {
    case "above":
      return `Above ${formatPrice(threshold)}`;
    case "below":
      return `Below ${formatPrice(threshold)}`;
    default:
      return `${formatPrice(rangeLow)} — ${formatPrice(rangeHigh)}`;
  }
}

export function formatPrice(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatMultiplier(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}
