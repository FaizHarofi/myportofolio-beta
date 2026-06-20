# portofolio-beta

Personal portfolio site — **Next.js 16** + **React 19** + **Tailwind v4** + **MySQL** with a custom-built **admin CMS** for editing all content without touching code.

## Highlights

- **Auto-init DB** — first request creates all tables + seeds initial data, no SQL required
- **Admin CRUD** for every public section (projects, services, skills, education, profile, testimonials, nav, social icons, etc.)
- **Asset upload** — tech icons, project cover images, profile avatar via admin form OR direct file drop
- **Modern dark theme** with glass morphism, gradient accents, accent color `#38BDF8`
- **Self-healing migrations** — column/table additions via runtime fallback if cached pool pre-dates schema

## Stack

| Layer | Package | Version |
|---|---|---|
| Framework | `next` | ^16.2.9 |
| UI | `react` / `react-dom` | ^19.2.7 |
| Animation | `framer-motion` | ^12.40.0 |
| Styling | `tailwindcss` | ^4.3.1 (CSS-first) |
| 3D | `@react-three/fiber` + `drei` + `three` + `three-globe` | latest |
| Icons | `lucide-react`, `react-icons`, `@tabler/icons-react` | latest |
| DB | `mysql2` | ^3.11 |
| Auth | `bcryptjs` + cookie session (HMAC-signed) | latest |
| Monitoring | `@sentry/nextjs` | ^10.57 |
| Lang | `typescript` | ^6.0.3 |

## Quick Start

### 1. Install
```bash
cd portofolio-beta
npm install
```

### 2. Start MySQL
Pastikan MySQL/MariaDB jalan (Laragon / XAMPP / native). Default conn:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: *(kosong)*
- DB: `portofolio_beta` *(auto-created)*

Override via `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portofolio_beta
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=<random-32-bytes-base64>
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Run
```bash
npm run dev
```

First request → auto-creates database, all tables, seeds initial data. Zero SQL knowledge required.

## Admin Panel

Login: **http://localhost:3000/admin/login** (default password `admin123`)

### CRUD sections

| Section | Path | What it controls |
|---|---|---|
| Dashboard | `/admin` | Overview + counts + recent activity |
| **Profile** | `/admin/profile` | Name, role, location, avatar, bio paragraphs (used on `/info` page) |
| Nav Items | `/admin/nav` | Floating navbar links |
| Grid Items | `/admin/grid-items` | Bento grid cards (homepage `#about` section) |
| Projects | `/admin/projects` | Portfolio cards (cover image picker + tech icon multi-select) |
| **Services** | `/admin/services` | Service cards (icon, tone, description) on homepage |
| **Skills** | `/admin/skills` | Skill chips grouped by category (Design/Web/Other) |
| **Educations** | `/admin/educations` | School entries on `/info` page |
| Testimonials | `/admin/testimonials` | Client quotes (infinite carousel) |
| Companies | `/admin/companies` | Trusted-by logos row |
| **Assets** | `/admin/assets` | Tech icons + cover images (upload + sync from disk) |
| Social Media | `/admin/social` | Footer social icons (with link URL per icon) |

Each admin page: **Add new** form (top) + **Edit** form per item (pre-filled) + **Delete** button. Server Actions with `revalidatePath('/')` → homepage reflects changes instantly.

## Asset Management

Upload via admin form **OR** drop file directly into folder — both auto-register to DB.

| Folder | Format | Admin UI |
|---|---|---|
| `public/uploads/tech/icon/` | SVG 24×24, max 100KB | `/admin/assets` → "Tech icon library" section + "Sync from disk" button |
| `public/uploads/covers/` | PNG/JPG/WebP/SVG, max 2MB | `/admin/assets` → "Cover library" section + "Sync from disk" button |
| `public/uploads/avatars/` | PNG/JPG/WebP, max 3MB | `/admin/profile` → avatar upload |

**Sync from disk**: scans folder, INSERT IGNORE new files (UNIQUE constraint on `path` column prevents duplicates from race conditions). Re-running is safe — already-imported files are skipped.

**Tech icons** are simple — usually only 8-12 entries, just upload via the admin form. Direct file drop + sync is supported but rarely needed.

## MySQL Schema (auto-created)

11 tables, all `CREATE TABLE IF NOT EXISTS` on first request:

```sql
nav_items          (id, name, link, position)
grid_items         (id, title, description, class_name, img_class_name, title_class_name, img, spare_img, position)
projects           (id, title, des, img, icon_lists JSON, link, position)
testimonials       (id, quote, name, title, position)
companies          (id, name, img, name_img, position)
work_experience    (id, title, description, class_name, thumbnail, position)
social_media       (id, img, link, position)
tech_icons         (id, label, path UNIQUE, position)
assets → covers    (id, label, path UNIQUE, position)
skills             (id, group_name, label, position)
educations         (id, school, period, level, description, position)
services           (id, icon, title, description, tone, position)
profile            (id PK=1, name, role, location, avatar, bio1, bio2)
_meta              (key PK, value)  -- migration tracking
```

Seeded on first run (gated by `_meta` flags): 4 projects, 6 grid items, 5 testimonials, 5 companies, 4 experiences, 3 socials, 12 tech icons, 6 services, 6 skills, 3 educations, 1 profile.

## Pages

