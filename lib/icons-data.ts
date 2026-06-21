import mysql from "mysql2/promise";
import { readdir, unlink } from "fs/promises";
import { join, resolve } from "path";
import { getDb } from "./db";
import { revalidatePath } from "next/cache";
import { createProject } from "./data";

const ICONS_UPLOAD_DIR = resolve(
  process.cwd(),
  "public",
  "uploads",
  "tech",
  "icon"
);
const COVERS_UPLOAD_DIR = resolve(
  process.cwd(),
  "public",
  "uploads",
  "covers"
);
const SOCIAL_ASSETS_UPLOAD_DIR = resolve(
  process.cwd(),
  "public",
  "uploads",
  "social"
);
const COMPANIES_UPLOAD_DIR = resolve(
  process.cwd(),
  "public",
  "uploads",
  "companies"
);

function humanizeFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  // Strip random upload suffix: -{5-12 alphanumeric chars} at end
  // e.g. "myicon-abc123xyz" -> "myicon"
  const cleaned = base.replace(/[-_][a-z0-9]{5,12}$/i, "");
  const final = cleaned || base;
  return final
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
    .slice(0, 64);
}

export async function syncTechIconsFromDisk(): Promise<{
  added: number;
  skipped: number;
}> {
  const db = await getDb();
  await ensureTechIconsTable(db);

  let files: string[] = [];
  try {
    const entries = await readdir(ICONS_UPLOAD_DIR);
    files = entries.filter((f) => f.toLowerCase().endsWith(".svg"));
  } catch {
    return { added: 0, skipped: 0 };
  }

  const [existing] = (await db.query(
    "SELECT path FROM tech_icons"
  )) as any;
  const known = new Set(existing.map((r: any) => r.path));

  let added = 0;
  for (const file of files) {
    const path = `/uploads/tech/icon/${file}`;
    if (known.has(path)) continue;

    const label = humanizeFilename(file);
    const [posRow] = (await db.query(
      "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM tech_icons"
    )) as any;
    const [result] = (await db.query(
      "INSERT IGNORE INTO tech_icons (label, path, position) VALUES (?, ?, ?)",
      [label, path, posRow[0].p]
    )) as any;
    if ((result?.affectedRows ?? 0) > 0) added++;
  }

  return { added, skipped: files.length - added };
}

export async function syncCoversFromDisk(): Promise<{
  added: number;
  skipped: number;
}> {
  const db = await getDb();
  await ensureCoversTable(db);

  let files: string[] = [];
  try {
    const entries = await readdir(COVERS_UPLOAD_DIR);
    files = entries.filter((f) =>
    /\.(png|jpe?g|webp|svg)$/i.test(f)
    );
  } catch {
    return { added: 0, skipped: 0 };
  }

  const [existing] = (await db.query(
    "SELECT path FROM covers"
  )) as any;
  const known = new Set(existing.map((r: any) => r.path));

  let added = 0;
  for (const file of files) {
    const path = `/uploads/covers/${file}`;
    if (known.has(path)) continue;

    const label = humanizeFilename(file);
    const [posRow] = (await db.query(
      "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM covers"
    )) as any;
    const [result] = (await db.query(
      "INSERT IGNORE INTO covers (label, path, position) VALUES (?, ?, ?)",
      [label, path, posRow[0].p]
    )) as any;
    if ((result?.affectedRows ?? 0) > 0) added++;
  }

  return { added, skipped: files.length - added };
}

export type TechIcon = {
  id: number;
  label: string;
  path: string;
  position: number;
};

