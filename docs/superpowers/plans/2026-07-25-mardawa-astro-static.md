# Mardawa Astro Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild PT. Mardawa Intiguna Persada company site as Astro static multi-page output deployable on Cloudflare Pages (no Workers/Workflows).

**Architecture:** Astro 5 `output: 'static'` + Tailwind + Content Collections (artikel/berita) + JSON data files. Shared `BaseLayout` with Header/Footer/WhatsApp. Routes mirror live `dev.mardawa.id`. Contact is WhatsApp + mailto only.

**Tech Stack:** Astro 5, Tailwind CSS 4 (or 3 via `@astrojs/tailwind` if TW4 integration flakes), TypeScript, Cloudflare Pages static (`dist/`).

**Spec:** `docs/superpowers/specs/2026-07-25-mardawa-astro-static-design.md`

**Seed data:** `docs/superpowers/plans/assets/mardawa-seed/` (copy into `src/data/` and article frontmatter as instructed).

## Global Constraints

- `output: 'static'` only — **no** `@astrojs/cloudflare` adapter, no Workers, no Workflows
- Content in-repo only (JSON + Markdown)
- Contact: WhatsApp `6281220095453` + `mailto:admin@mardawa.id` — no form backend
- Brand primary: `#5A45FF`; font: Instrument Sans; `lang="id"`
- Testimonials section **hidden** until curated non-dummy data
- Empty lists (berita, foto, pelatihan, learn) show `EmptyState`, still 200
- Prefer zero client JS; islands only if unavoidable
- Frequent commits after each task
- Verify with `npm run build` (must exit 0) and inspect `dist/` paths

---

## File map (create)

```
package.json
astro.config.mjs
tsconfig.json
.gitignore
.nvmrc                          # 22
public/favicon.svg
public/_headers
public/images/.gitkeep
src/styles/global.css
src/content.config.ts
src/data/site.json
src/data/services.json
src/data/services-portfolio.json
src/data/clients.json
src/data/team.json
src/data/products.json
src/data/videos.json
src/data/maps.json
src/data/testimonials.json
src/utils/youtube.ts
src/utils/site.ts
src/layouts/BaseLayout.astro
src/components/Header.astro
src/components/Footer.astro
src/components/WhatsAppButton.astro
src/components/Hero.astro
src/components/SectionAbout.astro
src/components/ServiceGrid.astro
src/components/ClientGrid.astro
src/components/ArticleCard.astro
src/components/VideoCard.astro
src/components/TeamGrid.astro
src/components/MapEmbed.astro
src/components/ProductCard.astro
src/components/CtaBand.astro
src/components/EmptyState.astro
src/components/PageHero.astro
src/pages/index.astro
src/pages/tentang-kami.astro
src/pages/klien.astro
src/pages/layanan/index.astro
src/pages/layanan/[slug].astro
src/pages/produk/index.astro
src/pages/produk/[slug].astro
src/pages/pelatihan.astro
src/pages/foto.astro
src/pages/video.astro
src/pages/artikel/index.astro
src/pages/artikel/[slug].astro
src/pages/berita/index.astro
src/pages/berita/[slug].astro
src/pages/learn-with-mardawa.astro
src/content/artikel/*.md        # 4 seeds
src/content/berita/.gitkeep
README.md
```

---

### Task 1: Scaffold Astro + Tailwind + base config

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.nvmrc`, `src/styles/global.css`, `src/pages/index.astro` (temp), `public/favicon.svg`

**Interfaces:**
- Produces: runnable `npm run dev` / `npm run build` with Tailwind working

- [ ] **Step 1: Scaffold project in repo root**

Repo already has `docs/` and git. Create Astro app **in place** (not nested folder):

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict --yes
```

If interactive prompt blocks, manual package.json is OK (next step).

- [ ] **Step 2: Ensure package.json scripts**

```json
{
  "name": "mardawaid",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

Install deps:

```bash
npm install
npx astro add tailwind --yes
```

If `astro add tailwind` fails, install manually:

```bash
npm install @tailwindcss/vite tailwindcss
```

and wire Vite plugin in `astro.config.mjs`.

- [ ] **Step 3: `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://dev.mardawa.id',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

(If using `@astrojs/tailwind` integration instead, use that integration and omit the vite plugin — either is fine; keep `output: 'static'`.)

- [ ] **Step 4: `.nvmrc` + `.gitignore`**

`.nvmrc`:
```
22
```

