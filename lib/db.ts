import "dotenv/config";
import mysql from "mysql2/promise";

const DEBUG_MODE =
  String(process.env.DEBUG_MODE ?? "").toLowerCase() === "true";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var __mysqlInitPromise: Promise<mysql.Pool> | undefined;
}

export const isDebugMode = DEBUG_MODE;

function requireEnv(name: string): string {
  if (!(name in process.env)) {
    throw new Error(
      `[portofolio-beta] Missing required env var: ${name}. ` +
        `Add it to your .env file (e.g. ${name}=).`
    );
  }
  return process.env[name] as string;
}

function requireEnvNumber(name: string): number {
  const raw = requireEnv(name);
  const num = Number(raw);
  if (!Number.isFinite(num)) {
    throw new Error(
      `[portofolio-beta] Env var ${name} must be a number, got: ${raw}`
    );
  }
  return num;
}

const DB_HOST = requireEnv("DB_HOST");
const DB_PORT = requireEnvNumber("DB_PORT");
const DB_USER = requireEnv("DB_USER");
const DB_PASSWORD = requireEnv("DB_PASSWORD");
const DB_NAME = requireEnv("DB_NAME");

let pool: mysql.Pool | null = global.__mysqlPool ?? null;
let initPromise: Promise<mysql.Pool> | null = global.__mysqlInitPromise ?? null;

async function ensureDatabase() {
  const root = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await root.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await root.end();
}

