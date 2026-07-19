import type { Quote, QuoteWithMetrics } from "../types";

export function withMetrics(quotes: Quote[]): QuoteWithMetrics[] {
  return quotes.map((q) => ({ ...q, perKwp: Math.round(q.price / q.capacity) }));
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export interface SummaryStats {
  count: number;
  companyCount: number;
  minPrice: QuoteWithMetrics;
  maxPrice: QuoteWithMetrics;
  avgPrice: number;
  medianPrice: number;
  minPerKwp: QuoteWithMetrics;
  avgPerKwp: number;
  avgCapacity: number;
  batteryIncludedCount: number;
}

export function summarize(quotes: QuoteWithMetrics[]): SummaryStats {
  const minPrice = quotes.reduce((a, b) => (b.price < a.price ? b : a));
  const maxPrice = quotes.reduce((a, b) => (b.price > a.price ? b : a));
  const minPerKwp = quotes.reduce((a, b) => (b.perKwp < a.perKwp ? b : a));
  const avgPrice = quotes.reduce((sum, q) => sum + q.price, 0) / quotes.length;
  const avgPerKwp = quotes.reduce((sum, q) => sum + q.perKwp, 0) / quotes.length;
  const avgCapacity = quotes.reduce((sum, q) => sum + q.capacity, 0) / quotes.length;
  const batteryIncludedCount = quotes.filter((q) => q.battery.trim().toLowerCase().startsWith("included")).length;

  return {
    count: quotes.length,
    companyCount: new Set(quotes.map((q) => q.company)).size,
    minPrice,
    maxPrice,
    avgPrice,
    medianPrice: median(quotes.map((q) => q.price)),
    minPerKwp,
    avgPerKwp,
    avgCapacity,
    batteryIncludedCount,
  };
}

export interface CompanyAggregate {
  company: string;
  avgPrice: number;
  minPrice: number;
  optionCount: number;
}

export function avgPriceByCompany(quotes: QuoteWithMetrics[]): CompanyAggregate[] {
  const byCompany = new Map<string, QuoteWithMetrics[]>();
  for (const q of quotes) {
    const list = byCompany.get(q.company) ?? [];
    list.push(q);
    byCompany.set(q.company, list);
  }
  return [...byCompany.entries()]
    .map(([company, list]) => ({
      company,
      avgPrice: list.reduce((sum, q) => sum + q.price, 0) / list.length,
      minPrice: Math.min(...list.map((q) => q.price)),
      optionCount: list.length,
    }))
    .sort((a, b) => a.avgPrice - b.avgPrice);
}

export interface TypeAggregate {
  inverterType: string;
  avgPerKwp: number;
  count: number;
}

export function avgPerKwpByType(quotes: QuoteWithMetrics[]): TypeAggregate[] {
  const byType = new Map<string, QuoteWithMetrics[]>();
  for (const q of quotes) {
    const list = byType.get(q.inverterType) ?? [];
    list.push(q);
    byType.set(q.inverterType, list);
  }
  return [...byType.entries()].map(([inverterType, list]) => ({
    inverterType,
    avgPerKwp: list.reduce((sum, q) => sum + q.perKwp, 0) / list.length,
    count: list.length,
  }));
}

export interface CheapestByType {
  inverterType: string;
  quote: QuoteWithMetrics;
  count: number;
}

export function cheapestByType(quotes: QuoteWithMetrics[]): CheapestByType[] {
  const byType = new Map<string, QuoteWithMetrics[]>();
  for (const q of quotes) {
    const list = byType.get(q.inverterType) ?? [];
    list.push(q);
    byType.set(q.inverterType, list);
  }
  return [...byType.entries()].map(([inverterType, list]) => ({
    inverterType,
    quote: list.reduce((a, b) => (b.price < a.price ? b : a)),
    count: list.length,
  }));
}