Ensure `.gitignore` includes: `node_modules/`, `dist/`, `.astro/`, `.env`, `.DS_Store`.

- [ ] **Step 5: Global CSS**

`src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #5a45ff;
  --color-primary-dark: #4630e0;
  --color-sand-1: #fdfdfc;
  --color-sand-2: #f9f9f8;
  --color-sand-3: #f1f0ef;
  --color-sand-12: #21201c;
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-sand-1 text-sand-12 font-sans antialiased;
}

:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}
```

- [ ] **Step 6: Temporary index + favicon, verify build**

`src/pages/index.astro`:

```astro
---
import '../styles/global.css';
---
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PT. Mardawa Intiguna Persada</title>
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
  </head>
  <body class="p-8">
    <h1 class="text-3xl font-semibold text-primary">Mardawa scaffold OK</h1>
  </body>
</html>
```

`public/favicon.svg` — simple purple square with “M”.

```bash
npm run build
```

Expected: exit 0, `dist/index.html` exists.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro static + Tailwind"
```

---

### Task 2: Site data + utils + BaseLayout shell

**Files:**
- Create: `src/data/site.json`, `src/utils/site.ts`, `src/utils/youtube.ts`, `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` to use BaseLayout

**Interfaces:**
- Produces: `getSite()` → site config; `youtubeId(url)` / `youtubeThumb(url)` / `youtubeEmbed(url)`
- Produces: `BaseLayout` props `{ title: string; description?: string }`

- [ ] **Step 1: `src/data/site.json`**

```json
{
  "name": "PT. Mardawa Intiguna Persada",
  "shortName": "Mardawa",
  "tagline": "Perusahaan Konsultan IT dengan pengalaman di bidang pengembangan aplikasi",
  "description": "PT. Mardawa Intiguna Persada adalah perusahaan konsultan IT yang memberikan pelayanan jasa konsultasi desain dan teknologi informasi. Kami berkomitmen untuk memberikan solusi inovatif untuk memenuhi kebutuhan era teknologi yang terus berkembang.",
  "email": "admin@mardawa.id",
  "whatsapp": "6281220095453",
  "whatsappMessage": "Halo Admin Mardawa, saya ingin bertanya seputar layanan IT.",
  "social": {
    "instagram": "https://www.instagram.com/mardawa.id/",
    "youtube": "https://www.youtube.com/@MardawaIntigunaPersada"
  },
  "showTestimonials": false,
  "nav": [
    { "label": "Beranda", "href": "/" },
    { "label": "Tentang Kami", "href": "/tentang-kami" },
    { "label": "Klien & Mitra", "href": "/klien" },
    {
      "label": "Galeri",
      "children": [
        { "label": "Foto", "href": "/foto" },
        { "label": "Video", "href": "/video" }
      ]
    },
    {
      "label": "Portofolio",
      "children": [
        { "label": "Produk", "href": "/produk" },
        { "label": "Pelatihan", "href": "/pelatihan" },
        { "label": "Layanan", "href": "/layanan" }
      ]
    },
    {
      "label": "Blog",
      "children": [
        { "label": "Artikel", "href": "/artikel" },
        { "label": "Berita", "href": "/berita" }
      ]
    },
    { "label": "Learn With Mardawa", "href": "/learn-with-mardawa" }
  ]
}
```

- [ ] **Step 2: Utils**

`src/utils/site.ts`:

```ts
import site from '../data/site.json';

export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export type SiteConfig = typeof site & {
  nav: NavItem[];
};

export function getSite(): SiteConfig {
  return site as SiteConfig;
}

export function waLink(message?: string): string {
  const text = encodeURIComponent(message ?? site.whatsappMessage);
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function mailtoLink(): string {
  return `mailto:${site.email}`;
}
```

`src/utils/youtube.ts`:

```ts
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/embed\/([^/]+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

export function youtubeThumb(url: string): string {
  const id = youtubeId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : '/images/placeholder.svg';
}

export function youtubeEmbed(url: string): string | null {
  const id = youtubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
```

- [ ] **Step 3: `BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { getSite } from '../utils/site';

interface Props {
  title?: string;
  description?: string;
}

const site = getSite();
const { title, description = site.description } = Astro.props;
const fullTitle = title ? `${title} | ${site.name}` : site.name;
const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="author" content={site.name} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta name="theme-color" content="#5A45FF" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
    <title>{fullTitle}</title>
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": site.name,
      "url": Astro.site?.toString(),
      "email": site.email,
      "sameAs": [site.social.instagram, site.social.youtube],
    })} />
  </head>
  <body class="min-h-screen flex flex-col">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:m-4 focus:rounded focus:bg-white focus:px-3 focus:py-2">Lewati ke konten</a>
    <!-- Header slot filled in Task 3 -->
    <slot name="header" />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <slot name="footer" />
    <slot name="floating" />
  </body>