async function initSchema(conn: mysql.Connection) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS nav_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      link VARCHAR(255) NOT NULL,
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS grid_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title TEXT,
      description TEXT,
      class_name VARCHAR(255),
      img_class_name VARCHAR(255),
      title_class_name VARCHAR(255),
      img VARCHAR(255),
      spare_img VARCHAR(255),
      left_lists JSON,
      right_lists JSON,
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      des TEXT,
      img VARCHAR(255),
      icon_lists JSON,
      link VARCHAR(255),
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS work_experience (
      title VARCHAR(255) NOT NULL,
      description TEXT,
      class_name VARCHAR(255),
      thumbnail VARCHAR(255),
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      icon VARCHAR(64) NOT NULL,
      title VARCHAR(128) NOT NULL,
      description TEXT,
      tone VARCHAR(32) NOT NULL DEFAULT 'violet',
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS profile (
      id INT PRIMARY KEY DEFAULT 1,
      name VARCHAR(128) NOT NULL DEFAULT 'Zra Vanilla',
      role VARCHAR(255) NOT NULL DEFAULT 'Graphic Designer & Web Developer',
      location VARCHAR(255) NOT NULL DEFAULT 'Pekanbaru, Riau, Indonesia',
      avatar VARCHAR(500),
      bio1 TEXT,
      bio2 TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      img VARCHAR(255),
      name_img VARCHAR(255),
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS work_experience (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      class_name VARCHAR(255),
      thumbnail VARCHAR(255),
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS socials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      img VARCHAR(255) NOT NULL,
      link VARCHAR(500),
      enabled TINYINT(1) NOT NULL DEFAULT 1,
      position INT NOT NULL DEFAULT 0,
      UNIQUE KEY uk_socials_img (img)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS tech_icons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
      position INT NOT NULL DEFAULT 0,
      UNIQUE KEY uk_tech_path (path)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS covers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
      position INT NOT NULL DEFAULT 0,
      UNIQUE KEY uk_covers_path (path)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      group_name VARCHAR(64) NOT NULL,
      label VARCHAR(128) NOT NULL,
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS educations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      school VARCHAR(255) NOT NULL,
      period VARCHAR(64) NOT NULL,
      level VARCHAR(128) NOT NULL,
      description TEXT,
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS _meta (
      \`key\` VARCHAR(64) PRIMARY KEY,
      value VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function seedProjectsIfEmpty(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('seeded_projects', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  const seedNav = [
    ["About", "/#about"],
    ["Projects", "/#projects"],
    ["Testimonials", "/#testimonials"],
    ["Contact", "/#contact"],
  ];
  for (let i = 0; i < seedNav.length; i++) {
    await conn.query(
      "INSERT INTO nav_items (name, link, position) VALUES (?, ?, ?)",
      [seedNav[i][0], seedNav[i][1], i]
    );
  }

  const seedGrid = [
    {
      title: "I prioritize client collaboration, fostering open communication ",
      description: "",
      class_name: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      img_class_name: "w-full h-full",
      title_class_name: "justify-end",
      img: "/b1.svg",
      spare_img: "",
    },
    {
      title: "I'm very flexible with time zone communications",
      description: "",
      class_name: "lg:col-span-2 md:col-span-3 md:row-span-2",
      img_class_name: "",
      title_class_name: "justify-start",
      img: "",
      spare_img: "",
    },
    {
      title: "My tech stack",
      description: "I constantly try to improve",
      class_name: "lg:col-span-2 md:col-span-3 md:row-span-2",
      img_class_name: "",
      title_class_name: "justify-center",
      img: "",
      spare_img: "",
      left_lists: ["ReactJS", "Express", "Typescript"],
      right_lists: ["VueJS", "NuxtJS", "GraphQL"],
    },
    {
      title: "Tech enthusiast with a passion for development.",
      description: "",
      class_name: "lg:col-span-2 md:col-span-3 md:row-span-1",
      img_class_name: "",
      title_class_name: "justify-start",
      img: "/grid.svg",
      spare_img: "/b4.svg",
    },
    {
      title: "Currently building a JS Animation library",
      description: "The Inside Scoop",
      class_name: "md:col-span-3 md:row-span-2",
      img_class_name: "absolute right-0 bottom-0 md:w-96 w-60",
      title_class_name: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spare_img: "/grid.svg",
    },
    {
      title: "Do you want to start a project together?",
      description: "",
      class_name: "lg:col-span-2 md:col-span-3 md:row-span-1",
      img_class_name: "",
      title_class_name: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spare_img: "",
    },
  ];
  for (let i = 0; i < seedGrid.length; i++) {
    const g = seedGrid[i];
    await conn.query(
      `INSERT INTO grid_items (title, description, class_name, img_class_name, title_class_name, img, spare_img, left_lists, right_lists, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.title,
        g.description,
        g.class_name,
        g.img_class_name,
        g.title_class_name,
        g.img,
        g.spare_img,
        g.left_lists ? JSON.stringify(g.left_lists) : null,
        g.right_lists ? JSON.stringify(g.right_lists) : null,
        i,
      ]
    );
  }

  const seedProjects = [
    {
      title: "3D Solar System Planets to Explore",
      des: "Explore the wonders of our solar system with this captivating 3D simulation of the planets using Three.js.",
      img: "/p1.svg",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
      link: "/ui.earth.com",
    },
    {
      title: "Yoom - Video Conferencing App",
      des: "Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.",
      img: "/p2.svg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
      link: "/ui.yoom.com",
    },
    {
      title: "AI Image SaaS - Canva Application",
      des: "A REAL Software-as-a-Service app with AI features and a payments and credits system using the latest tech stack.",
      img: "/p3.svg",
      iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
      link: "/ui.aiimg.com",
    },
    {
      title: "Animated Apple Iphone 3D Website",
      des: "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects..",
      img: "/p4.svg",
      iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
      link: "/ui.apple.com",
    },
  ];
  for (let i = 0; i < seedProjects.length; i++) {
    const p = seedProjects[i];
    await conn.query(
      `INSERT INTO projects (title, des, img, icon_lists, link, enabled, position)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [p.title, p.des, p.img, JSON.stringify(p.iconLists), p.link, i]
    );
  }

  const seedTestimonials = [
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
    {
      quote:
        "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
      name: "Michael Johnson",
      title: "Director of AlphaStream Technologies",
    },
  ];
  for (let i = 0; i < seedTestimonials.length; i++) {
    const t = seedTestimonials[i];
    await conn.query(
      `INSERT INTO testimonials (quote, name, title, position) VALUES (?, ?, ?, ?)`,
      [t.quote, t.name, t.title, i]
    );
  }

  const seedCompanies = [
    { name: "cloudinary", img: "/cloud.svg", name_img: "/cloudName.svg" },
    { name: "appwrite", img: "/app.svg", name_img: "/appName.svg" },
    { name: "HOSTINGER", img: "/host.svg", name_img: "/hostName.svg" },
    { name: "stream", img: "/s.svg", name_img: "/streamName.svg" },
    { name: "docker.", img: "/dock.svg", name_img: "/dockerName.svg" },
  ];
  for (let i = 0; i < seedCompanies.length; i++) {
    const c = seedCompanies[i];
    await conn.query(
      `INSERT INTO companies (name, img, name_img, position) VALUES (?, ?, ?, ?)`,
      [c.name, c.img, c.name_img, i]
    );
  }

  const seedExperience = [
    {
      title: "Frontend Engineer Intern",
      description:
        "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
      class_name: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      title: "Mobile App Dev - JSM Tech",
      description:
        "Designed and developed mobile app for both iOS & Android platforms using React Native.",
      class_name: "md:col-span-2",
      thumbnail: "/exp2.svg",
    },
    {
      title: "Freelance App Dev Project",
      description:
        "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
      class_name: "md:col-span-2",
      thumbnail: "/exp3.svg",
    },
    {
      title: "Lead Frontend Developer",
      description:
        "Developed and maintained user-facing features using modern frontend technologies.",
      class_name: "md:col-span-2",
      thumbnail: "/exp4.svg",
    },
  ];
  for (let i = 0; i < seedExperience.length; i++) {
    const e = seedExperience[i];
    await conn.query(
      `INSERT INTO work_experience (title, description, class_name, thumbnail, position) VALUES (?, ?, ?, ?, ?)`,
      [e.title, e.description, e.class_name, e.thumbnail, i]
    );
  }
}

async function seedTechIconsIfEmpty(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('seeded_tech_icons', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  const [techRows] = (await conn.query(
    "SELECT COUNT(*) as c FROM tech_icons"
  )) as any;
  if (techRows[0].c > 0) return;

  const seedTechIcons = [
    { label: "React", path: "/re.svg" },
    { label: "Next.js", path: "/next.svg" },
    { label: "TypeScript", path: "/ts.svg" },
    { label: "Tailwind", path: "/tail.svg" },
    { label: "Three.js", path: "/three.svg" },
    { label: "Framer Motion", path: "/fm.svg" },
    { label: "C", path: "/c.svg" },
    { label: "Stream", path: "/stream.svg" },
    { label: "GSAP", path: "/gsap.svg" },
    { label: "CSS3", path: "/css-3.svg" },
    { label: "HTML5", path: "/html.svg" },
    { label: "JavaScript", path: "/js.svg" },
  ];
  for (let i = 0; i < seedTechIcons.length; i++) {
    await conn.query(
      "INSERT INTO tech_icons (label, path, position) VALUES (?, ?, ?)",
      [seedTechIcons[i].label, seedTechIcons[i].path, i]
    );
  }
}

// One-time migration: normalize nav anchor links to be absolute (/#anchor).
// Existing rows may have "#about" which becomes "info#about" when clicked from /info.
// Idempotent: after run, links start with "/#" so WHERE clause doesn't match them.
async function fixNavAnchorLinks(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('nav_anchors_absolute_v1', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  await conn.query(
    `UPDATE nav_items
     SET link = CONCAT('/', link)
     WHERE link LIKE '#%'`
  );
  console.log("[migrate] nav_items: normalized anchor links to /#anchor");
}

// One-time migration: rename `assets` table to `covers` and drop `kind` column.
// Idempotent: gated by _meta flag. If assets table doesn't exist (fresh install),
// this is a no-op.
async function migrateAssetsToCovers(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('migrated_assets_to_covers_v1', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  const [tables] = (await conn.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'assets'`,
    [DB_NAME]
  )) as any;

  if (tables.length === 0) return;

  try {
    await conn.query(`
      INSERT INTO covers (id, label, path, position)
      SELECT id, label, path, position FROM assets WHERE kind = 'cover'
      ON DUPLICATE KEY UPDATE label = VALUES(label), path = VALUES(path), position = VALUES(position)
    `);
    await conn.query("DROP TABLE IF EXISTS assets");
    console.log("[migrate] assets → covers: copied cover rows, dropped assets");
  } catch (err) {
    console.error("[migrate] assets → covers FAILED:", err);
  }
}

async function seedSkillsIfEmpty(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('seeded_skills', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  const [rows] = (await conn.query(
    "SELECT COUNT(*) as c FROM skills"
  )) as any;
  if (rows[0].c > 0) return;

  const seedSkills = [
    { group_name: "Design", label: "Photoshop" },
    { group_name: "Design", label: "Alight Motion" },
    { group_name: "Design", label: "Canva" },
    { group_name: "Web", label: "HTML" },
    { group_name: "Web", label: "CSS" },
    { group_name: "Web", label: "JavaScript" },
  ];
  for (let i = 0; i < seedSkills.length; i++) {
    await conn.query(
      "INSERT INTO skills (group_name, label, position) VALUES (?, ?, ?)",
      [seedSkills[i].group_name, seedSkills[i].label, i]
    );
  }
}

// One-time migration: add UNIQUE constraint on `path` columns of tech_icons
// and covers. Idempotent: gated by _meta. Skips if duplicate data already
// exists (logs error, doesn't fail the whole migration).
async function addAssetUniqueConstraints(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('asset_unique_constraints_v1', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  for (const { table, keyName, label } of [
    { table: "tech_icons", keyName: "uk_tech_path", label: "tech_icons.path" },
    { table: "covers", keyName: "uk_covers_path", label: "covers.path" },
  ]) {
    try {
      const [exists] = (await conn.query(
        `SELECT 1 FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = 'path' AND NON_UNIQUE = 0`,
        [DB_NAME, table]
      )) as any;
      if (exists.length === 0) {
        await conn.query(
          `ALTER TABLE \`${table}\` ADD UNIQUE KEY \`${keyName}\` (path)`
        );
        console.log(`[migrate] ${label}: added UNIQUE constraint`);
      }
    } catch (err: any) {
      console.warn(
        `[migrate] ${label}: could not add UNIQUE — likely duplicate data exists (${err?.code || err?.message})`
      );
    }
  }
}

// One-time seed for services table. Idempotent via _meta flag.
async function seedServicesIfEmpty(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('seeded_services', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  const [rows] = (await conn.query(
    "SELECT COUNT(*) as c FROM services"
  )) as any;
  if (rows[0].c > 0) return;

  const seedServices = [
    { icon: "Palette", title: "Brand & Identity", tone: "fuchsia",
      description: "Logos, brand guidelines, and visual systems that make your business instantly recognizable." },
    { icon: "Code2", title: "Web Development", tone: "violet",
      description: "Modern, fast, and responsive websites built with the latest technologies and best practices." },
    { icon: "Layout", title: "UI / UX Design", tone: "indigo",
      description: "User-centered interfaces that look beautiful and feel intuitive across every screen size." },
    { icon: "Smartphone", title: "Social Media", tone: "sky",
      description: "Eye-catching content that grows your audience and keeps them engaged on every platform." },
    { icon: "Film", title: "Motion & Video", tone: "emerald",
      description: "Animations and short-form video edits that bring your brand to life and stop the scroll." },
    { icon: "Printer", title: "Print Design", tone: "amber",
      description: "Tangible materials that leave a lasting impression long after the screen is closed." },
  ];
  for (let i = 0; i < seedServices.length; i++) {
    const s = seedServices[i];
    await conn.query(
      "INSERT INTO services (icon, title, description, tone, position) VALUES (?, ?, ?, ?, ?)",
      [s.icon, s.title, s.description, s.tone, i]
    );
  }
}

async function seedEducationsIfEmpty(conn: mysql.Connection) {
  const [r] = (await conn.query(
    "INSERT IGNORE INTO _meta (`key`, value) VALUES ('seeded_educations', '1')"
  )) as any;
  if (r.affectedRows === 0) return;

  const [rows] = (await conn.query(
    "SELECT COUNT(*) as c FROM educations"
  )) as any;
  if (rows[0].c > 0) return;

  const seedEducations = [
    {
      school: "SD IT Imam Asy syafi'i 2, Pekanbaru",
      period: "2015 - 2021",
      level: "Sekolah Dasar (SD)",
      description:
        "Completed primary education with a focus on foundational subjects and extracurricular activities.",
    },
    {
      school: "SMP IT Imam An-Nawawi, Pekanbaru",
      period: "2021 - 2024",
      level: "Sekolah Menengah Pertama (SMP)",
      description:
        "Completed junior high school education with a focus on academic excellence and leadership development.",
    },
    {
      school: "SMKN 2 Pekanbaru",
      period: "2024 - Present",
      level: "Sekolah Menengah Kejuruan (SMK)",
      description:
        "Currently pursuing a diploma in Information Technology with a focus on web development and digital design.",
    },
  ];
  for (let i = 0; i < seedEducations.length; i++) {
    const e = seedEducations[i];
    await conn.query(
      "INSERT INTO educations (school, period, level, description, position) VALUES (?, ?, ?, ?, ?)",
      [e.school, e.period, e.level, e.description, i]
    );
  }
}

export async function getDb(): Promise<mysql.Pool> {
  if (pool) return pool;
  if (!initPromise) {
    initPromise = (async () => {
      await ensureDatabase();

      const newPool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        debug: DEBUG_MODE,
      });

      const conn = await newPool.getConnection();
      try {
        await initSchema(conn);
      } finally {
        conn.release();
      }

      pool = newPool;
      global.__mysqlPool = newPool;
      return newPool;
    })();
    global.__mysqlInitPromise = initPromise;
  }

  const p = await initPromise;

  const conn = await p.getConnection();
  try {
    await initSchema(conn);
    await migrateAssetsToCovers(conn);
    await addAssetUniqueConstraints(conn);
    await seedProjectsIfEmpty(conn);
    await seedTechIconsIfEmpty(conn);
    await seedSkillsIfEmpty(conn);
    await seedEducationsIfEmpty(conn);
    await seedServicesIfEmpty(conn);
    await fixNavAnchorLinks(conn);
  } finally {
    conn.release();
  }

  return p;
}
