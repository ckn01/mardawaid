# Design: PT. Mardawa Intiguna Persada — Astro Static Site

**Date:** 2026-07-25  
**Status:** Approved (design sections 1–4)  
**Source of truth for content:** live site `https://dev.mardawa.id/` (Inertia/Vue + backend)  
**Target host:** Cloudflare Pages — pure static assets only (not Workers, not Workflows)

## 1. Goal

Rebuild the company website for **PT. Mardawa Intiguna Persada** as a multi-page **Astro** site with **static build** output, deployable on **Cloudflare Pages**.

- Full route parity with the current marketing site
- Content fidelity from the live site (copy, lists, contacts)
- Modern UI (not a pixel clone)
- Content managed in-repo (Markdown + JSON)
- Contact via WhatsApp + mailto only (no form backend)

## 2. Non-goals (v1)

- Admin CMS / headless CMS
- Server-side forms, chat support backend, or session auth
- Cloudflare Workers, Workflows, D1, SSR adapter
- Pixel-perfect clone of the Vue/Inertia UI
- Real-time data from the old API

## 3. Decisions (locked)

| Topic | Choice |
|-------|--------|
| Scope | **A — Full parity** (all live marketing routes) |
| Visual | **A — Content fidelity + modern UI** |
| Content | **A — Markdown + JSON in repo** |
| Contact | **A — WhatsApp + mailto only** |
| Architecture | Astro multi-page + Content Collections + Tailwind, `output: 'static'` |

## 4. Routes

| Route | Content source | Notes |
|-------|----------------|-------|
| `/` | Home aggregates from JSON + latest articles | Sections below |
| `/tentang-kami` | about + team + maps | 14 team members, 2 map embeds |
| `/klien` | `clients.json` | 20 clients |
| `/layanan` | `services-portfolio.json` (DOSIS, SIL DLH, SOLUSI) | List + optional `/layanan/[slug]` |
| `/produk` | `products.json` | 9 portfolio products + `/produk/[slug]` |
| `/pelatihan` | empty list OK | EmptyState |
| `/foto` | empty gallery OK | EmptyState |
| `/video` | `videos.json` | YouTube embeds/thumbnails |
| `/artikel` | Content Collection `artikel` | List |
| `/artikel/[slug]` | MD body | Detail |
| `/berita` | Content Collection `berita` | May be empty |
| `/berita/[slug]` | MD body | Detail when present |
| `/learn-with-mardawa` | static list/empty | Empty OK |

**Out of scope routes:** login, admin, API, chat form endpoints.

### Home sections (order)

1. Hero  
2. Tentang (short)  
3. Pelayanan Kami (4 consultant services)  
4. Klien Kami (grid/logos)  
5. Artikel/berita teaser  
6. Testimoni — **hidden by default** until non-dummy data  
7. Video teaser  
8. CTA band  

## 5. Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5, `output: 'static'` |
| CSS | Tailwind CSS (Astro integration / Vite plugin) |
| Structured content | Astro Content Collections + Zod (`artikel`, `berita`) |
| Structured data | JSON under `src/data/` |
| Font | Instrument Sans (familiarity with current brand) |
| Brand accent | Primary `#5A45FF` on sand/slate neutrals |
| Icons | Minimal inline SVG or lightweight icon set |
| JS islands | Default zero; islands only if carousel/modal needs it |
| Deploy | Cloudflare Pages → build `npm run build`, output `dist` |
| Adapter | **None** |

## 6. Repository structure

```
mardawaid/
├── public/
│   ├── favicon.ico
│   ├── images/
│   ├── _headers          # cache + security headers for Pages
│   └── _redirects        # optional
├── src/
│   ├── components/
│   ├── content/
│   │   ├── artikel/
│   │   └── berita/
│   ├── content.config.ts
│   ├── data/
│   │   ├── site.json
│   │   ├── services.json          # home “Pelayanan Kami” (4 items)
│   │   ├── services-portfolio.json # /layanan catalog
│   │   ├── clients.json
│   │   ├── team.json
│   │   ├── products.json
│   │   ├── videos.json
│   │   ├── maps.json
│   │   └── testimonials.json      # present; UI gated
│   ├── layouts/BaseLayout.astro
│   ├── pages/                     # mirrors routes above
│   ├── styles/global.css
│   └── utils/
├── astro.config.mjs
├── package.json
├── README.md
└── docs/superpowers/specs/...
```

## 7. Data contracts (seed from live site)

### `site.json`

