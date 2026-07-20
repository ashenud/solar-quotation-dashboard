import { useMemo, useState } from "react";
import rawQuotes from "./data/quotes.json";
import type { Filters, Quote, SortKey } from "./types";
import { withMetrics, summarize } from "./utils/analysis";
import { useTheme } from "./hooks/useTheme";
import { FilterBar } from "./components/FilterBar";
import { QuoteTable } from "./components/QuoteTable";
import { StatTiles } from "./components/StatTiles";
import { AnalysisSection } from "./components/AnalysisSection";
import { ThemeToggle } from "./components/ThemeToggle";

const quotes = withMetrics(rawQuotes as Quote[]);

const EMPTY_FILTERS: Filters = { company: "", inverterType: "", inverterBrand: "", panelBrand: "", battery: "" };

export default function App() {
  const [theme, setTheme] = useTheme();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredRows = useMemo(() => {
    return quotes.filter(
      (q) =>
        (!filters.company || q.company === filters.company) &&
        (!filters.inverterType || q.inverterType === filters.inverterType) &&
        (!filters.inverterBrand || q.inverterBrand.includes(filters.inverterBrand)) &&
        (!filters.panelBrand || q.panelBrand.includes(filters.panelBrand)) &&
        (!filters.battery || q.battery.includes(filters.battery))
    );
  }, [filters]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const diff = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortAsc ? diff : -diff;
    });
    return rows;
  }, [filteredRows, sortKey, sortAsc]);

  const analysisRows = filteredRows.length ? filteredRows : quotes;
  const stats = useMemo(() => summarize(analysisRows), [analysisRows]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((asc) => !asc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Solar Quotation Comparison
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            5kW+ rooftop solar options across {stats.companyCount} companies. Click column headers to sort, use the
            filters to narrow down, and check the analysis below for a wider comparison.
          </p>
        </div>
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>

      <section className="mb-6">
        <StatTiles stats={stats} />
      </section>

      <section className="mb-4">
        <FilterBar quotes={quotes} filters={filters} onChange={setFilters} />
      </section>

      <section className="mb-8">
        <QuoteTable rows={sortedRows} sortKey={sortKey} sortAsc={sortAsc} onSort={handleSort} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Analysis</h2>
        <AnalysisSection quotes={analysisRows} />
      </section>

      <footer className="border-t border-[var(--border)] pt-4 text-xs text-[var(--text-muted)]">
        Data reflects vendor quotations collected as of Jul 2026. Prices in LKR, excluding any additional discounts
        noted per option.
      </footer>
    </div>
  );
}
