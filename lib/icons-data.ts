import mysql from "mysql2/promise";
import { getDb } from "./db";
import { revalidatePath } from "next/cache";

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
  revalidatePath("/admin/icons");
  revalidatePath("/admin/projects");
}

export async function deleteTechIcon(id: number) {
  const db = await getDb();
  await ensureTechIconsTable(db);
  await db.query("DELETE FROM tech_icons WHERE id = ?", [id]);
  revalidatePath("/admin/icons");
  revalidatePath("/admin/projects");
}