</html>
```

- [ ] **Step 4: Wire index to layout, build**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Beranda">
  <section class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-3xl font-semibold text-primary">Layout OK</h1>
  </section>
</BaseLayout>
```

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/data/site.json src/utils src/layouts src/pages/index.astro
git commit -m "feat: site config, utils, BaseLayout SEO shell"
```

---

### Task 3: Header, Footer, WhatsAppButton

**Files:**
- Create: `src/components/Header.astro`, `Footer.astro`, `WhatsAppButton.astro`
- Modify: `BaseLayout.astro` to include them by default (simpler than slots)

**Interfaces:**
- Consumes: `getSite()`, `waLink()`, `mailtoLink()`
- Produces: sticky nav with dropdowns + mobile menu (details/summary or pure CSS; no React)

- [ ] **Step 1: Prefer embedding Header/Footer inside BaseLayout**

Change `BaseLayout.astro` body to:

```astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';
// ...
<body>
  <Header />
  <main id="main" class="flex-1"><slot /></main>
  <Footer />
  <WhatsAppButton />
</body>
```

Remove unused named slots from Task 2.

- [ ] **Step 2: `Header.astro`**

Requirements:
- Sticky top, white/sand background, border-b
- Logo text: “PT. Mardawa” + “Intiguna Persada” (two lines small on mobile)
- Desktop: map `site.nav`; items with `children` use `<details class="group relative">` dropdown
- Mobile: `<details>` hamburger listing all links (flatten children)
- Active path: bold / `text-primary` when `Astro.url.pathname` matches `href` or starts with parent path
- CTA button “Hubungi Kami” → `waLink()`

Keep markup accessible (`nav`, `aria-label`).

- [ ] **Step 3: `Footer.astro`**

Three columns on md+:
1. Company name + short description (`site.description` truncated to ~180 chars)
2. Quick links: Tentang, Klien, Produk, Artikel, Layanan
3. Kontak: email mailto, Instagram, YouTube, note “WhatsApp tersedia”

Bottom bar: `© {year} {site.name}`

- [ ] **Step 4: `WhatsAppButton.astro`**

Fixed bottom-right circular green button linking to `waLink()`, `aria-label="Chat WhatsApp"`, `target="_blank" rel="noopener noreferrer"`. SVG WhatsApp icon inline.

- [ ] **Step 5: Build + smoke open**

```bash
npm run build && npm run preview -- --host 127.0.0.1 --port 4321 &
sleep 1
curl -s http://127.0.0.1:4321/ | head -c 500
kill %1 2>/dev/null || true
```

Expected: HTML contains company name and WhatsApp link.

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: header, footer, WhatsApp floating button"
```

---

### Task 4: JSON data seeds

**Files:**
- Create under `src/data/`: copy from `docs/superpowers/plans/assets/mardawa-seed/` plus testimonials

**Interfaces:**
- Produces: importable JSON modules used by pages/components

- [ ] **Step 1: Copy seed files**

```bash
cp docs/superpowers/plans/assets/mardawa-seed/services.json src/data/
cp docs/superpowers/plans/assets/mardawa-seed/services-portfolio.json src/data/
cp docs/superpowers/plans/assets/mardawa-seed/clients.json src/data/
cp docs/superpowers/plans/assets/mardawa-seed/team.json src/data/
cp docs/superpowers/plans/assets/mardawa-seed/products.json src/data/
cp docs/superpowers/plans/assets/mardawa-seed/videos.json src/data/
cp docs/superpowers/plans/assets/mardawa-seed/maps.json src/data/
```

- [ ] **Step 2: `testimonials.json`**

```json
[]
```

(Leave empty; `showTestimonials: false` in site.json.)

- [ ] **Step 3: `public/images/placeholder.svg`**

Simple gray rectangle SVG for missing logos/thumbs.

- [ ] **Step 4: Commit**

```bash
git add src/data public/images
git commit -m "feat: seed company data JSON from live site"
```

---

### Task 5: Shared presentation components

