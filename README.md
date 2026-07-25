# Mardawa — static site (Astro)

Static company website for **Mardawa** (IT services, products, training). Built with Astro 7 + Tailwind CSS 4. **Static HTML only** — no SSR, no Workers, no server runtime.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output → dist/
npm run preview  # preview production build
```

Requires **Node 22+** (`engines.node: ">=22.12.0"`).

## Edit content

| What | Where |
|------|--------|
| Site config (name, WA, email, flags) | `src/data/site.json` |
| Services, products, clients, team, videos, maps, … | `src/data/*.json` |
| Articles | `src/content/artikel/*.md` |
| News posts | `src/content/berita/*.md` |

WhatsApp / email CTAs read `whatsapp` and `email` from `site.json` (helpers in `src/utils/site.ts`).

## Cloudflare Pages

| Setting | Value |
|---------|--------|
| Framework | None (static) |
| Build command | `npm run build` |
| Build output | `dist` |
| Node version | **22** |
| Adapter / Functions | **None** — static only |

Security and cache headers live in `public/_headers` (copied into `dist` on build).
