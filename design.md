# Design — PT. Mardawa Intiguna Persada

A locked design system for this marketing site. Every page redesign reads this file first.
Stamp: `/* Hallmark · design-system: design.md · designed-as-app */`

## Genre
modern-minimal (IT consultant / B2B, restrained)

## Macrostructure family
- Marketing (`/`): Split Marquee — type left, proof strip right; services as index list/cards, not icon-tile SaaS default
- Directory (`/klien`, `/produk`, `/layanan`, `/video`): Workbench catalog — dense grid, hairline cards
- Content (`/tentang-kami`, `/artikel/*`, `/berita/*`, detail slugs): Long Document — ~65ch measure, clear type ladder
- Shell (`/foto`, `/pelatihan`, `/learn-with-mardawa`): shared chrome + EmptyState

## Theme
**Sourced from live site** `https://dev.mardawa.id/` (HTML `:root` sand scale + beranda brand blues).

Note: Tailwind config on live site also lists `primary: #5A45FF`, but the public marketing UI actually paints **sky brand** (`#008ED6` / gradient to `#0066A6`, `theme-color: #0ea5e9`). We follow the painted UI.

### Neutrals (exact live `--sand-*`)
- `--sand-1`  `#fdfdfc` → paper
- `--sand-2`  `#f9f9f8` → paper-2
- `--sand-3`  `#f1f0ef` → paper-3
- `--sand-4`  `#e9e8e6` → rule
- `--sand-9`  `#8d8d86` → muted
- `--sand-11` `#63635e` → ink-2
- `--sand-12` `#21201c` → ink

### Brand blues (exact live beranda classes)
- `--brand`       `#008ED6`  (primary fill / accent)
- `--brand-mid`   `#007ABC`
- `--brand-dark`  `#0066A6`  (hover / gradient end)
- `--brand-theme` `#0ea5e9`  (meta theme-color)
- `--brand-soft`  `#e0f2fe`

### Semantic mapping
- `--color-accent` = `--brand` (`#008ED6`)
- `--color-accent-ink` = `#ffffff`
- `--color-focus` = `--brand`

Axes: paper light · display geometric-sans · accent cool-sky

## Typography
- Display + body: Instrument Sans (existing brand) — weight ladder, never italic headers
- Display: 600–700, tracking -0.03em
- Body: 400–500, leading 1.6
- Mono: ui-monospace (labels only, sparingly)
- Display clamp: `clamp(2.25rem, 4vw + 1rem, 3.75rem)` for home H1

## Spacing
4-pt scale in `tokens.css`. Sections use `--space-2xl` / `--space-3xl` vertical rhythm.

## Motion
- None by default (composed page)
- Interactive: opacity/transform only, `--ease-out`, ≤ 220ms
- `prefers-reduced-motion: reduce` → opacity ≤ 150ms

## Microinteractions stance
- Silent success; no celebratory toasts
- Hover delay 0 on buttons; focus ring instant
- Cards: hairline border → slight lift (translateY -1px), no heavy shadows

## CTA voice
- Primary: solid accent fill, 999px pill, ink-on-accent white
- Secondary: hairline border, paper fill, ink text
- Pattern: short verbs — “Hubungi Kami”, “WhatsApp”, “Email”

## Chrome
- Nav: floating pill bar (detached from edges on md+), blur, soft shadow — not AI sticky full-bleed
- Footer: statement line + compact link row (not 4-column dump)
- WhatsApp FAB retained (green brand for channel recognition)

## What pages MUST share
- Wordmark “PT. Mardawa / Intiguna Persada”
- Accent + fonts + CTA voice
- Section heading: optional tiny mono label above H2 (max 1–2 per page), stacked vertical — never hanging label-left
- Container: max-width 72rem, horizontal padding `--space-md`

## What pages MAY differ on
- Macrostructure within family
- Hero density (home split vs page hero single column)
- Enrichment: none (typography + real YouTube thumbs only)

## Exports
See `tokens.css` at project root (source of truth for CSS variables).