**Files:**
- Create all `src/components/{Hero,PageHero,SectionAbout,ServiceGrid,ClientGrid,ArticleCard,VideoCard,TeamGrid,MapEmbed,ProductCard,CtaBand,EmptyState}.astro`

**Interfaces (props):**

| Component | Props |
|-----------|--------|
| `Hero` | `title: string; subtitle: string; ctaHref: string; ctaLabel?: string` |
| `PageHero` | `title: string; subtitle?: string` |
| `SectionAbout` | `description: string` |
| `ServiceGrid` | `items: {name, description, icon?}[]` |
| `ClientGrid` | `items: {name, logo?}[]` |
| `ArticleCard` | `title, href, description?, date?, kategori?` |
| `VideoCard` | `title, youtubeUrl, description?` |
| `TeamGrid` | `items: {name, title}[]` |
| `MapEmbed` | `title, alamat, src` |
| `ProductCard` | `name, href, description?` |
| `CtaBand` | none (reads site) |
| `EmptyState` | `title: string; body?: string` |

- [ ] **Step 1: Implement each component with Tailwind**

Patterns:
- Section wrapper: `py-16 md:py-20`
- Container: `mx-auto max-w-6xl px-4`
- Eyebrow label: `text-sm font-semibold uppercase tracking-wide text-primary`
- H2: `text-2xl md:text-3xl font-semibold`
- Card: `rounded-2xl border border-sand-3 bg-white p-6 shadow-sm transition hover:shadow-md`
- `ClientGrid`: grid of cells with first-letter avatar circle if no logo
- `VideoCard`: link to YouTube (new tab) with thumbnail from `youtubeThumb`
- `CtaBand`: purple band, heading “Siap Untuk Memulai?”, body from spec, buttons WA + email
- `EmptyState`: centered muted text

