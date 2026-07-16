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
  "inverterBrand": "Huawei",
  "inverterType": "Hybrid",
  "panel": "Jinko Bifacial 640W x8",
  "capacity": 5.12,
  "battery": "Not included",
  "price": 850000
}
```

- `id` must be unique.
- `inverterType` should be either `"Hybrid"` or `"On-grid"` (drives the badge
  colors and the type-comparison chart).
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
    FilterBar.tsx           # company / type / brand / battery filters
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
GitHub Pages automatically on every push to `main`. In the repository
settings, set **Pages → Source** to **GitHub Actions**. The Vite `base` path
in `vite.config.ts` is set to `/solar-quotation-dashboard/` to match this
repo's Pages URL — update it if the repo is renamed or forked.
