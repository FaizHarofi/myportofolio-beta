# portofolio-beta

Upgraded fork of `portfolio/` with **all packages on latest** as of npm registry snapshot.

## Stack (All Latest)

| Package | Old (portfolio/) | New (portofolio-beta) |
|---|---|---|
| `next` | 14.1.4 | **^16.2.9** |
| `react` / `react-dom` | ^18 | **^19.2.7** |
| `@types/react` / `@types/react-dom` | ^18 | **^19.2.17 / ^19.2.3** |
| `eslint-config-next` | 14.1.4 | **^16.2.9** |
| `framer-motion` | ^11.0.25 | **^12.40.0** |
| `next-themes` | ^0.3.0 | **^0.4.6** |
| `@react-three/fiber` | ^8.16.2 | **^9.6.1** |
| `@react-three/drei` | ^9.105.4 | **^10.7.7** |
| `three` / `@types/three` | 0.163.0 | **^0.184.0 / ^0.184.1** |
| `three-globe` | ^2.31.0 | **^2.45.2** |
| `lucide-react` | ^0.365.0 | **^1.18.0** (0.x→1.x major) |
| `@tabler/icons-react` | ^3.1.0 | **^3.44.0** |
| `tailwind-merge` | ^2.2.2 | **^3.6.0** (major) |
| `tailwindcss` | ^3.3.0 | **^4.3.1** (major — CSS-first) |
| `react-icons` | ^5.0.1 | **^5.6.0** |
| `react-lottie` | ^1.2.4 | **^1.2.10** |
| `vercel` | ^34.0.0 | **^54.14.0** |
| `typescript` | ^5 | **^6.0.3** (major) |
| `eslint` | ^8 | **^10.5.0** (major — flat config) |
| `postcss` | ^8 | **^8.5.15** |
| `autoprefixer` | ^10.0.1 | **^10.5.0** |
| `@types/node` | ^20 | **^25.9.3** |
| `mini-svg-data-uri` | ^1.4.4 | **^1.4.4** (v2 doesn't exist on npm — fixed) |
| `@sentry/nextjs` | ^7.105.0 | **^7.120.4** (kept v7 line) |

## Breaking Changes Applied

### Next 16
- `app/layout.tsx`: `viewport` exported separately from `metadata`
- No dynamic routes → no async `params`/`searchParams` migration needed
- No `cookies()` / `headers()` usage

### React 19
- All client components already had `"use client"`
- No `forwardRef` legacy patterns

### Tailwind 4 (CSS-first)
- `postcss.config.js`: plugin changed from `tailwindcss` → `@tailwindcss/postcss`
- `app/globals.css`: replaced `@tailwind base/components/utilities` with `@import "tailwindcss"`
- Backward compat: kept `tailwind.config.ts` via `@config "../../tailwind.config.ts"` directive
- Note: `flattenColorPalette` from `tailwindcss/lib/util/...` may emit deprecation warnings (private path). Safe but consider migration to `@plugin` directives if warnings appear.

### ESLint 10 (flat config required)
- Deleted `.eslintrc.json`
- Created `eslint.config.mjs` using `FlatCompat` from `@eslint/eslintrc`
- Extends `next/core-web-vitals` and `next/typescript`

### next-themes 0.4
- `app/provider.tsx`: dropped `next-themes/dist/types` (private path), use `React.ComponentProps<typeof NextThemesProvider>`

### Framer Motion 12
- API stable for all used exports
- Optional: `import { motion } from "motion/react"` (new package alias)

### TypeScript 6
- Target ES2022 maintained
- Should be source-compatible with TS 5 code in this project

## Run

```bash
cd portofolio-beta
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint   # uses eslint.config.mjs (flat config)
```

## Deploy

```bash
npm run deploy   # vercel --prod
```

## Files Changed From Original `portfolio/`

| File | Change |
|---|---|
| `package.json` | All deps on latest |
| `postcss.config.js` | `@tailwindcss/postcss` |
| `app/globals.css` | `@import "tailwindcss"` + `@config` |
| `app/layout.tsx` | Separate `viewport` export |
| `app/provider.tsx` | `React.ComponentProps` typing |
| `app/global-error.jsx` | New (was Sentry-coupled) |
| `next.config.mjs` | Sentry `withSentryConfig` wrapper preserved |
| `sentry.client.config.ts` | **RESTORED** (from `portfolio/`) |
| `sentry.server.config.ts` | **RESTORED** |
| `sentry.edge.config.ts` | **RESTORED** |
| `app/sentry-example-page/page.jsx` | **RESTORED** |
| `app/api/sentry-example-api/route.js` | **RESTORED** |
| `.eslintrc.json` | **DELETED** |
| `eslint.config.mjs` | **NEW** flat config |
| `tsconfig.json` | `target: ES2022` |
| `README.md` | This file |

All components, data, lib, and public assets are **identical** to `portfolio/`.

## Known Warnings

- `tailwindcss/lib/util/flattenColorPalette` is a private import path. Works in Tailwind 4 via `@config` compat but may log deprecation warnings. To silence: rewrite the custom `bg-grid`/`bg-dot` plugins as Tailwind 4 `@plugin` or `@utility` directives in CSS.
- **Sentry v7 + Next 16** — Sentry v7 was designed for Next 13/14. With Next 16 + React 19, `withSentryConfig` may emit deprecation warnings or fail at build time. If issues arise, upgrade path:
  - `npm i @sentry/nextjs@^8` then follow [v7→v8 migration](https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v7-to-v8/)
  - Or `npm i @sentry/nextjs@^9` (LTS) / `^10` (latest) — both officially support Next 16

## Preserved From `portfolio/`

All original Sentry files kept verbatim:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `app/sentry-example-page/page.jsx`
- `app/api/sentry-example-api/route.js`
- `withSentryConfig` wrapper in `next.config.mjs`
- Original DSN + org/project IDs (`javascript-mastery` / `javascript-nextjs`)

## Removed

- `.eslintrc.json` (replaced by `eslint.config.mjs` — required by ESLint 10)
