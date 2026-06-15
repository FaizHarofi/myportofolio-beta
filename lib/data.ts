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
  position: number;
};
export type Project = {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
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
export type Social = { id: number; img: string; position: number };

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
    position: r.position,
  };
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
    position: r.position,
  };
}

function rowToCompany(r: any): Company {
  return {
    id: r.id,
    name: r.name ?? "",
    img: r.img ?? "",
    nameImg: r.name_img ?? "",
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
  const [rows] = (await db.query(
    "SELECT * FROM grid_items ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToGrid);
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  const [rows] = (await db.query(
    "SELECT * FROM projects ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToProject);
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
  const [rows] = (await db.query(
    "SELECT * FROM companies ORDER BY position ASC, id ASC"
  )) as any;
  return rows.map(rowToCompany);
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
  const [rows] = (await db.query(
    "SELECT * FROM social_media ORDER BY position ASC, id ASC"
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
  const pos = await nextPosition("projects");
  await db.query(
    "INSERT INTO projects (title, des, img, icon_lists, link, position) VALUES (?, ?, ?, ?, ?, ?)",
    [
      input.title,
      input.des,
      input.img,
      JSON.stringify(input.iconLists),
      input.link,
      pos,
    ]
  );
  revalidatePath("/");
}

export async function updateProject(id: number, input: Omit<Project, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE projects SET title=?, des=?, img=?, icon_lists=?, link=? WHERE id=?",
    [
      input.title,
      input.des,
      input.img,
      JSON.stringify(input.iconLists),
      input.link,
      id,
    ]
  );
  revalidatePath("/");
}

export async function deleteProject(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM projects WHERE id=?", [id]);
  revalidatePath("/");
}

export async function createGridItem(input: Omit<GridItem, "id" | "position">) {
  const db = await getDb();
  const pos = await nextPosition("grid_items");
  await db.query(
    `INSERT INTO grid_items (title, description, class_name, img_class_name, title_class_name, img, spare_img, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.description,
      input.className,
      input.imgClassName,
      input.titleClassName,
      input.img,
      input.spareImg,
      pos,
    ]
  );
  revalidatePath("/");
}

export async function updateGridItem(id: number, input: Omit<GridItem, "id" | "position">) {
  const db = await getDb();
  await db.query(
    `UPDATE grid_items SET title=?, description=?, class_name=?, img_class_name=?, title_class_name=?, img=?, spare_img=? WHERE id=?`,
    [
      input.title,
      input.description,
      input.className,
      input.imgClassName,
      input.titleClassName,
      input.img,
      input.spareImg,
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
  const pos = await nextPosition("companies");
  await db.query(
    "INSERT INTO companies (name, img, name_img, position) VALUES (?, ?, ?, ?)",
    [input.name, input.img, input.nameImg, pos]
  );
  revalidatePath("/");
}

export async function updateCompany(id: number, input: Omit<Company, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE companies SET name=?, img=?, name_img=? WHERE id=?",
    [input.name, input.img, input.nameImg, id]
  );
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
  const pos = await nextPosition("social_media");
  await db.query(
    "INSERT INTO social_media (img, position) VALUES (?, ?)",
    [input.img, pos]
  );
  revalidatePath("/");
}

export async function updateSocial(id: number, input: Omit<Social, "id" | "position">) {
  const db = await getDb();
  await db.query(
    "UPDATE social_media SET img=? WHERE id=?",
    [input.img, id]
  );
  revalidatePath("/");
}

export async function deleteSocial(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM social_media WHERE id=?", [id]);
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
  revalidatePath("/");
}
