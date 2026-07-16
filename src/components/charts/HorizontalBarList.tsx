import { useState } from "react";

export interface BarDatum {
  key: string;
  label: string;
  value: number;
  color: string;
  valueLabel: string;
  tooltip?: string;
}

interface HorizontalBarListProps {
  data: BarDatum[];
  ariaLabel: string;
}

export function HorizontalBarList({ data, ariaLabel }: HorizontalBarListProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className="flex flex-col gap-2.5" role="img" aria-label={ariaLabel}>
      {data.map((d) => {
        const widthPct = (d.value / max) * 100;
        const isHovered = hovered === d.key;
        return (
          <li
            key={d.key}
            className="group relative flex items-center gap-3"
            onMouseEnter={() => setHovered(d.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="w-36 shrink-0 truncate text-xs text-[var(--text-secondary)]" title={d.label}>
              {d.label}
            </span>
            <div className="relative h-4 flex-1 rounded-sm bg-[var(--gridline)]/50">
              <div
                className="h-4 rounded-r-[4px] transition-[width] duration-300"
                style={{ width: `${widthPct}%`, backgroundColor: d.color }}
              />
              {isHovered && d.tooltip && (
                <div className="pointer-events-none absolute left-0 top-full z-10 mt-1.5 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] shadow-lg">
                  {d.tooltip}
                </div>
              )}
            </div>
            <span className="w-28 shrink-0 text-right text-xs font-medium tabular-nums text-[var(--text-primary)]">
              {d.valueLabel}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