- Company: `PT. Mardawa Intiguna Persada`
- Tagline/description: IT consulting, design & information technology
- Email: `admin@mardawa.id`
- WhatsApp: `6281220095453` → `https://wa.me/6281220095453`
- Instagram: `https://www.instagram.com/mardawa.id/`
- YouTube: `https://www.youtube.com/@MardawaIntigunaPersada`
- Nav config matching current labels (Beranda, Tentang Kami, Klien & Mitra, Galeri, Portofolio, Blog, Learn With Mardawa)

### Home consultant services (`services.json`)

1. Website/Portal  
2. Sistem Informasi Manajemen  
3. Aplikasi Mobile / Android  
4. Data Warehouse  

(Copy from live props.)

### Clients

20 institutions/companies (names from live; logos optional → initial-letter fallback).

### Team (`/tentang-kami`)

14 people with `name` + `title` (Komisaris, Direktur, Manajer, Staff, …).

### Maps

- **Kantor:** Gedung Setiabudi 2, lt 2 suite 207 B-C, Jl. H.R Rasuna Said Kav.62 — Kuningan, Jakarta Selatan  
- **Workshop:** Jl. H. Arsyad No.55, RT.2/RW.7, Grogol Utara, Kebayoran Lama, Jakarta Selatan  
- Google Maps embed `src` preserved from live site.

### Products (`/produk`)

Include at least: Sistem Informasi Pendidikan (SIP), multiple “Web Sekolah …”, Mantap SPMB Online, etc. (slugs normalized for URLs).

### Layanan portfolio (`/layanan`)

Document Tracker Information System (Dosis), SIL DLH, SOLUSI.

### Videos

Three YouTube URLs (company profile + gatherings). Thumbnails via `img.youtube.com/vi/{id}/hqdefault.jpg`.

### Articles

Seed 3–4 Markdown files from live article titles/descriptions. Full body may be thin initially; structure ready for expansion.

### Testimonials

JSON seeded from live data but treated as **dummy** (“Hariono / SIUUUU”). Home section **off** until `site.json` flag or non-empty curated list with `published: true`.

## 8. UI / components

### Visual principles

- Max content width ~1120–1200px  
- Alternating sand/white section backgrounds  
- Sticky header; desktop dropdowns; mobile hamburger  
- Cards: soft border, medium radius, light hover  
- Accessible focus states, `lang="id"`  
- Empty states for empty collections  

### Core components

`BaseLayout`, `Header`, `Footer`, `Hero`, `SectionAbout`, `ServiceGrid`, `ClientGrid`, `ArticleCard`, `VideoCard`, `TeamGrid`, `MapEmbed`, `ProductCard`, `CtaBand`, `WhatsAppButton`, `EmptyState`.

### SEO

- Title template: `%s | PT. Mardawa Intiguna Persada`  
- Per-page meta description  
- Open Graph basics  
- JSON-LD `Organization` in layout  

## 9. Contact UX

- Primary CTA: open WhatsApp with optional prefilled greeting  
- Secondary: `mailto:admin@mardawa.id`  
- No server-side form posting in v1  
- Floating WhatsApp button on all pages  

## 10. Cloudflare Pages deploy

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 or 22 LTS |
| Framework | Astro (static) |
| SSR / Workers binding | none |

Local:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Optional `public/_headers`: long-cache for `/_astro/*`, basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, etc.).

Domain cutover (`dev.mardawa.id`) happens after preview validation; DNS change is an ops step outside the app code.

## 11. Quality bar

- All in-scope routes return 200 (empty lists allowed)  
- Mobile nav + dropdowns usable  
- `npm run build` succeeds with no errors  
- Prefer little/no client JS  
- Seed content from live site, not lorem  
- Images: local `public/` or YouTube thumbs; path `mardawa/...` from old storage replaced by fallbacks  

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Old image storage not portable | Placeholders / initials; manually copy critical assets |
| Dummy testimonials | Feature-flagged off |
| Thin article bodies | MD structure ready; edit later via git |
| DNS still on old app | Deploy Pages preview first, then point domain |
| Scope creep (CMS, forms) | Explicit non-goals |

## 13. Implementation order

1. Scaffold Astro + Tailwind + BaseLayout / Header / Footer  
2. `site.json` + all data JSON + article MD seeds  
3. Home page sections  
4. Subpages (tentang, klien, layanan, produk, galeri, blog, learn, pelatihan)  
5. SEO, `_headers`, empty states, WhatsApp CTA  
6. Build verification + README (edit content + Pages deploy)  

## 14. Success criteria

- Static `dist/` deployable on Cloudflare Pages without Workers  
- Marketing routes match parity table  
- Content editable via git (JSON/MD)  
- Contact path works (WA + email)  
- Visual modern, readable, mobile-first, brand-recognizable (`#5A45FF`, Instrument Sans)  
