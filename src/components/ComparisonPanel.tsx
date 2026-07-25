import type { QuoteWithMetrics } from "../types";
import { formatNumber } from "../utils/format";
import { INVERTER_TYPE_STYLES } from "../utils/inverterTypeColors";

interface ComparisonPanelProps {
  quotes: QuoteWithMetrics[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  limit: number;
}

interface Row {
  label: string;
  render: (q: QuoteWithMetrics) => React.ReactNode;
  highlightMin?: (q: QuoteWithMetrics) => number;
}

const ROWS: Row[] = [
  { label: "Company", render: (q) => q.company },
  { label: "Option", render: (q) => q.option },
  { label: "Inverter", render: (q) => q.inverterBrand.join(" / ") },
  {
    label: "Type",
    render: (q) => (
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${INVERTER_TYPE_STYLES[q.inverterType].badgeBg} ${INVERTER_TYPE_STYLES[q.inverterType].badgeText}`}
      >
        {q.inverterType}
      </span>
    ),
  },
  { label: "Panel", render: (q) => q.panel },
  { label: "Capacity (kWp)", render: (q) => q.capacity },
  { label: "Battery", render: (q) => q.battery },
  {
    label: "Price (LKR)",
    render: (q) => formatNumber(q.price),
    highlightMin: (q) => q.price,
  },
  {
    label: "LKR / kWp",
    render: (q) => formatNumber(q.perKwp),
    highlightMin: (q) => q.perKwp,
  },
];

export function ComparisonPanel({ quotes, onRemove, onClearAll, limit }: ComparisonPanelProps) {
  if (quotes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Compare Quotations</h2>
          <p className="text-xs text-[var(--text-muted)]">
            {quotes.length} of {limit} selected · lowest value in each row is highlighted
          </p>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--series-red)] hover:text-[var(--series-red)]"
        >
          Clear comparison
        </button>
      </div>

      {quotes.length === 1 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          Select at least one more quotation from the table to compare.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <tbody>
              <tr>
                <th className="sticky left-0 w-32 bg-[#1f1e1c] px-3 py-2.5 text-left align-top font-medium text-white">
                  Quotation
                </th>
                {quotes.map((q) => (
                  <th key={q.id} className="min-w-[10rem] bg-[#1f1e1c] px-3 py-2.5 text-left align-top font-medium text-white">
                    <div className="flex items-start justify-between gap-2">
                      <span>{q.company}</span>
                      <button
                        type="button"
                        onClick={() => onRemove(q.id)}
                        aria-label={`Remove ${q.company} from comparison`}
                        className="shrink-0 rounded px-1 text-white/60 hover:bg-white/10 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
              {ROWS.map((row, i) => {
                const minValue = row.highlightMin ? Math.min(...quotes.map(row.highlightMin)) : undefined;
                return (
                  <tr key={row.label} className={i % 2 === 1 ? "bg-[var(--gridline)]/30" : ""}>
                    <td className="sticky left-0 border-t border-[var(--border)] bg-[var(--surface-1)] px-3 py-2.5 align-top text-xs font-medium text-[var(--text-muted)]">
                      {row.label}
                    </td>
                    {quotes.map((q) => {
                      const isMin = row.highlightMin && row.highlightMin(q) === minValue;
                      return (
                        <td
                          key={q.id}
                          className={`border-t border-[var(--border)] px-3 py-2.5 align-top ${isMin ? "bg-[var(--status-good)]/10 font-semibold" : ""}`}
                        >
                          {row.render(q)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
