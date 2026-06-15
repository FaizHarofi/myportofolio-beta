# portofolio-beta

Upgraded fork of `portfolio/` with **all packages on latest** + **admin CMS** + **modern blue theme** + **MySQL backend**.

## Stack

| Package | Version |
|---|---|
| `next` | ^16.2.9 |
| `react` / `react-dom` | ^19.2.7 |
| `framer-motion` | ^12.40.0 |
| `next-themes` | ^0.4.6 |
| `@react-three/fiber` / `drei` | ^9.6 / ^10.7 |
| `three` | ^0.184 |
| `tailwindcss` | ^4.3.1 (CSS-first) |
| `typescript` | ^6.0.3 |
| `eslint` | ^10.5 (flat config) |
| `mysql2` | ^3.11 |
| `bcryptjs` | ^3.0 |
| `@sentry/nextjs` | ^10.57 |

## Quick Start

### 1. Install
```bash
cd portofolio-beta
npm install
```

### 2. Start MySQL
Pastikan MySQL/MariaDB jalan (Laragon/XAMPP/etc). Default conn:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `` (kosong)
- DB: `portofolio_beta` (auto-created)

Override via env vars:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portofolio_beta
```

### 3. Set Admin Password (opsional)
```bash
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=random-32-bytes-string  # for HMAC session signing
```
Default password: `admin123` (ganti untuk production!).

### 4. Run
```bash
npm run dev
```

Database + tables + seed data **auto-created** on first run.

## Admin Panel

Login: **http://localhost:3000/admin/login**

Default password: `admin123` (override via `ADMIN_PASSWORD` env)

Dashboard: **http://localhost:3000/admin**

### CRUD Sections

| Section | Path | What |
|---|---|---|
| Dashboard | `/admin` | Overview + counts |
| Nav Items | `/admin/nav` | Floating navbar links |
| Grid Items | `/admin/grid-items` | About-section bento grid (6 cards) |
| Projects | `/admin/projects` | **Portfolio cards** (add/edit/delete) |
| Testimonials | `/admin/testimonials` | Client quotes (infinite scroll) |
| Companies | `/admin/companies` | Client logos row |
| Experience | `/admin/experience` | Work experience cards |
| Social Media | `/admin/social` | Footer social icons |
| Nav Items | `/admin/nav` | Navbar links |

Setiap section punya:
- **Add new** form (top)
- **Edit** form per item (pre-filled)
- **Delete** button per item

Mutasi via Server Actions → `revalidatePath('/')` → home page reflect changes instantly.

## Theme: Modern Blue (sky/cyan blend)

- Accent color: `#38BDF8` (sky-400)
- Conic gradient: `#7DD3FC → #0284C7 → #7DD3FC`
- Radial accent: `#38BDF8`

Custom `purple` Tailwind color di-override jadi `#38BDF8` (semua `text-purple` jadi biru).

## File Tree

```
portofolio-beta/
├── app/
│   ├── admin/
│   │   ├── actions.ts          # All server actions (auth, CRUD)
│   │   ├── layout.tsx          # Protected admin layout + sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── projects/page.tsx
│   │   ├── grid-items/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── social/page.tsx
│   │   └── nav/page.tsx
│   ├── api/sentry-example-api/route.js
│   ├── sentry-example-page/page.jsx
│   ├── global-error.tsx
│   ├── globals.css             # @import "tailwindcss" + @config
│   ├── layout.tsx
│   ├── page.tsx                # Server Component, fetches from MySQL
│   └── provider.tsx
├── components/
│   ├── admin/
│   │   └── EntityForm.tsx      # Reusable CRUD form
│   ├── ui/                     # (12 UI components, blue-themed)
│   ├── Hero.tsx, Grid.tsx, ... # (8 main components)
├── lib/
│   ├── auth.ts                 # Cookie session + bcrypt password
│   ├── data.ts                 # All MySQL CRUD functions
│   ├── db.ts                   # Pool + schema init + seed
│   └── utils.ts
├── data/                       # Static data files (globe.json, confetti.json)
├── public/                     # 41 assets
├── sentry.*.config.ts          # Sentry v10 init
├── next.config.mjs             # withSentryConfig wrapper
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── eslint.config.mjs
├── components.json
└── README.md
```

## MySQL Schema (auto-created)

```sql
CREATE TABLE nav_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link VARCHAR(255) NOT NULL,
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE grid_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title TEXT, description TEXT,
  class_name VARCHAR(255),
  img_class_name VARCHAR(255),
  title_class_name VARCHAR(255),
  img VARCHAR(255), spare_img VARCHAR(255),
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  des TEXT, img VARCHAR(255),
  icon_lists JSON,
  link VARCHAR(255),
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote TEXT, name VARCHAR(255), title VARCHAR(255),
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255), img VARCHAR(255), name_img VARCHAR(255),
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE work_experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255), description TEXT,
  class_name VARCHAR(255), thumbnail VARCHAR(255),
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE social_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  img VARCHAR(255),
  position INT NOT NULL DEFAULT 0
);
```

Seed data (4 projects, 6 grid items, 5 testimonials, 5 companies, 4 experiences, 3 socials, 4 nav) diinsert pada first run kalau table kosong.

## Auth

- Cookie-based session (HMAC-signed JWT-like)
- `httpOnly`, `sameSite=lax`, `secure` (prod)
- 7-day expiration
- bcrypt-hashed password (cost 10)
- Protected routes: `app/admin/layout.tsx` checks `isAuthenticated()` → redirect to login

## Security Notes

⚠️ **Ganti sebelum deploy:**
1. `ADMIN_PASSWORD` env (default: `admin123`)
2. `ADMIN_SECRET` env (32+ random bytes)

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Known Notes

- `tailwindcss/lib/util/flattenColorPalette` di-replace dengan inline function (Tailwind 4 path private)
- `tsconfig.json` Next 16 auto-adds `jsx: react-jsx` + `.next/dev/types/**/*.ts` (after install)
- `data/store.json` is NOT used (MySQL only)
- Static export **tidak kompatibel** dengan MySQL backend (uses `force-dynamic`)

## Run Commands

```bash
npm run dev      # Development
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint flat config
npm run deploy   # Vercel deploy
```