| Path | Description |
|---|---|
| `/` | Homepage: Hero → Grid → RecentProjects → Clients → Services → Footer |
| `/info` | Info page: bio + terminal + skills + education |
| `/admin/login` | Admin login (HMAC-signed cookie session) |
| `/admin/*` | Protected admin routes (auto-redirect to login if unauth'd) |

## Custom Hooks & Utilities

- `lib/db.ts` — MySQL pool + `initSchema()` + seed functions (idempotent via `_meta` flags)
- `lib/data.ts` — CRUD functions for all entities (`getProjects`, `updateSkill`, etc.)
- `lib/icons-data.ts` — Tech icon + cover CRUD + `syncTechIconsFromDisk()` / `syncCoversFromDisk()`
- `lib/auth.ts` — Cookie session + bcrypt password check
- `lib/utils.ts` — `cn()` class merge helper

## Theme

- Accent color: `#38BDF8` (sky-400) — overrides default `purple` in Tailwind config
- Background: `#000319` (custom `black-100`)
- Glass morphism: `backdrop-blur` + translucent white borders (`border-white/5`)
- Gradient accents: violet/fuchsia/sky/emerald/amber/rose for service cards

## Production Deployment

1. Provision MySQL (Railway / PlanetScale / Neon / self-hosted)
2. Set env vars in hosting dashboard (6 vars: `DB_*` + `ADMIN_PASSWORD`)
3. Deploy: `vercel --prod`
4. First request triggers auto-init

**Note about file uploads in production:** Vercel's filesystem is read-only — uploaded files via admin form are lost on each deploy. For production:
- **Vercel Blob** (recommended, free tier 500MB) — direct upload from client
- **Cloudinary / AWS S3 / Supabase Storage** — alternative storage backends
- Or commit static assets to repo under `public/` (no upload needed)

For DB-backed content (text, paths, links): persists across deploys since external MySQL.

## Run Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint flat config
npm run deploy       # Vercel deploy
npm run db:init       # Manual DB init (prints tables)
npm run db:check      # Show tables in DB
npm run db:backup     # mysqldump to ./backups/
npm run optimize:svgs # svgo on public/
```

## File Structure

```
portofolio-beta/
├── app/
│   ├── admin/
│   │   ├── actions.ts              # All server actions (auth + CRUD)
│   │   ├── layout.tsx              # Protected admin layout (sidebar + topbar)
│   │   ├── page.tsx                # Dashboard
│   │   ├── login/
│   │   ├── profile/page.tsx        # Profile CRUD + avatar upload
│   │   ├── projects/page.tsx       # Cover picker + icon multi-select
│   │   ├── grid-items/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── services/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── educations/page.tsx
│   │   ├── assets/page.tsx         # Upload + sync icons/covers
│   │   ├── social/page.tsx         # Social icons + link URLs
│   │   └── nav/page.tsx
│   ├── info/page.tsx               # /info page (uses profile + skills + educations)
│   ├── page.tsx                     # Homepage (server component, fetches from DB)
│   ├── layout.tsx, globals.css, provider.tsx, global-error.tsx
├── components/
│   ├── admin/                      # Admin UI components
│   │   ├── AdminShell.tsx, Sidebar.tsx, Topbar.tsx
│   │   ├── PageHeader.tsx, Surface.tsx, StatCard.tsx, EmptyState.tsx
│   │   ├── EditableItem.tsx, EditModal.tsx, EntityForm.tsx
│   │   ├── AddNewButton.tsx, DeleteButton.tsx
│   │   ├── IconPicker.tsx, ImagePicker.tsx, FileInput.tsx
│   │   └── Button.tsx
│   ├── ui/                         # Original UI components (BentoGrid, Pin, etc.)
│   ├── Hero.tsx, Grid.tsx, RecentProjects.tsx, Clients.tsx
│   ├── Services.tsx, About.tsx, Footer.tsx, MagicButton.tsx
│   └── ContextGuard.tsx            # Right-click + drag prevention
├── lib/
│   ├── auth.ts                     # Session cookie + bcrypt
│   ├── data.ts                     # Main CRUD functions
│   ├── icons-data.ts               # Tech icon + cover + sync
│   ├── db.ts                       # Pool + schema + seeds + migrations
│   └── utils.ts                    # cn() helper
├── data/                            # Static JSON (globe.json, confetti.json)
├── public/                          # Static assets
│   ├── uploads/                    # Admin uploads (gitignored)
│   │   ├── tech/icon/
│   │   ├── covers/
│   │   └── avatars/
│   └── *.svg, *.png                # Initial assets (in repo)
├── scripts/
│   ├── init-db.mjs                 # Manual DB init
│   └── backup-db.mjs               # mysqldump wrapper
├── sentry.*.config.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── eslint.config.mjs
└── README.md
```

## Security Notes

⚠️ **Set BEFORE deploying to production:**
1. `ADMIN_PASSWORD` env → strong unique password (default: `admin123`)
2. `ADMIN_SECRET` env → random 32+ bytes base64

Default password is `admin123` — fine for local dev, NEVER for production.

## Notable Patterns

- **Self-healing migrations**: tables/columns created at runtime via `ensure*Table()` patterns if cached MySQL pool pre-dates schema changes
- **`revalidatePath`** in every CRUD action → instant UI updates
- **No client-side state for DB data**: all data fetched server-side per request (`force-dynamic`)
- **UNIQUE constraint** on `path` columns + `INSERT IGNORE` → race-safe sync from disk
- **Server Actions** for all mutations: no API routes needed, types flow end-to-end
