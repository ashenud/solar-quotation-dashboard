import { avgPerKwpByType, avgPriceByCompany } from "../utils/analysis";
import type { QuoteWithMetrics } from "../types";
import { formatCurrency } from "../utils/format";
import { HorizontalBarList, type BarDatum } from "./charts/HorizontalBarList";

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mb-4 text-xs text-[var(--text-muted)]">{subtitle}</p>
      {children}
    </div>
  );
}

export function AnalysisSection({ quotes }: { quotes: QuoteWithMetrics[] }) {
  const companyAgg = avgPriceByCompany(quotes);
  const typeAgg = avgPerKwpByType(quotes);

  const companyData: BarDatum[] = companyAgg.map((c) => ({
    key: c.company,
    label: c.company,
    value: c.avgPrice,
    color: "var(--series-blue)",
    valueLabel: formatCurrency(Math.round(c.avgPrice)),
    tooltip: `${c.optionCount} option${c.optionCount > 1 ? "s" : ""} · from ${formatCurrency(c.minPrice)}`,
  }));

  const typeColors: Record<string, string> = {
    Hybrid: "var(--series-blue)",
    "On-grid": "var(--series-green)",
  };
  const typeData: BarDatum[] = typeAgg
    .sort((a, b) => a.avgPerKwp - b.avgPerKwp)
    .map((t) => ({
      key: t.inverterType,
      label: t.inverterType,
      value: t.avgPerKwp,
      color: typeColors[t.inverterType] ?? "var(--series-violet)",
      valueLabel: formatCurrency(Math.round(t.avgPerKwp)),
      tooltip: `${t.count} quotation${t.count > 1 ? "s" : ""} averaged`,
    }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Average Price by Company" subtitle="Lower is better · averaged across each company's submitted options">
        <HorizontalBarList data={companyData} ariaLabel="Average price by company" />
      </ChartCard>
      <ChartCard
        title="Avg. LKR / kWp: Hybrid vs On-grid"
        subtitle="Cost efficiency per installed kWp by inverter type"
      >
        <HorizontalBarList data={typeData} ariaLabel="Average price per kWp by inverter type" />
      </ChartCard>
    </div>
  );
}
