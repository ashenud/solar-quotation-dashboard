# Solar Quotation Comparison

A static dashboard for comparing rooftop solar quotations — sortable/filterable
table plus a small analysis panel (average price by company, cost efficiency by
inverter type). Built with React + TypeScript + Vite + Tailwind CSS, deployable
to GitHub Pages as a fully static site.

## Updating the data

All quotation data lives in [`src/data/quotes.json`](src/data/quotes.json) — a
plain JSON array, no code changes required to add, edit, or remove a quote.

Each entry looks like:

```json
{
  "id": "unique-slug",
  "company": "Company Name",
  "option": "Description of the package",
  "inverterBrand": ["Huawei"],
  "inverterType": "Hybrid",
  "panel": "Jinko Bifacial 640W x8",
  "panelBrand": ["Jinko"],
  "capacity": 5.12,
  "battery": "Not included",
  "price": 850000
}
```

- `id` must be unique.
- `inverterBrand` and `panelBrand` are arrays — most quotes have one brand,
  but some vendors quote a system as compatible with several interchangeable
  brands (e.g. `["Solis", "GoodWe", "Huawei", "Deye"]`); list every brand and
  the filters/table will match on any of them.
- `inverterType` should be `"Hybrid"`, `"On-grid"`, or `"Off-grid"` (drives the
  badge colors and the type-comparison charts — colors for a new type come
  from `src/utils/inverterTypeColors.ts`).
- `panel` stays a free-text description for display; `panelBrand` is the
  filterable brand list extracted from it.
- `capacity` is in kWp; `price` is in LKR. `LKR/kWp` and all analysis figures
  are derived automatically — don't add them to the JSON.

The dataset currently shipped is the original vendor quotation set collected
as of July 2026, kept unmodified as the initial data source.

## Project structure

```
src/
  data/quotes.json        # data source — edit this to update quotes
  types.ts                 # shared TypeScript types
  utils/
    analysis.ts            # aggregation (per-kWp, stats, company/type rollups)
    format.ts               # currency/number formatting
  components/
    FilterBar.tsx           # company / type / inverter brand / panel brand / battery filters
    QuoteTable.tsx           # sortable comparison table
    StatTiles.tsx            # summary stat cards
    AnalysisSection.tsx      # chart cards
    charts/HorizontalBarList.tsx
  App.tsx                  # page composition + filter/sort state
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes `dist/` to
GitHub Pages automatically on every push to `master`. In the repository
settings, set **Pages → Source** to **GitHub Actions** (not "Deploy from a
branch" — that runs GitHub's legacy Jekyll pipeline instead and will
overwrite the build with raw source). The Vite `base` path
in `vite.config.ts` is set to `/solar-quotation-dashboard/` to match this
repo's Pages URL — update it if the repo is renamed or forked.