- [ ] **Step 2: Build still green**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components
git commit -m "feat: shared section and card components"
```

---

### Task 6: Content Collections + artikel seed MD

**Files:**
- Create: `src/content.config.ts`, `src/content/artikel/*.md` (4), `src/content/berita/.gitkeep`

**Interfaces:**
- Produces: collections `artikel`, `berita` with schema fields `title`, `description`, `publishDate`, `kategori`, `draft?`

- [ ] **Step 1: `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  kategori: z.string().default('Teknologi'),
  draft: z.boolean().default(false),
});

const artikel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artikel' }),
  schema: articleSchema,
});

const berita = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/berita' }),
  schema: articleSchema,
});

export const collections = { artikel, berita };
```

- [ ] **Step 2: Create 4 artikel MD files**

Use titles/descriptions from `docs/superpowers/plans/assets/mardawa-seed/articles-meta.json`.

Filenames (slug):
1. `apa-itu-artificial-intelligence.md`
2. `panduan-membuat-website-sendiri.md`
3. `perkembangan-aplikasi-mobile-di-indonesia.md`
4. `website-vs-blog.md`

Example frontmatter + body:

```md
---
title: "Apa itu Artificial Inteligence? dan Manfaatnya untuk Bisnis"
description: "Pengantar AI dan manfaatnya untuk bisnis modern."
publishDate: 2026-01-09
kategori: Teknologi
---

## Ringkasan

Artikel ini membahas pengertian Artificial Intelligence (AI) dan bagaimana bisnis dapat memanfaatkannya.

## Manfaat untuk bisnis

- Otomasi proses
- Analisis data
- Peningkatan layanan pelanggan

*Konten lengkap dapat dilengkapi kemudian via git.*
```

For “Perkembangan Aplikasi Mobile…” and “Website VS Blog…”, use the longer descriptions from seed as opening paragraphs.

- [ ] **Step 3: `src/content/berita/.gitkeep`** empty collection OK

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: exit 0 (collections valid even if pages not yet wired).

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content
git commit -m "feat: content collections and artikel seeds"
```

---

### Task 7: Home page (`/`)

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: services, clients, videos JSON; `getCollection('artikel')`; site flags

- [ ] **Step 1: Implement home**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import SectionAbout from '../components/SectionAbout.astro';
import ServiceGrid from '../components/ServiceGrid.astro';
import ClientGrid from '../components/ClientGrid.astro';
import ArticleCard from '../components/ArticleCard.astro';
import VideoCard from '../components/VideoCard.astro';
import CtaBand from '../components/CtaBand.astro';
import { getSite, waLink } from '../utils/site';
import { getCollection } from 'astro:content';
import services from '../data/services.json';
import clients from '../data/clients.json';
import videos from '../data/videos.json';

const site = getSite();
const articles = (await getCollection('artikel', ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
  .slice(0, 3);
---
<BaseLayout>
  <Hero
    title={site.name}
    subtitle={site.tagline}
    ctaHref={waLink()}
    ctaLabel="Hubungi Kami"
  />
  <SectionAbout description={site.description} />
  <ServiceGrid items={services} />
  <ClientGrid items={clients} />
  <section class="py-16 md:py-20 bg-sand-2">
    <div class="mx-auto max-w-6xl px-4">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-2xl md:text-3xl font-semibold">Artikel Terbaru</h2>
        <a href="/artikel" class="text-primary font-medium">Lihat Semua</a>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard
            title={a.data.title}
            href={`/artikel/${a.id}`}
            description={a.data.description}
            date={a.data.publishDate.toISOString().slice(0, 10)}
            kategori={a.data.kategori}
          />
        ))}
      </div>
    </div>
  </section>
  <!-- testimonials intentionally omitted: site.showTestimonials === false -->
  <section class="py-16 md:py-20">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl md:text-3xl font-semibold mb-8">Video</h2>
      <div class="grid gap-6 md:grid-cols-3">
        {videos.map((v) => (
          <VideoCard title={v.title} youtubeUrl={v.youtubeUrl} description={v.description} />
        ))}
      </div>
    </div>
  </section>
  <CtaBand />
</BaseLayout>
```

Note: Astro Content Collection `id` may include `.md` strip depending on version — use `a.id` or `a.slug` as returned by `getCollection` in Astro 5; fix to whatever build uses (`getEntry` routes must match).

- [ ] **Step 2: Build and check home**

```bash
npm run build
test -f dist/index.html
```

- [ ] **Step 3: Commit**

```bash
git commit -am "feat: home page sections from seed data"
```

---

### Task 8: Tentang Kami + Klien

**Files:**
- Create: `src/pages/tentang-kami.astro`, `src/pages/klien.astro`

- [ ] **Step 1: `tentang-kami.astro`**

- PageHero “Tentang Kami”
- Full `site.description` (+ optional longer from about seed)
- TeamGrid from `team.json`
- Two MapEmbed from `maps.json` (Kantor + Workshop)

- [ ] **Step 2: `klien.astro`**

- PageHero “Klien & Mitra”
- Intro: “Kami memiliki beberapa klien dari berbagai instansi dan perusahaan.”
- ClientGrid all clients

- [ ] **Step 3: Build**

```bash
npm run build
test -f dist/tentang-kami/index.html
test -f dist/klien/index.html
```

- [ ] **Step 4: Commit**

```bash
git commit -am "feat: tentang-kami and klien pages"
```

---

### Task 9: Produk + Layanan (list + detail)

**Files:**
- Create: `src/pages/produk/index.astro`, `src/pages/produk/[slug].astro`, `src/pages/layanan/index.astro`, `src/pages/layanan/[slug].astro`

**Interfaces:**
- `getStaticPaths` from products / services-portfolio JSON

- [ ] **Step 1: Produk list**

Map `products.json` → `ProductCard` with `href={`/produk/${slug}`}`.

- [ ] **Step 2: Produk detail**

```astro
---
import products from '../../data/products.json';
// ...
export function getStaticPaths() {
  return products.map((p) => ({ params: { slug: p.slug }, props: { product: p } }));
}
const { product } = Astro.props;
---
<BaseLayout title={product.name} description={product.description}>
  <PageHero title={product.name} />
  <article class="mx-auto max-w-3xl px-4 py-12 prose">
    <p>{product.description}</p>
    <p><a href="/produk" class="text-primary">← Kembali ke Produk</a></p>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Layanan list + detail** — same pattern with `services-portfolio.json` and `/layanan/...`

- [ ] **Step 4: Build**

```bash
npm run build
test -f dist/produk/index.html
test -f dist/produk/sistem-informasi-pendidikan-sip/index.html
test -f dist/layanan/solusi/index.html
```

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: produk and layanan list + detail pages"
```

---

### Task 10: Galeri, pelatihan, learn (empty-capable)

**Files:**
- Create: `src/pages/video.astro`, `src/pages/foto.astro`, `src/pages/pelatihan.astro`, `src/pages/learn-with-mardawa.astro`

- [ ] **Step 1: `video.astro`** — PageHero + grid of all `videos.json` via VideoCard

- [ ] **Step 2: `foto.astro`** — PageHero + `<EmptyState title="Belum ada foto" body="Galeri foto akan ditampilkan di sini." />`

- [ ] **Step 3: `pelatihan.astro`** — EmptyState for pelatihan

- [ ] **Step 4: `learn-with-mardawa.astro`** — short intro + EmptyState “Materi Learn With Mardawa segera hadir.”

- [ ] **Step 5: Build**

```bash
npm run build
test -f dist/video/index.html
test -f dist/foto/index.html
test -f dist/pelatihan/index.html
test -f dist/learn-with-mardawa/index.html
```

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: video, foto, pelatihan, learn pages"
```

---

### Task 11: Artikel + Berita routes

**Files:**
- Create: `src/pages/artikel/index.astro`, `src/pages/artikel/[slug].astro`, `src/pages/berita/index.astro`, `src/pages/berita/[slug].astro`

- [ ] **Step 1: Artikel index**

`getCollection('artikel')` sorted by date desc → ArticleCard grid.

- [ ] **Step 2: Artikel detail**

```astro
---
import { getCollection, render } from 'astro:content';
export async function getStaticPaths() {
  const posts = await getCollection('artikel', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
const { post } = Astro.props;
const { Content } = await render(post);
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="mx-auto max-w-3xl px-4 py-12">
    <p class="text-sm text-primary font-medium">{post.data.kategori}</p>
    <h1 class="mt-2 text-3xl font-semibold">{post.data.title}</h1>
    <time class="mt-2 block text-sm opacity-70">{post.data.publishDate.toISOString().slice(0,10)}</time>
    <div class="prose mt-8 max-w-none">
      <Content />
    </div>
  </article>
</BaseLayout>
```

If `post.id` includes path segments, normalize slug consistently with home links.

- [ ] **Step 3: Berita index** — collection may be empty → EmptyState

- [ ] **Step 4: Berita `[slug].astro`** — `getStaticPaths` from berita collection (empty paths OK)

- [ ] **Step 5: Build**

```bash
npm run build
test -f dist/artikel/index.html
test -d dist/artikel
ls dist/artikel | head
test -f dist/berita/index.html
```

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: artikel and berita collection pages"
```

---

### Task 12: Pages polish — headers, README, final verify

**Files:**
- Create: `public/_headers`, `README.md`
- Modify: any broken links / collection slug mismatches found in build

- [ ] **Step 1: `public/_headers`**

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: interest-cohort=()

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 2: README**

Include:
- What this project is
- `npm install` / `npm run dev` / `npm run build`
- How to edit: JSON in `src/data/`, MD in `src/content/`
- Cloudflare Pages: build `npm run build`, output `dist`, Node 22, **static only**
- WhatsApp/email config in `site.json`

- [ ] **Step 3: Full route smoke after build**

```bash
npm run build
for p in \
  index.html \
  tentang-kami/index.html \
  klien/index.html \
  layanan/index.html \
  produk/index.html \
  pelatihan/index.html \
  foto/index.html \
  video/index.html \
  artikel/index.html \
  berita/index.html \
  learn-with-mardawa/index.html
do
  test -f "dist/$p" && echo "OK $p" || echo "MISSING $p"
done
```

All must be OK. Fix any MISSING before commit.

- [ ] **Step 4: Optional `npx astro check`** — fix trivial type errors only

- [ ] **Step 5: Commit**

```bash
git add public/_headers README.md
git commit -m "docs: README and Cloudflare Pages static headers"
```

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| Full route parity | 7–11 |
| Static only / no Workers | 1, 12 |
| JSON + MD content | 4, 6 |
| WA + mailto | 2, 3, CtaBand |
| Modern UI + primary color | 1 CSS, 5 components |
| Testimonials hidden | 7 + site.json flag |
| SEO / JSON-LD | 2 BaseLayout |
| Empty states | 10, 11 |
| Seed from live | 4 + assets |
| Pages deploy docs | 12 |

## Placeholder scan

Plan uses concrete paths, seed assets, commands, and component props — no TBD/TODO steps.

## Type consistency

- Product/layanan slugs: kebab-case from seed files  
- Article routes: `/artikel/${post.id}` must match `getStaticPaths` params  
- Site helpers: `getSite`, `waLink`, `mailtoLink`, youtube helpers as defined in Task 2  

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-25-mardawa-astro-static.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — same session, batch with checkpoints  

Which approach?
