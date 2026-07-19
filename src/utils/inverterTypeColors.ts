import type { InverterType } from "../types";

interface TypeStyle {
  badgeBg: string;
  badgeText: string;
  chartColor: string;
}

export const INVERTER_TYPE_STYLES: Record<InverterType, TypeStyle> = {
  Hybrid: {
    badgeBg: "bg-[var(--series-blue)]/15",
    badgeText: "text-[var(--series-blue)]",
    chartColor: "var(--series-blue)",
  },
  "On-grid": {
    badgeBg: "bg-[var(--series-green)]/15",
    badgeText: "text-[var(--series-green)]",
    chartColor: "var(--series-green)",
  },
  "Off-grid": {
    badgeBg: "bg-[var(--series-magenta)]/15",
    badgeText: "text-[var(--series-magenta)]",
    chartColor: "var(--series-magenta)",
  },
};
