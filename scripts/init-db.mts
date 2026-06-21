#!/usr/bin/env node
/* eslint-disable no-console */
import "dotenv/config";
import mysql from "mysql2/promise";

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`[init-db] Missing env var: ${name}`);
    process.exit(1);
  }
  return v;
}

async function main() {
  const host = DB_HOST ?? required("DB_HOST");
  const port = DB_PORT ? Number(DB_PORT) : 3306;
  const user = DB_USER ?? required("DB_USER");
  const password = DB_PASSWORD ?? required("DB_PASSWORD");
  const database = DB_NAME ?? required("DB_NAME");

  console.log(`[init-db] Connecting to ${user}@${host}:${port}/${database} ...`);

  const root = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: false,
    ssl: { rejectUnauthorized: false },
  });
  await root.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await root.end();
  console.log(`[init-db] Database \`${database}\` ready.`);

  const { getDb } = await import("../lib/db.ts");
  const db = await getDb();

  const conn = await db.getConnection();
  try {
    const [tables] = (await conn.query("SHOW TABLES")) as any;
    console.log(
      `[init-db] Tables present: ${tables.map((r: any) => Object.values(r)[0]).join(", ")}`
    );
  } finally {
    conn.release();
  }

  await db.end();
  console.log("[init-db] Done. Schema + seed applied.");
}

main().catch((err) => {
  console.error("[init-db] FAILED:", err);
  process.exit(1);
});
