"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import {
  checkPassword,
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import {
  createCompany,
  createExperience,
  createGridItem,
  createNav,
  createProject,
  createSocial,
  createTestimonial,
  deleteCompany,
  deleteExperience,
  deleteGridItem,
  deleteNav,
  deleteProject,
  deleteSocial,
  deleteTestimonial,
  updateCompany,
  updateExperience,
  updateGridItem,
  updateNav,
  updateProject,
  updateSocial,
  updateTestimonial,
} from "@/lib/data";
import { createTechIcon, deleteTechIcon } from "@/lib/icons-data";

const ICONS_UPLOAD_DIR = join(process.cwd(), "public", "icons", "tech");
const MAX_ICON_SIZE = 100 * 1024;

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "icon"
  );
}

async function requireAuth() {
  const { isAuthenticated } = await import("@/lib/auth");
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await setSessionCookie(createSessionToken());
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

function asString(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

function asStringArrayMulti(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProjectAction(formData: FormData) {
  await requireAuth();
  await createProject({
    title: asString(formData.get("title")),
    des: asString(formData.get("des")),
    img: asString(formData.get("img")),
    iconLists: asStringArrayMulti(formData, "iconLists"),
    link: asString(formData.get("link")),
  });
  revalidatePath("/admin/projects");
}

export async function updateProjectAction(id: number, formData: FormData) {
  await requireAuth();
  await updateProject(id, {
    title: asString(formData.get("title")),
    des: asString(formData.get("des")),
    img: asString(formData.get("img")),
    iconLists: asStringArrayMulti(formData, "iconLists"),
    link: asString(formData.get("link")),
  });
  revalidatePath("/admin/projects");
}

export async function deleteProjectAction(id: number) {
  await requireAuth();
  await deleteProject(id);
  revalidatePath("/admin/projects");
}

export async function createGridItemAction(formData: FormData) {
  await requireAuth();
  await createGridItem({
    title: asString(formData.get("title")),
    description: asString(formData.get("description")),
    className: asString(formData.get("className")),
    imgClassName: asString(formData.get("imgClassName")),
    titleClassName: asString(formData.get("titleClassName")),
    img: asString(formData.get("img")),
    spareImg: asString(formData.get("spareImg")),
  });
  revalidatePath("/admin/grid-items");
}

export async function updateGridItemAction(id: number, formData: FormData) {
  await requireAuth();
  await updateGridItem(id, {
    title: asString(formData.get("title")),
    description: asString(formData.get("description")),
    className: asString(formData.get("className")),
    imgClassName: asString(formData.get("imgClassName")),
    titleClassName: asString(formData.get("titleClassName")),
    img: asString(formData.get("img")),
    spareImg: asString(formData.get("spareImg")),
  });
  revalidatePath("/admin/grid-items");
}

export async function deleteGridItemAction(id: number) {
  await requireAuth();
  await deleteGridItem(id);
  revalidatePath("/admin/grid-items");
}

export async function createTestimonialAction(formData: FormData) {
  await requireAuth();
  await createTestimonial({
    quote: asString(formData.get("quote")),
    name: asString(formData.get("name")),
    title: asString(formData.get("title")),
  });
  revalidatePath("/admin/testimonials");
}

export async function updateTestimonialAction(id: number, formData: FormData) {
  await requireAuth();
  await updateTestimonial(id, {
    quote: asString(formData.get("quote")),
    name: asString(formData.get("name")),
    title: asString(formData.get("title")),
  });
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonialAction(id: number) {
  await requireAuth();
  await deleteTestimonial(id);
  revalidatePath("/admin/testimonials");
}

export async function createCompanyAction(formData: FormData) {
  await requireAuth();
  await createCompany({
    name: asString(formData.get("name")),
    img: asString(formData.get("img")),
    nameImg: asString(formData.get("nameImg")),
  });
  revalidatePath("/admin/companies");
}

export async function updateCompanyAction(id: number, formData: FormData) {
  await requireAuth();
  await updateCompany(id, {
    name: asString(formData.get("name")),
    img: asString(formData.get("img")),
    nameImg: asString(formData.get("nameImg")),
  });
  revalidatePath("/admin/companies");
}

export async function deleteCompanyAction(id: number) {
  await requireAuth();
  await deleteCompany(id);
  revalidatePath("/admin/companies");
}

export async function createExperienceAction(formData: FormData) {
  await requireAuth();
  await createExperience({
    title: asString(formData.get("title")),
    description: asString(formData.get("description")),
    className: asString(formData.get("className")),
    thumbnail: asString(formData.get("thumbnail")),
  });
  revalidatePath("/admin/experience");
}

export async function updateExperienceAction(id: number, formData: FormData) {
  await requireAuth();
  await updateExperience(id, {
    title: asString(formData.get("title")),
    description: asString(formData.get("description")),
    className: asString(formData.get("className")),
    thumbnail: asString(formData.get("thumbnail")),
  });
  revalidatePath("/admin/experience");
}

export async function deleteExperienceAction(id: number) {
  await requireAuth();
  await deleteExperience(id);
  revalidatePath("/admin/experience");
}

export async function createSocialAction(formData: FormData) {
  await requireAuth();
  await createSocial({
    img: asString(formData.get("img")),
  });
  revalidatePath("/admin/social");
}

export async function updateSocialAction(id: number, formData: FormData) {
  await requireAuth();
  await updateSocial(id, {
    img: asString(formData.get("img")),
  });
  revalidatePath("/admin/social");
}

export async function deleteSocialAction(id: number) {
  await requireAuth();
  await deleteSocial(id);
  revalidatePath("/admin/social");
}

export async function createNavAction(formData: FormData) {
  await requireAuth();
  await createNav({
    name: asString(formData.get("name")),
    link: asString(formData.get("link")),
  });
  revalidatePath("/admin/nav");
}

export async function updateNavAction(id: number, formData: FormData) {
  await requireAuth();
  await updateNav(id, {
    name: asString(formData.get("name")),
    link: asString(formData.get("link")),
  });
  revalidatePath("/admin/nav");
}

export async function deleteNavAction(id: number) {
  await requireAuth();
  await deleteNav(id);
  revalidatePath("/admin/nav");
}

export async function createTechIconAction(formData: FormData) {
  await requireAuth();
  const label = asString(formData.get("label"));
  const file = formData.get("file");

  if (!label) {
    redirect("/admin/icons?error=nolabel");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/icons?error=nofile");
  }

  if (file.size > MAX_ICON_SIZE) {
    redirect("/admin/icons?error=toobig");
  }

  const content = await file.text();

  const has24Size =
    /width=["']24["']/.test(content) && /height=["']24["']/.test(content);
  const has24ViewBox = /viewBox=["']0\s+0\s+24\s+24["']/.test(content);

  if (!has24Size && !has24ViewBox) {
    redirect("/admin/icons?error=not24x24");
  }

  if (!/^<svg[\s\S]*<\/svg>\s*$/i.test(content.trim())) {
    redirect("/admin/icons?error=notsvg");
  }

  const baseSlug = slugify(label);
  const filename = `${baseSlug}-${Date.now().toString(36)}.svg`;

  await mkdir(ICONS_UPLOAD_DIR, { recursive: true });
  await writeFile(join(ICONS_UPLOAD_DIR, filename), content, "utf-8");

  await createTechIcon({
    label,
    path: `/icons/tech/${filename}`,
  });

  redirect("/admin/icons?success=1");
}

export async function deleteTechIconAction(id: number) {
  await requireAuth();
  await deleteTechIcon(id);
}
