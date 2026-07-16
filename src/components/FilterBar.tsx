import type { Filters, QuoteWithMetrics } from "../types";

interface FilterBarProps {
  quotes: QuoteWithMetrics[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function uniqueSorted<T>(values: T[]): T[] {
  return [...new Set(values)].sort();
}

const BATTERY_OPTIONS: Array<{ value: Filters["battery"]; label: string }> = [
  { value: "", label: "All Battery Status" },
  { value: "Not included", label: "Not included" },
  { value: "N/A", label: "N/A" },
  { value: "Included", label: "Included" },
];

function Select({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-xs font-medium text-[var(--text-secondary)]">
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[10rem] rounded-md border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-sm outline-none transition-colors hover:border-[var(--series-blue)] focus:border-[var(--series-blue)] focus:ring-2 focus:ring-[var(--series-blue)]/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ quotes, filters, onChange }: FilterBarProps) {
  const companies = uniqueSorted(quotes.map((q) => q.company));
  const types = uniqueSorted(quotes.map((q) => q.inverterType));
  const brands = uniqueSorted(quotes.map((q) => q.inverterBrand));

  const hasActiveFilters = filters.company || filters.inverterType || filters.inverterBrand || filters.battery;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] p-4">
      <Select
        id="fCompany"
        label="Company"
        value={filters.company}
        onChange={(v) => onChange({ ...filters, company: v })}
        options={[{ value: "", label: "All Companies" }, ...companies.map((c) => ({ value: c, label: c }))]}
      />
      <Select
        id="fType"
        label="Inverter Type"
        value={filters.inverterType}
        onChange={(v) => onChange({ ...filters, inverterType: v })}
        options={[{ value: "", label: "All Inverter Types" }, ...types.map((t) => ({ value: t, label: t }))]}
      />
      <Select
        id="fBrand"
        label="Inverter Brand"
        value={filters.inverterBrand}
        onChange={(v) => onChange({ ...filters, inverterBrand: v })}
        options={[{ value: "", label: "All Inverter Brands" }, ...brands.map((b) => ({ value: b, label: b }))]}
      />
      <Select
        id="fBattery"
        label="Battery Status"
        value={filters.battery}
        onChange={(v) => onChange({ ...filters, battery: v as Filters["battery"] })}
        options={BATTERY_OPTIONS}
      />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ company: "", inverterType: "", inverterBrand: "", battery: "" })}
          className="rounded-md border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--series-red)] hover:text-[var(--series-red)]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
