import type mysql from "mysql2/promise";
import { getDb } from "./db";
import { revalidatePath } from "next/cache";

export type NavItem = { id: number; name: string; link: string; position: number };
export type GridItem = {
  id: number;
  title: string;
  description: string;
  className: string;
  imgClassName: string;
  titleClassName: string;
  img: string;
  spareImg: string;
  leftLists: string[];
  rightLists: string[];
  position: number;
};
export type Project = {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  enabled: boolean;
  position: number;
};
export type Testimonial = {
  id: number;
  quote: string;
  name: string;
  title: string;
  position: number;
};
export type Company = {
  id: number;
  name: string;
  img: string;
  nameImg: string;
  enabled: boolean;
  position: number;
};
export type Experience = {
  id: number;
  title: string;
  description: string;
  className: string;
  thumbnail: string;
  position: number;
};
export type Social = {
  id: number;
  label: string;
  img: string;
  link: string | null;
  enabled: boolean;
  position: number;
};
export type Service = {
  id: number;
  icon: string;
  title: string;
  description: string;
  tone: string;
  position: number;
};
export type Profile = {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string | null;
  bio1: string | null;
  bio2: string | null;
};
export type Skill = {
  id: number;
  group_name: string;
  label: string;
  position: number;
};
export type Education = {
  id: number;
  school: string;
  period: string;
  level: string;
  description: string;
  position: number;
};

export type Settings = {
  maxAvatarSize: number;
  maxCoverSize: number;
  maxSocialSize: number;
  maxCompanySize: number;
  maxIconSize: number;
  maxProjectImageSize: number;
  allowedImageTypes: string[];
};

