import { avgPerKwpByType, avgPriceByCompany, cheapestByType } from "../utils/analysis";
import type { InverterType, QuoteWithMetrics } from "../types";
import { formatCurrency } from "../utils/format";
import { INVERTER_TYPE_STYLES } from "../utils/inverterTypeColors";
import { HorizontalBarList, type BarDatum } from "./charts/HorizontalBarList";

function ChartCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4 ${className ?? ""}`}>
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mb-4 text-xs text-[var(--text-muted)]">{subtitle}</p>
      {children}
    </div>
  );
}

export function AnalysisSection({ quotes }: { quotes: QuoteWithMetrics[] }) {
  const companyAgg = avgPriceByCompany(quotes);
  const typeAgg = avgPerKwpByType(quotes);
  const cheapestAgg = cheapestByType(quotes);

  const companyData: BarDatum[] = companyAgg.map((c) => ({
    key: c.company,
    label: c.company,
    value: c.avgPrice,
    color: "var(--series-blue)",
    valueLabel: formatCurrency(Math.round(c.avgPrice)),
    tooltip: `${c.optionCount} option${c.optionCount > 1 ? "s" : ""} · from ${formatCurrency(c.minPrice)}`,
  }));

  const typeData: BarDatum[] = typeAgg
    .sort((a, b) => a.avgPerKwp - b.avgPerKwp)
    .map((t) => ({
      key: t.inverterType,
      label: t.inverterType,
      value: t.avgPerKwp,
      color: INVERTER_TYPE_STYLES[t.inverterType as InverterType].chartColor,
      valueLabel: formatCurrency(Math.round(t.avgPerKwp)),
      tooltip: `${t.count} quotation${t.count > 1 ? "s" : ""} averaged`,
    }));

  const cheapestData: BarDatum[] = cheapestAgg
    .sort((a, b) => a.quote.price - b.quote.price)
    .map((c) => ({
      key: c.inverterType,
      label: c.inverterType,
      value: c.quote.price,
      color: INVERTER_TYPE_STYLES[c.inverterType as InverterType].chartColor,
      valueLabel: formatCurrency(c.quote.price),
      tooltip: `${c.quote.company} · ${c.count} option${c.count > 1 ? "s" : ""} in category`,
    }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Average Price by Company" subtitle="Lower is better · averaged across each company's submitted options">
        <HorizontalBarList data={companyData} ariaLabel="Average price by company" />
      </ChartCard>
      <ChartCard title="Avg. LKR / kWp by Inverter Type" subtitle="Cost efficiency per installed kWp by inverter type">
        <HorizontalBarList data={typeData} ariaLabel="Average price per kWp by inverter type" />
      </ChartCard>
      <ChartCard
        title="Cheapest Option by Inverter Type"
        subtitle="Lowest priced quotation within each inverter type"
        className="lg:col-span-2"
      >
        <HorizontalBarList data={cheapestData} ariaLabel="Cheapest price by inverter type" />
      </ChartCard>
    </div>
  );
}
