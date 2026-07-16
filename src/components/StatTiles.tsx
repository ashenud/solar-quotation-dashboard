import type { SummaryStats } from "../utils/analysis";
import { formatCurrency } from "../utils/format";

interface Tile {
  label: string;
  value: string;
  detail?: string;
}

export function StatTiles({ stats }: { stats: SummaryStats }) {
  const tiles: Tile[] = [
    { label: "Quotations", value: String(stats.count), detail: `${stats.companyCount} companies` },
    { label: "Lowest Price", value: formatCurrency(stats.minPrice.price), detail: stats.minPrice.company },
    {
      label: "Best LKR / kWp",
      value: formatCurrency(stats.minPerKwp.perKwp),
      detail: stats.minPerKwp.company,
    },
    { label: "Average Price", value: formatCurrency(Math.round(stats.avgPrice)) },
    { label: "Median Price", value: formatCurrency(Math.round(stats.medianPrice)) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {tiles.map((t) => (
        <div
          key={t.label}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4"
        >
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{t.label}</div>
          <div className="mt-1.5 text-xl font-semibold text-[var(--text-primary)]">{t.value}</div>
          {t.detail && <div className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">{t.detail}</div>}
        </div>
      ))}
    </div>
  );
}