async function ensureTechIconsTable(db: mysql.Pool) {
  try {
    await db.query("SELECT 1 FROM tech_icons LIMIT 1");
  } catch (err: any) {
    if (err?.errno === 1146 || err?.code === "ER_NO_SUCH_TABLE") {
      // Table missing — create it (handles cached pool from before tech_icons existed)
      await db.query(`
        CREATE TABLE tech_icons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          label VARCHAR(255) NOT NULL,
          path VARCHAR(255) NOT NULL,
          position INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      // Also seed defaults if empty
      const [rows] = (await db.query(
        "SELECT COUNT(*) as c FROM tech_icons"
      )) as any;
      if (rows[0].c === 0) {
        const seed = [
          { label: "React", path: "/re.svg" },
          { label: "Next.js", path: "/next.svg" },
          { label: "TypeScript", path: "/ts.svg" },
          { label: "Tailwind", path: "/tail.svg" },
          { label: "Three.js", path: "/three.svg" },
          { label: "Framer Motion", path: "/fm.svg" },
          { label: "C", path: "/c.svg" },
          { label: "Stream", path: "/stream.svg" },
          { label: "GSAP", path: "/gsap.svg" },
        ];
        for (let i = 0; i < seed.length; i++) {
          await db.query(
            "INSERT INTO tech_icons (label, path, position) VALUES (?, ?, ?)",
            [seed[i].label, seed[i].path, i]
          );
        }
      }
    } else {
      throw err;
    }
  }
}

export async function getTechIcons(): Promise<TechIcon[]> {
  const db = await getDb();
  await ensureTechIconsTable(db);
  const [rows] = (await db.query(
    "SELECT * FROM tech_icons ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

export async function createTechIcon(input: { label: string; path: string }) {
  const db = await getDb();
  await ensureTechIconsTable(db);
  const [r] = (await db.query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM tech_icons"
  )) as any;
  const position = r[0].p;
  await db.query(
    "INSERT INTO tech_icons (label, path, position) VALUES (?, ?, ?)",
    [input.label, input.path, position]
  );
  revalidatePath("/admin/assets");
  revalidatePath("/admin/projects");
  revalidatePath("/info");
}

export async function deleteTechIcon(id: number) {
  const db = await getDb();
  await ensureTechIconsTable(db);

  const [rows] = (await db.query(
    "SELECT path FROM tech_icons WHERE id = ?",
    [id]
  )) as any;
  const row = rows[0];
  if (row?.path) {
    const uploadDir = resolve(process.cwd(), "public", "uploads", "tech", "icon");
    const fileAbs = resolve(process.cwd(), "public", row.path.replace(/^\//, ""));
    if (fileAbs.startsWith(uploadDir)) {
      try {
        await unlink(fileAbs);
      } catch {
        /* file may already be missing — ignore */
      }
    }
  }

  await db.query("DELETE FROM tech_icons WHERE id = ?", [id]);
  revalidatePath("/admin/assets");
  revalidatePath("/admin/projects");
  revalidatePath("/info");
}

export type Cover = {
  id: number;
  label: string;
  path: string;
  position: number;
};

async function ensureCoversTable(db: mysql.Pool) {
  try {
    await db.query("SELECT 1 FROM covers LIMIT 1");
  } catch (err: any) {
    if (err?.errno === 1146 || err?.code === "ER_NO_SUCH_TABLE") {
      await db.query(`
        CREATE TABLE covers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          label VARCHAR(255) NOT NULL,
          path VARCHAR(255) NOT NULL,
          position INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    } else {
      throw err;
    }
  }
}

export async function getCovers(): Promise<Cover[]> {
  const db = await getDb();
  await ensureCoversTable(db);
  const [rows] = (await db.query(
    "SELECT * FROM covers ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

export async function createCover(input: { label: string; path: string }) {
  const db = await getDb();
  await ensureCoversTable(db);
  const [r] = (await db.query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM covers"
  )) as any;
  const position = r[0].p;
  await db.query(
    "INSERT INTO covers (label, path, position) VALUES (?, ?, ?)",
    [input.label, input.path, position]
  );
  revalidatePath("/admin/assets");
  revalidatePath("/admin/projects");
}

export async function deleteCover(id: number) {
  const db = await getDb();

  const [rows] = (await db.query(
    "SELECT path FROM covers WHERE id = ?",
    [id]
  )) as any;
  const row = rows[0];
  if (row?.path) {
    const uploadDir = resolve(process.cwd(), "public", "uploads", "covers");
    const fileAbs = resolve(process.cwd(), "public", row.path.replace(/^\//, ""));
    if (fileAbs.startsWith(uploadDir)) {
      try {
        await unlink(fileAbs);
      } catch {
        /* file may already be missing — ignore */
      }
    }
  }

  await db.query("DELETE FROM covers WHERE id = ?", [id]);
  revalidatePath("/admin/assets");
  revalidatePath("/admin/projects");
}

export async function syncSocialsFromDisk(): Promise<{
  added: number;
  skipped: number;
}> {
  const db = await getDb();
  // Ensure the unified socials table exists before querying it
  try {
    await db.query("SELECT 1 FROM socials LIMIT 1");
  } catch (err: any) {
    if (err?.errno === 1146 || err?.code === "ER_NO_SUCH_TABLE") {
      await db.query(`
        CREATE TABLE socials (
          id INT AUTO_INCREMENT PRIMARY KEY,
          label VARCHAR(255) NOT NULL,
          img VARCHAR(255) NOT NULL,
          link VARCHAR(500),
          enabled TINYINT(1) NOT NULL DEFAULT 1,
          position INT NOT NULL DEFAULT 0,
          UNIQUE KEY uk_socials_img (img)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    } else {
      throw err;
    }
  }

  let files: string[] = [];
  try {
    const entries = await readdir(SOCIAL_ASSETS_UPLOAD_DIR);
    files = entries.filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f));
  } catch {
    return { added: 0, skipped: 0 };
  }

  const [existing] = (await db.query(
    "SELECT img FROM socials"
  )) as any;
  const known = new Set(existing.map((r: any) => r.img));

  let added = 0;
  for (const file of files) {
    const img = `/uploads/social/${file}`;
    if (known.has(img)) continue;

    const label = humanizeFilename(file);
    const [posRow] = (await db.query(
      "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM socials"
    )) as any;
    const [result] = (await db.query(
      "INSERT IGNORE INTO socials (label, img, enabled, position) VALUES (?, ?, 1, ?)",
      [label, img, posRow[0].p]
    )) as any;
    if ((result?.affectedRows ?? 0) > 0) added++;
  }

  return { added, skipped: files.length - added };
}

export async function syncCompaniesFromDisk(): Promise<{
  added: number;
  skipped: number;
}> {
  const db = await getDb();

  let files: string[] = [];
  try {
    const entries = await readdir(COMPANIES_UPLOAD_DIR);
    files = entries.filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f));
  } catch {
    return { added: 0, skipped: 0 };
  }

  const [existing] = (await db.query(
    "SELECT img FROM companies WHERE img IS NOT NULL AND img != ''"
  )) as any;
  const known = new Set(existing.map((r: any) => r.img));

  let added = 0;
  for (const file of files) {
    const img = `/uploads/companies/${file}`;
    if (known.has(img)) continue;

    const label = humanizeFilename(file);
    const [posRow] = (await db.query(
      "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM companies"
    )) as any;
    const [result] = (await db.query(
      "INSERT IGNORE INTO companies (name, img, name_img, enabled, position) VALUES (?, ?, NULL, 1, ?)",
      [label, img, posRow[0].p]
    )) as any;
    if ((result?.affectedRows ?? 0) > 0) added++;
  }

  return { added, skipped: files.length - added };
}

export async function syncProjectImagesFromDisk(): Promise<{
  added: number;
  skipped: number;
}> {
  const dir = resolve(process.cwd(), "public", "uploads", "project");

  let files: string[] = [];
  try {
    const entries = await readdir(dir);
    files = entries.filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f));
  } catch {
    return { added: 0, skipped: 0 };
  }

  const db = await getDb();
  const [existing] = (await db.query(
    "SELECT img FROM projects WHERE img IS NOT NULL AND img != ''"
  )) as any;
  const known = new Set(existing.map((r: any) => r.img));

  let added = 0;
  for (const file of files) {
    const img = `/uploads/project/${file}`;
    if (known.has(img)) continue;
    const label = humanizeFilename(file) || "Project";
    await createProject({
      title: label,
      des: "",
      img,
      iconLists: [],
      link: "",
      enabled: true,
    });
    added++;
  }

  return { added, skipped: files.length - added };
}