export const DEFAULT_SETTINGS: Settings = {
  maxAvatarSize: 3 * 1024 * 1024,    // 3 MB
  maxCoverSize: 3 * 1024 * 1024,     // 3 MB
  maxSocialSize: 2 * 1024 * 1024,    // 2 MB
  maxCompanySize: 2 * 1024 * 1024,   // 2 MB
  maxIconSize: 100 * 1024,            // 100 KB
  maxProjectImageSize: 5 * 1024 * 1024, // 5 MB
  allowedImageTypes: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ],
};

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  try {
    const [rows] = (await db.query(
      "SELECT config FROM app_settings WHERE id = 1"
    )) as any;
    const row = rows[0];
    if (!row?.config) return DEFAULT_SETTINGS;
    const parsed = typeof row.config === "string" ? JSON.parse(row.config) : row.config;
    // Merge with defaults so new fields always have a value
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(input: Partial<Settings>) {
  const db = await getDb();
  const current = await getSettings();
  const merged = { ...current, ...input };
  await db.query(
    `INSERT INTO app_settings (id, config) VALUES (1, ?)
     ON DUPLICATE KEY UPDATE config = VALUES(config)`,
    [JSON.stringify(merged)]
  );
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

function rowToGrid(r: any): GridItem {
  return {
    id: r.id,
    title: r.title ?? "",
    description: r.description ?? "",
    className: r.class_name ?? "",
    imgClassName: r.img_class_name ?? "",
    titleClassName: r.title_class_name ?? "",
    img: r.img ?? "",
    spareImg: r.spare_img ?? "",
    leftLists: parseJsonArray(r.left_lists),
    rightLists: parseJsonArray(r.right_lists),
    position: r.position,
  };
}

function parseJsonArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowToProject(r: any): Project {
  let lists: string[] = [];
  try {
    lists = typeof r.icon_lists === "string" ? JSON.parse(r.icon_lists) : r.icon_lists ?? [];
  } catch {
    lists = [];
  }
  return {
    id: r.id,
    title: r.title,
    des: r.des ?? "",
    img: r.img ?? "",
    iconLists: lists,
    link: r.link ?? "",
    enabled: r.enabled ?? 1,
    position: r.position,
  };
}

function rowToCompany(r: any): Company {
  return {
    id: r.id,
    name: r.name ?? "",
    img: r.img ?? "",
    nameImg: r.name_img ?? "",
    enabled: r.enabled ?? 1,
    position: r.position,
  };
}

function rowToExperience(r: any): Experience {
  return {
    id: r.id,
    title: r.title ?? "",
    description: r.description ?? "",
    className: r.class_name ?? "",
    thumbnail: r.thumbnail ?? "",
    position: r.position,
  };
}

export async function getNavItems(): Promise<NavItem[]> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT * FROM nav_items ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

export async function getGridItems(): Promise<GridItem[]> {
  const db = await getDb();
  await ensureGridItemsListsColumns(db);
  const [rows] = (await db.query(
    "SELECT * FROM grid_items ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToGrid);
}

async function ensureGridItemsListsColumns(db: mysql.Pool) {
  try {
    const [leftCols] = (await db.query(
      "SHOW COLUMNS FROM grid_items LIKE 'left_lists'"
    )) as any;
    if (leftCols.length === 0) {
      await db.query("ALTER TABLE grid_items ADD COLUMN left_lists JSON");
    }
    const [rightCols] = (await db.query(
      "SHOW COLUMNS FROM grid_items LIKE 'right_lists'"
    )) as any;
    if (rightCols.length === 0) {
      await db.query("ALTER TABLE grid_items ADD COLUMN right_lists JSON");
    }
  } catch (err: any) {
    if (err?.errno !== 1146) throw err;
  }
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  await ensureProjectsEnabledColumn(db);
  const [rows] = (await db.query(
    "SELECT * FROM projects ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToProject);
}

async function ensureProjectsEnabledColumn(db: mysql.Pool) {
  try {
    const [cols] = (await db.query(
      "SHOW COLUMNS FROM projects LIKE 'enabled'"
    )) as any;
    if (cols.length === 0) {
      await db.query(
        "ALTER TABLE projects ADD COLUMN enabled TINYINT(1) NOT NULL DEFAULT 1"
      );
    }
  } catch (err: any) {
    if (err?.errno !== 1146) throw err;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT * FROM testimonials ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

export async function getCompanies(): Promise<Company[]> {
  const db = await getDb();
  await ensureCompaniesEnabledColumn(db);
  const [rows] = (await db.query(
    "SELECT * FROM companies ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToCompany);
}

async function ensureCompaniesEnabledColumn(db: mysql.Pool) {
  try {
    const [cols] = (await db.query(
      "SHOW COLUMNS FROM companies LIKE 'enabled'"
    )) as any;
    if (cols.length === 0) {
      await db.query(
        "ALTER TABLE companies ADD COLUMN enabled TINYINT(1) NOT NULL DEFAULT 1"
      );
    }
  } catch (err: any) {
    if (err?.errno !== 1146) throw err;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT * FROM work_experience ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToExperience);
}

export async function getSocials(): Promise<Social[]> {
  const db = await getDb();
  await ensureSocialsTable(db);
  const [rows] = (await db.query(
    "SELECT * FROM socials ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

async function ensureSocialsTable(db: mysql.Pool) {
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
}

async function ensureServicesTable(db: mysql.Pool) {
  try {
    await db.query("SELECT 1 FROM services LIMIT 1");
  } catch (err: any) {
    if (err?.errno === 1146 || err?.code === "ER_NO_SUCH_TABLE") {
      await db.query(`
        CREATE TABLE services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          icon VARCHAR(64) NOT NULL,
          title VARCHAR(128) NOT NULL,
          description TEXT,
          tone VARCHAR(32) NOT NULL DEFAULT 'violet',
          position INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    } else {
      throw err;
    }
  }
}

export async function getServices(): Promise<Service[]> {
  const db = await getDb();
  await ensureServicesTable(db);
  const [rows] = (await db.query(
    "SELECT * FROM services ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

async function ensureProfileTable(db: mysql.Pool) {
  try {
    await db.query("SELECT 1 FROM profile LIMIT 1");
  } catch (err: any) {
    if (err?.errno === 1146 || err?.code === "ER_NO_SUCH_TABLE") {
      await db.query(`
        CREATE TABLE profile (
          id INT PRIMARY KEY DEFAULT 1,
          name VARCHAR(128) NOT NULL DEFAULT 'Zra Vanilla',
          role VARCHAR(255) NOT NULL DEFAULT 'Graphic Designer & Web Developer',
          location VARCHAR(255) NOT NULL DEFAULT 'Pekanbaru, Riau, Indonesia',
          avatar VARCHAR(500),
          bio1 TEXT,
          bio2 TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    } else {
      throw err;
    }
  }
}

const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "Zra Vanilla",
  role: "Graphic Designer & Web Developer",
  location: "Pekanbaru, Riau, Indonesia",
  avatar: null,
  bio1:
    "My name is Zra, a passionate graphic designer and web developer based in Pekanbaru, Riau, Indonesia. With a keen eye for aesthetics and a love for technology, I specialize in creating visually stunning designs and functional websites that leave a lasting impression. My journey in design and development has been fueled by a desire to blend creativity with code, delivering unique digital experiences that resonate with users.",
  bio2:
    "I like making designs that are simple, clean, and modern. I have experience in creating logos, branding, social media content, and print materials for various clients and agencies. I also enjoy exploring UI/UX design and creating user-friendly interfaces for websites and apps.",
};

export async function getProfile(): Promise<Profile> {
  const db = await getDb();
  await ensureProfileTable(db);
  const [rows] = (await db.query(
    "SELECT id, name, role, location, bio1, bio2 FROM profile WHERE id = 1"
  )) as any;
  if (rows.length === 0) {
    // Auto-seed default profile on first read
    await db.query(
      `INSERT INTO profile (id, name, role, location, avatar, bio1, bio2)
       VALUES (1, ?, ?, ?, NULL, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [
        DEFAULT_PROFILE.name,
        DEFAULT_PROFILE.role,
        DEFAULT_PROFILE.location,
        DEFAULT_PROFILE.bio1,
        DEFAULT_PROFILE.bio2,
      ]
    );
    return DEFAULT_PROFILE;
  }
  return {
    id: rows[0].id,
    name: rows[0].name,
    role: rows[0].role,
    location: rows[0].location,
    avatar: rows[0].avatar,
    bio1: rows[0].bio1,
    bio2: rows[0].bio2,
  };
}

export async function updateProfile(input: {
  name: string;
  role: string;
  location: string;
  avatar: string | null;
  bio1: string | null;
  bio2: string | null;
}) {
  const db = await getDb();
  await ensureProfileTable(db);
  await db.query(
    `INSERT INTO profile (id, name, role, location, avatar, bio1, bio2)
     VALUES (1, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       role = VALUES(role),
       location = VALUES(location),
       avatar = VALUES(avatar),
       bio1 = VALUES(bio1),
       bio2 = VALUES(bio2)`,
    [input.name, input.role, input.location, input.avatar, input.bio1, input.bio2]
  );
  revalidatePath("/admin/profile");
  revalidatePath("/info");
}

export async function getSkills(): Promise<Skill[]> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT * FROM skills ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

export async function getEducations(): Promise<Education[]> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT * FROM educations ORDER BY position ASC, id ASC"
  )) as any;
  return rows;
}

async function nextPosition(table: string): Promise<number> {
  const db = await getDb();
  const [rows] = (await db.query(
    `SELECT COALESCE(MAX(position), -1) + 1 AS p FROM \`${table}\``
  )) as any;
  return rows[0].p;
}

export async function createProject(input: Omit<Project, "id" | "position">) {
  const db = await getDb();
  await ensureProjectsEnabledColumn(db);
  const pos = await nextPosition("projects");
  await db.query(
    "INSERT INTO projects (title, des, img, icon_lists, link, enabled, position) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      input.title,
      input.des,
      input.img,
      JSON.stringify(input.iconLists),
      input.link,
      input.enabled ? 1 : 0,
      pos,
    ]
  );
  revalidatePath("/");
}

export async function updateProject(id: number, input: Omit<Project, "id" | "position">) {
  const db = await getDb();
  await ensureProjectsEnabledColumn(db);
  await db.query(
    "UPDATE projects SET title=?, des=?, img=?, icon_lists=?, link=?, enabled=? WHERE id=?",
    [
      input.title,
      input.des,
      input.img,
      JSON.stringify(input.iconLists),
      input.link,
      input.enabled ? 1 : 0,
      id,
    ]
  );
  revalidatePath("/");
}

export async function setProjectEnabled(id: number, enabled: boolean) {
  const db = await getDb();
  await ensureProjectsEnabledColumn(db);
  await db.query("UPDATE projects SET enabled=? WHERE id=?", [
    enabled ? 1 : 0,
    id,
  ]);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM projects WHERE id=?", [id]);
  revalidatePath("/");
}

export async function createGridItem(input: Omit<GridItem, "id" | "position">) {
  const db = await getDb();
  await ensureGridItemsListsColumns(db);
  const pos = await nextPosition("grid_items");
  await db.query(
    `INSERT INTO grid_items (title, description, class_name, img_class_name, title_class_name, img, spare_img, left_lists, right_lists, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.description,
      input.className,
      input.imgClassName,
      input.titleClassName,
      input.img,
      input.spareImg,
      JSON.stringify(input.leftLists ?? []),
      JSON.stringify(input.rightLists ?? []),
      pos,
    ]
  );
  revalidatePath("/");
}

export async function updateGridItem(id: number, input: Omit<GridItem, "id" | "position">) {
  const db = await getDb();
  await ensureGridItemsListsColumns(db);
  await db.query(
    `UPDATE grid_items SET title=?, description=?, class_name=?, img_class_name=?, title_class_name=?, img=?, spare_img=?, left_lists=?, right_lists=? WHERE id=?`,
    [
      input.title,
      input.description,
      input.className,
      input.imgClassName,
      input.titleClassName,
      input.img,
      input.spareImg,
      JSON.stringify(input.leftLists ?? []),
      JSON.stringify(input.rightLists ?? []),
      id,
    ]
  );
  revalidatePath("/");
}

export async function deleteGridItem(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM grid_items WHERE id=?", [id]);
  revalidatePath("/");
}

export async function createTestimonial(input: Omit<Testimonial, "id" | "position">) {
  const db = await getDb();
  const pos = await nextPosition("testimonials");
  await db.query(
    "INSERT INTO testimonials (quote, name, title, position) VALUES (?, ?, ?, ?)",
    [input.quote, input.name, input.title, pos]
  );
  revalidatePath("/");
}

export async function updateTestimonial(id: number, input: Omit<Testimonial, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE testimonials SET quote=?, name=?, title=? WHERE id=?",
    [input.quote, input.name, input.title, id]
  );
  revalidatePath("/");
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM testimonials WHERE id=?", [id]);
  revalidatePath("/");
}

export async function createCompany(input: Omit<Company, "id" | "position">) {
  const db = await getDb();
  await ensureCompaniesEnabledColumn(db);
  const pos = await nextPosition("companies");
  await db.query(
    "INSERT INTO companies (name, img, name_img, enabled, position) VALUES (?, ?, ?, ?, ?)",
    [input.name, input.img, input.nameImg, input.enabled ? 1 : 0, pos]
  );
  revalidatePath("/admin/companies");
  revalidatePath("/");
}

export async function updateCompany(id: number, input: Omit<Company, "id" | "position">) {
  const db = await getDb();
  await ensureCompaniesEnabledColumn(db);
  await db.query(
    "UPDATE companies SET name=?, img=?, name_img=?, enabled=? WHERE id=?",
    [input.name, input.img, input.nameImg, input.enabled ? 1 : 0, id]
  );
  revalidatePath("/admin/companies");
  revalidatePath("/");
}

export async function setCompanyEnabled(id: number, enabled: boolean) {
  const db = await getDb();
  await ensureCompaniesEnabledColumn(db);
  await db.query("UPDATE companies SET enabled=? WHERE id=?", [
    enabled ? 1 : 0,
    id,
  ]);
  revalidatePath("/admin/companies");
  revalidatePath("/");
}

export async function deleteCompany(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM companies WHERE id=?", [id]);
  revalidatePath("/");
}

export async function createExperience(input: Omit<Experience, "id" | "position">) {
  const db = await getDb();
  const pos = await nextPosition("work_experience");
  await db.query(
    "INSERT INTO work_experience (title, description, class_name, thumbnail, position) VALUES (?, ?, ?, ?, ?)",
    [input.title, input.description, input.className, input.thumbnail, pos]
  );
  revalidatePath("/");
}

export async function updateExperience(id: number, input: Omit<Experience, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE work_experience SET title=?, description=?, class_name=?, thumbnail=? WHERE id=?",
    [input.title, input.description, input.className, input.thumbnail, id]
  );
  revalidatePath("/");
}

export async function deleteExperience(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM work_experience WHERE id=?", [id]);
  revalidatePath("/");
}

export async function createSocial(input: Omit<Social, "id" | "position">) {
  const db = await getDb();
  await ensureSocialsTable(db);
  const pos = await nextPosition("socials");
  await db.query(
    "INSERT INTO socials (label, img, link, enabled, position) VALUES (?, ?, ?, ?, ?)",
    [input.label, input.img, input.link ?? null, input.enabled ? 1 : 0, pos]
  );
  revalidatePath("/admin/social");
  revalidatePath("/admin/assets");
  revalidatePath("/");
}

export async function updateSocial(id: number, input: Omit<Social, "id" | "position">) {
  const db = await getDb();
  await ensureSocialsTable(db);
  await db.query(
    "UPDATE socials SET label=?, img=?, link=?, enabled=? WHERE id=?",
    [input.label, input.img, input.link ?? null, input.enabled ? 1 : 0, id]
  );
  revalidatePath("/admin/social");
  revalidatePath("/admin/assets");
  revalidatePath("/");
}

export async function setSocialEnabled(id: number, enabled: boolean) {
  const db = await getDb();
  await ensureSocialsTable(db);
  await db.query("UPDATE socials SET enabled=? WHERE id=?", [
    enabled ? 1 : 0,
    id,
  ]);
  revalidatePath("/admin/social");
  revalidatePath("/");
}

export async function deleteSocial(id: number) {
  const db = await getDb();
  await ensureSocialsTable(db);
  await db.query("DELETE FROM socials WHERE id=?", [id]);
  revalidatePath("/admin/social");
  revalidatePath("/admin/assets");
  revalidatePath("/");
}

async function nextServicePosition(): Promise<number> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM services"
  )) as any;
  return rows[0].p;
}

export async function createService(input: Omit<Service, "id" | "position">) {
  const db = await getDb();
  await ensureServicesTable(db);
  const pos = await nextServicePosition();
  await db.query(
    "INSERT INTO services (icon, title, description, tone, position) VALUES (?, ?, ?, ?, ?)",
    [input.icon, input.title, input.description, input.tone, pos]
  );
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function updateService(id: number, input: Omit<Service, "id" | "position">) {
  const db = await getDb();
  await ensureServicesTable(db);
  await db.query(
    "UPDATE services SET icon=?, title=?, description=?, tone=? WHERE id=?",
    [input.icon, input.title, input.description, input.tone, id]
  );
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM services WHERE id=?", [id]);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function createNav(input: Omit<NavItem, "id" | "position">) {
  const db = await getDb();
  const pos = await nextPosition("nav_items");
  await db.query(
    "INSERT INTO nav_items (name, link, position) VALUES (?, ?, ?)",
    [input.name, input.link, pos]
  );
  revalidatePath("/");
}

export async function updateNav(id: number, input: Omit<NavItem, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE nav_items SET name=?, link=? WHERE id=?",
    [input.name, input.link, id]
  );
  revalidatePath("/");
}

export async function deleteNav(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM nav_items WHERE id=?", [id]);
}

async function nextSkillPosition(): Promise<number> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM skills"
  )) as any;
  return rows[0].p;
}

export async function createSkill(input: Omit<Skill, "id" | "position">) {
  const db = await getDb();
  const pos = await nextSkillPosition();
  await db.query(
    "INSERT INTO skills (group_name, label, position) VALUES (?, ?, ?)",
    [input.group_name, input.label, pos]
  );
  revalidatePath("/admin/skills");
  revalidatePath("/info");
}

export async function updateSkill(id: number, input: Omit<Skill, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE skills SET group_name=?, label=? WHERE id=?",
    [input.group_name, input.label, id]
  );
  revalidatePath("/admin/skills");
  revalidatePath("/info");
}

export async function deleteSkill(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM skills WHERE id=?", [id]);
  revalidatePath("/admin/skills");
  revalidatePath("/info");
}

async function nextEducationPosition(): Promise<number> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS p FROM educations"
  )) as any;
  return rows[0].p;
}

export async function createEducation(input: Omit<Education, "id" | "position">) {
  const db = await getDb();
  const pos = await nextEducationPosition();
  await db.query(
    "INSERT INTO educations (school, period, level, description, position) VALUES (?, ?, ?, ?, ?)",
    [input.school, input.period, input.level, input.description, pos]
  );
  revalidatePath("/admin/educations");
  revalidatePath("/info");
}

export async function updateEducation(id: number, input: Omit<Education, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE educations SET school=?, period=?, level=?, description=? WHERE id=?",
    [input.school, input.period, input.level, input.description, id]
  );
  revalidatePath("/admin/educations");
  revalidatePath("/info");
}

export async function deleteEducation(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM educations WHERE id=?", [id]);
  revalidatePath("/admin/educations");
  revalidatePath("/info");
}
