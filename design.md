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
Custom OKLCH anchored on brand violet `#5A45FF`.

- `--color-paper`     oklch(99% 0.004 95)
- `--color-paper-2`   oklch(97% 0.006 95)
- `--color-paper-3`   oklch(94% 0.008 95)
- `--color-ink`       oklch(22% 0.012 80)
- `--color-ink-2`     oklch(42% 0.01 80)
- `--color-muted`     oklch(55% 0.01 80)
- `--color-rule`      oklch(90% 0.006 95)
- `--color-accent`    oklch(52% 0.24 285)   /* ≈ #5A45FF */
- `--color-accent-ink` oklch(99% 0 0)
- `--color-focus`     oklch(52% 0.24 285)

Axes: paper light · display geometric-sans · accent cool-violet

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
