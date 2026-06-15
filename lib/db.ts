import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var __mysqlInitPromise: Promise<mysql.Pool> | undefined;
}

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "portofoliobeta";

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
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quote TEXT,
      name VARCHAR(255),
      title VARCHAR(255),
      position INT NOT NULL DEFAULT 0
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
    CREATE TABLE IF NOT EXISTS social_media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      img VARCHAR(255),
      position INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS tech_icons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
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
    ["About", "#about"],
    ["Projects", "#projects"],
    ["Testimonials", "#testimonials"],
    ["Contact", "#contact"],
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
      `INSERT INTO grid_items (title, description, class_name, img_class_name, title_class_name, img, spare_img, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.title,
        g.description,
        g.class_name,
        g.img_class_name,
        g.title_class_name,
        g.img,
        g.spare_img,
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
      `INSERT INTO projects (title, des, img, icon_lists, link, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
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

  const seedSocial = ["/git.svg", "/twit.svg", "/link.svg"];
  for (let i = 0; i < seedSocial.length; i++) {
    await conn.query(
      "INSERT INTO social_media (img, position) VALUES (?, ?)",
      [seedSocial[i], i]
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

// Migration: add the 3 extra icons to existing DBs (idempotent)
async function ensureExtraTechIcons(conn: mysql.Connection) {
  const extra = [
    { label: "CSS3", path: "/css-3.svg" },
    { label: "HTML5", path: "/html.svg" },
    { label: "JavaScript", path: "/js.svg" },
  ];
  for (let i = 0; i < extra.length; i++) {
    const { label, path } = extra[i];
    const [existing] = (await conn.query(
      "SELECT id FROM tech_icons WHERE label = ? OR path = ? LIMIT 1",
      [label, path]
    )) as any;
    if (existing.length > 0) {
      console.log(`[migrate] tech_icons: ${label} already exists, skipping`);
      continue;
    }
    await conn.query(
      "INSERT INTO tech_icons (label, path, position) VALUES (?, ?, ?)",
      [label, path, 9 + i]
    );
    console.log(`[migrate] tech_icons: inserted ${label} (${path})`);
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

  // Always ensure schema is up-to-date (idempotent CREATE IF NOT EXISTS).
  // This way, new tables added between server restarts are created on first request.
  const conn = await p.getConnection();
  try {
    await initSchema(conn);
    await seedProjectsIfEmpty(conn);
    await seedTechIconsIfEmpty(conn);
    await ensureExtraTechIcons(conn);
  } finally {
    conn.release();
  }

  return p;
}
