import type { QuoteWithMetrics, SortKey } from "../types";
import { formatNumber } from "../utils/format";
import { INVERTER_TYPE_STYLES } from "../utils/inverterTypeColors";

interface Column {
  key: SortKey;
  label: string;
  numeric?: boolean;
}

const COLUMNS: Column[] = [
  { key: "company", label: "Company" },
  { key: "option", label: "Option" },
  { key: "inverterBrand", label: "Inverter" },
  { key: "inverterType", label: "Type" },
  { key: "panel", label: "Panel" },
  { key: "capacity", label: "Capacity (kWp)", numeric: true },
  { key: "battery", label: "Battery" },
  { key: "price", label: "Price (LKR)", numeric: true },
  { key: "perKwp", label: "LKR / kWp", numeric: true },
];

interface QuoteTableProps {
  rows: QuoteWithMetrics[];
  sortKey: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}

export function QuoteTable({ rows, sortKey, sortAsc, onSort }: QuoteTableProps) {
  const minPrice = rows.length ? Math.min(...rows.map((r) => r.price)) : 0;

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const active = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  aria-sort={active ? (sortAsc ? "ascending" : "descending") : "none"}
                  className={`cursor-pointer select-none whitespace-nowrap bg-[#1f1e1c] px-3 py-2.5 text-left font-medium text-white transition-colors hover:bg-[#33322f] ${
                    col.numeric ? "text-right" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <span className={`text-[10px] ${active ? "opacity-90" : "opacity-30"}`}>
                      {active ? (sortAsc ? "▲" : "▼") : "↕"}
                    </span>
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((d, i) => (
            <tr
              key={d.id}
              className={`${i % 2 === 1 ? "bg-[var(--gridline)]/30" : ""} ${
                d.price === minPrice ? "bg-[var(--status-good)]/10" : ""
              }`}
            >
              <td className="border-t border-[var(--border)] px-3 py-2.5 align-top">{d.company}</td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 align-top">{d.option}</td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 align-top">{d.inverterBrand.join(" / ")}</td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 align-top">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${INVERTER_TYPE_STYLES[d.inverterType].badgeBg} ${INVERTER_TYPE_STYLES[d.inverterType].badgeText}`}
                >
                  {d.inverterType}
                </span>
              </td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 align-top">{d.panel}</td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 text-right align-top tabular-nums">
                {d.capacity}
              </td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 align-top text-xs text-[var(--text-secondary)]">
                {d.battery}
              </td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 text-right align-top font-semibold tabular-nums">
                {formatNumber(d.price)}
                {d.price === minPrice && (
                  <span className="ml-1.5 inline-block rounded-full bg-[var(--status-good)]/15 px-1.5 py-0.5 align-middle text-[10px] font-medium text-[var(--status-good)]">
                    Lowest
                  </span>
                )}
              </td>
              <td className="border-t border-[var(--border)] px-3 py-2.5 text-right align-top tabular-nums">
                {formatNumber(d.perKwp)}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="px-3 py-8 text-center text-[var(--text-muted)]">
                No quotations match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
