#!/usr/bin/env node
/* eslint-disable no-console */
import "dotenv/config";
import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  MYSQLDUMP_PATH = "mysqldump",
} = process.env;

function need(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`[db:backup] Missing env var: ${name}`);
    process.exit(1);
  }
  return v;
}

const host = DB_HOST ?? need("DB_HOST");
const port = DB_PORT ?? "3306";
const user = DB_USER ?? need("DB_USER");
const password = DB_PASSWORD ?? need("DB_PASSWORD");
const database = DB_NAME ?? need("DB_NAME");

const dir = join(process.cwd(), "backups");
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = join(dir, `${database}-${stamp}.sql`);

console.log(`[db:backup] Writing ${out} ...`);

const child = spawn(
  MYSQLDUMP_PATH,
  [
    `-h${host}`,
    `-P${port}`,
    `-u${user}`,
    `--single-transaction`,
    `--routines`,
    `--triggers`,
    `--add-drop-table`,
    database,
  ],
  { stdio: ["ignore", "pipe", "inherit"], env: { ...process.env, MYSQL_PWD: password } }
);

const fs = await import("fs");
const stream = fs.createWriteStream(out);
child.stdout.pipe(stream);

child.on("exit", (code) => {
  if (code === 0) {
    console.log(`[db:backup] Done: ${out}`);
  } else {
    console.error(`[db:backup] mysqldump exited with code ${code}`);
    process.exit(code ?? 1);
  }
});
