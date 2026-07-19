export type InverterType = "Hybrid" | "On-grid" | "Off-grid";

export interface Quote {
  id: string;
  company: string;
  option: string;
  inverterBrand: string;
  inverterType: InverterType;
  panel: string;
  capacity: number;
  battery: string;
  price: number;
}

export interface QuoteWithMetrics extends Quote {
  perKwp: number;
}

export type SortKey = keyof QuoteWithMetrics;

export type BatteryFilter = "" | "Not included" | "N/A" | "Included";

export interface Filters {
  company: string;
  inverterType: string;
  inverterBrand: string;
  battery: BatteryFilter;
}
