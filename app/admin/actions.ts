"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadBlob, deleteBlob } from "@/lib/blob";
import {
  checkPassword,
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import {
  createCompany,
  createEducation,
  createExperience,
  createGridItem,
  createNav,
  createProject,
  createService,
  createSkill,
  createSocial,
  createTestimonial,
  deleteCompany,
  deleteEducation,
  deleteExperience,
  deleteGridItem,
  deleteNav,
  deleteProject,
  deleteService,
  deleteSkill,
  deleteSocial,
  deleteTestimonial,
  setCompanyEnabled,
  setProjectEnabled,
  setSocialEnabled,
  updateCompany,
  updateEducation,
  updateExperience,
  updateGridItem,
  updateNav,
  updateProject,
  updateService,
  updateSkill,
  updateSocial,
  updateTestimonial,
  updateProfile,
} from "@/lib/data";
import { createCover, createTechIcon, deleteCover, deleteTechIcon, syncCompaniesFromDisk, syncCoversFromDisk, syncProjectImagesFromDisk, syncSocialsFromDisk, syncTechIconsFromDisk } from "@/lib/icons-data";

const MAX_AVATAR_SIZE = 3 * 1024 * 1024;
const MAX_ICON_SIZE = 100 * 1024;
const MAX_COVER_SIZE = 3 * 1024 * 1024;
const MAX_SOCIAL_ASSET_SIZE = 2 * 1024 * 1024;
const MAX_COMPANY_ASSET_SIZE = 2 * 1024 * 1024;
const URL_PREFIX_SOCIAL = "uploads/social";
const URL_PREFIX_COVERS = "uploads/covers";

// Fallback limits used when the settings table hasn't been read yet
// (e.g. before getDb initializes). All upload actions read from getSettings()
// in lib/data.ts at runtime so these are just safety nets.
async function getUploadLimits() {
  const { getSettings } = await import("@/lib/data");
  return getSettings();
}
function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "icon"
  );
}

async function saveImageUpload(
  file: FormDataEntryValue | null,
  uploadDir: string,
  urlPrefix: string,
  maxSize: number,
  label: string,
  redirectPath: string,
  errorKey: string,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > maxSize) {
    redirect(`${redirectPath}?${errorKey}=toobig`);
  }
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];
  if (!allowedTypes.includes(file.type)) {
    redirect(`${redirectPath}?${errorKey}=badtype`);
  }
  const ext = (() => {
    const t = file.type;
    if (t === "image/png") return "png";
    if (t === "image/jpeg" || t === "image/jpg") return "jpg";
    if (t === "image/webp") return "webp";
    if (t === "image/svg+xml") return "svg";
    return "bin";
  })();
  const baseSlug = slugify(label) || "asset";
  const filename = `${baseSlug}-${Date.now().toString(36)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  // urlPrefix is e.g. "uploads/covers" — strip leading slash so we always
  // pass a clean relative path to Vercel Blob.
  const blobPath = `${urlPrefix.replace(/^\//, "")}/${filename}`;
  return await uploadBlob(blobPath, buffer, { contentType: file.type });
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

function sanitizeNavLink(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (v.startsWith("/")) {
    if (v.startsWith("/#") || v.length > 1 && !v.startsWith("//")) return v;
    return v;
  }
  if (v.startsWith("#")) {
    const idx = v.indexOf("#", 1);
    const anchor = idx === -1 ? v : v.slice(0, idx);
    return "/" + anchor;
  }
  return "#" + v.replace(/^#+/, "");
}

const URL_PREFIX_PROJECT = "uploads/project";

export async function createProjectAction(formData: FormData) {
  await requireAuth();
  const imgInput = await resolveProjectImage(formData);
  await createProject({
    title: asString(formData.get("title")),
    des: asString(formData.get("des")),
    img: imgInput,
    iconLists: asStringArrayMulti(formData, "iconLists"),
    link: asString(formData.get("link")),
    enabled: formData.get("enabled") !== "0",
  });
  revalidatePath("/admin/projects");
}

export async function updateProjectAction(id: number, formData: FormData) {
  await requireAuth();
  const imgInput = await resolveProjectImage(formData);
  await updateProject(id, {
    title: asString(formData.get("title")),
    des: asString(formData.get("des")),
    img: imgInput,
    iconLists: asStringArrayMulti(formData, "iconLists"),
    link: asString(formData.get("link")),
    enabled: formData.get("enabled") !== "0",
  });
  revalidatePath("/admin/projects");
}

async function resolveProjectImage(formData: FormData): Promise<string> {
  const picked = asString(formData.get("img"));
  const file = formData.get("imgFile");
  if (file instanceof File && file.size > 0) {
    const limits = await getUploadLimits();
    if (file.size > limits.maxCoverSize) {
      redirect("/admin/projects?error=imgtoobig");
    }
    const ext = (() => {
      const t = file.type;
      if (t === "image/png") return "png";
      if (t === "image/jpeg" || t === "image/jpg") return "jpg";
      if (t === "image/webp") return "webp";
      if (t === "image/svg+xml") return "svg";
      return "bin";
    })();
    const filename = `project-${Date.now().toString(36)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    return await uploadBlob(`${URL_PREFIX_PROJECT}/${filename}`, buffer, {
      contentType: file.type,
    });
  }
  return picked;
}

export async function toggleProjectAction(id: number, formData: FormData) {
  await requireAuth();
  const enabled = asString(formData.get("enabled")) === "1";
  await setProjectEnabled(id, enabled);
  revalidatePath("/admin/projects");
}

export async function deleteProjectAction(id: number) {
  await requireAuth();
  await deleteProject(id);
  revalidatePath("/admin/projects");
}

function parseCommaList(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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
    leftLists: parseCommaList(asString(formData.get("leftLists"))),
    rightLists: parseCommaList(asString(formData.get("rightLists"))),
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
    leftLists: parseCommaList(asString(formData.get("leftLists"))),
    rightLists: parseCommaList(asString(formData.get("rightLists"))),
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
  const name = asString(formData.get("name"));
  const enabled = formData.get("enabled") !== "0";

  if (!name) {
    redirect("/admin/companies?error=noname");
  }

  const fileLogo = formData.get("file_logo");
  const imgPath = asString(formData.get("img"));
  const companyLimits = await getUploadLimits();

  const uploadedLogo = await saveImageUpload(
    fileLogo,
    "",
    "/uploads/companies",
    companyLimits.maxCompanySize,
    name,
    "/admin/companies",
    "logo_error"
  );

  const finalLogo = imgPath || uploadedLogo || "";

  if (!finalLogo) {
    redirect("/admin/companies?error=nologo");
  }

  await createCompany({
    name,
    img: finalLogo,
    nameImg: "",
    enabled,
  });
  revalidatePath("/admin/companies");
  redirect("/admin/companies?success=1");
}

export async function updateCompanyAction(id: number, formData: FormData) {
  await requireAuth();
  const name = asString(formData.get("name")) || "Company";
  const enabled = formData.get("enabled") !== "0";

  const fileLogo = formData.get("file_logo");
  const imgPath = asString(formData.get("img"));
  const companyLimits = await getUploadLimits();

  const uploadedLogo = await saveImageUpload(
    fileLogo,
    "",
    "/uploads/companies",
    companyLimits.maxCompanySize,
    name,
    "/admin/companies",
    "logo_error"
  );

  const finalLogo = imgPath || uploadedLogo || "";

  await updateCompany(id, {
    name,
    img: finalLogo,
    nameImg: "",
    enabled,
  });
  revalidatePath("/admin/companies");
}

export async function toggleCompanyAction(id: number, formData: FormData) {
  await requireAuth();
  const enabled = asString(formData.get("enabled")) === "1";
  await setCompanyEnabled(id, enabled);
  revalidatePath("/admin/companies");
}

export async function syncCompaniesAction() {
  await requireAuth();
  const result = await syncCompaniesFromDisk();
  revalidatePath("/admin/companies");
  redirect(
    `/admin/companies?sync_companies=${result.added}&sync_companies_skipped=${result.skipped}`
  );
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

export async function createNavAction(formData: FormData) {
  await requireAuth();
  await createNav({
    name: asString(formData.get("name")),
    link: sanitizeNavLink(asString(formData.get("link"))),
  });
  revalidatePath("/admin/nav");
}

export async function updateNavAction(id: number, formData: FormData) {
  await requireAuth();
  await updateNav(id, {
    name: asString(formData.get("name")),
    link: sanitizeNavLink(asString(formData.get("link"))),
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
    redirect("/admin/assets?error=nolabel");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/assets?error=nofile");
  }

  const limits = await getUploadLimits();
  if (file.size > limits.maxIconSize) {
    redirect("/admin/assets?error=toobig");
  }

  const raw = await file.text();

  const cleaned = raw
    .replace(/^\uFEFF/, "")
    .replace(/^<\?xml[\s\S]*?\?>\s*/, "")
    .replace(/^<!DOCTYPE[\s\S]*?>\s*/, "")
    .replace(/^<!--[\s\S]*?-->\s*/, "")
    .trim();

  if (!/^<svg\b[\s\S]*<\/svg>\s*$/i.test(cleaned)) {
    redirect("/admin/assets?error=notsvg");
  }

  const baseSlug = slugify(label);
  const filename = `${baseSlug}-${Date.now().toString(36)}.svg`;
  const blobPath = `uploads/tech/icon/${filename}`;

  let uploadedUrl: string | null = null;
  try {
    uploadedUrl = await uploadBlob(blobPath, cleaned, { contentType: "image/svg+xml" });
    await createTechIcon({
      label,
      path: uploadedUrl,
    });
    console.log(
      `[createTechIconAction] inserted: label="${label}" path="${uploadedUrl}"`
    );
  } catch (err) {
    console.error("[createTechIconAction] DB insert FAILED:", err);
    // Try to clean up the orphaned blob so we don't leave a dangling asset
    if (uploadedUrl) {
      try {
        await deleteBlob(uploadedUrl);
      } catch {
        /* ignore */
      }
    }
    redirect(
      `/admin/assets?error=dbinsert&msg=${encodeURIComponent(
        err instanceof Error ? err.message : String(err)
      )}`
    );
  }

  redirect("/admin/assets?success=1");
}

export async function deleteTechIconAction(id: number) {
  await requireAuth();
  await deleteTechIcon(id);
  revalidatePath("/admin/assets");
  redirect("/admin/assets?deleted=tech_icon");
}

export async function updateSettingsAction(formData: FormData) {
  await requireAuth();
  const { updateSettings } = await import("@/lib/data");

  const parseMb = (raw: FormDataEntryValue | null) => {
    const mb = Number(asString(raw));
    if (!Number.isFinite(mb) || mb <= 0) return null;
    return Math.round(mb * 1024 * 1024);
  };

  const input = {
    maxAvatarSize:
      parseMb(formData.get("maxAvatarSize")) ?? undefined,
    maxCoverSize:
      parseMb(formData.get("maxCoverSize")) ?? undefined,
    maxSocialSize:
      parseMb(formData.get("maxSocialSize")) ?? undefined,
    maxCompanySize:
      parseMb(formData.get("maxCompanySize")) ?? undefined,
    maxIconSize:
      parseMb(formData.get("maxIconSize")) ??
      (() => {
        const kb = Number(asString(formData.get("maxIconSizeKb")));
        return Number.isFinite(kb) && kb > 0 ? Math.round(kb * 1024) : undefined;
      })(),
    maxProjectImageSize:
      parseMb(formData.get("maxProjectImageSize")) ?? undefined,
  };

  const cleaned = Object.fromEntries(
    Object.entries(input).filter(([, v]) => typeof v === "number")
  ) as Parameters<typeof updateSettings>[0];

  const footerGridImg = asString(formData.get("footerGridImg"));
  if (footerGridImg) {
    cleaned.footerGridImg = footerGridImg;
  }

  await updateSettings(cleaned);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}

export async function createSkillAction(formData: FormData) {
  await requireAuth();
  await createSkill({
    group_name: asString(formData.get("group_name")).trim() || "Other",
    label: asString(formData.get("label")),
  });
  revalidatePath("/admin/skills");
}

export async function updateSkillAction(id: number, formData: FormData) {
  await requireAuth();
  await updateSkill(id, {
    group_name: asString(formData.get("group_name")).trim() || "Other",
    label: asString(formData.get("label")),
  });
  revalidatePath("/admin/skills");
}

export async function deleteSkillAction(id: number) {
  await requireAuth();
  await deleteSkill(id);
  revalidatePath("/admin/skills");
}

export async function createEducationAction(formData: FormData) {
  await requireAuth();
  await createEducation({
    school: asString(formData.get("school")),
    period: asString(formData.get("period")),
    level: asString(formData.get("level")),
    description: asString(formData.get("description")),
  });
  revalidatePath("/admin/educations");
}

export async function updateEducationAction(id: number, formData: FormData) {
  await requireAuth();
  await updateEducation(id, {
    school: asString(formData.get("school")),
    period: asString(formData.get("period")),
    level: asString(formData.get("level")),
    description: asString(formData.get("description")),
  });
  revalidatePath("/admin/educations");
}

export async function deleteEducationAction(id: number) {
  await requireAuth();
  await deleteEducation(id);
  revalidatePath("/admin/educations");
}

export async function createServiceAction(formData: FormData) {
  await requireAuth();
  await createService({
    icon: asString(formData.get("icon")) || "Sparkles",
    title: asString(formData.get("title")),
    description: asString(formData.get("description")),
    tone: "violet",
  });
  revalidatePath("/admin/services");
}

export async function updateServiceAction(id: number, formData: FormData) {
  await requireAuth();
  await updateService(id, {
    icon: asString(formData.get("icon")) || "Sparkles",
    title: asString(formData.get("title")),
    description: asString(formData.get("description")),
    tone: "violet",
  });
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(id: number) {
  await requireAuth();
  await deleteService(id);
  revalidatePath("/admin/services");
}

export async function createSocialAction(formData: FormData) {
  await requireAuth();
  const label = asString(formData.get("label"));
  const link = asString(formData.get("link")) || null;
  const enabled = formData.get("enabled") === "1";
  const file = formData.get("file");

  // Path-based create (no file): admin supplies img path directly
  const imgPath = asString(formData.get("img"));

  if (!label) {
    redirect("/admin/social?error=nolabel");
  }

  let finalImg = imgPath;

  if (file instanceof File && file.size > 0) {
    const limits = await getUploadLimits();
    if (file.size > limits.maxSocialSize) {
      redirect("/admin/social?error=toobig");
    }
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      redirect("/admin/social?error=badtype");
    }
    const ext = (() => {
      const t = file.type;
      if (t === "image/png") return "png";
      if (t === "image/jpeg" || t === "image/jpg") return "jpg";
      if (t === "image/webp") return "webp";
      if (t === "image/svg+xml") return "svg";
      return "bin";
    })();
    const baseSlug = slugify(label) || "social";
    const filename = `${baseSlug}-${Date.now().toString(36)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    finalImg = await uploadBlob(`${URL_PREFIX_SOCIAL}/${filename}`, buffer, {
      contentType: file.type,
    });
  }

  if (!finalImg) {
    redirect("/admin/social?error=nosource");
  }

  await createSocial({ label, img: finalImg, link, enabled });
  revalidatePath("/admin/social");
  redirect("/admin/social?success=1");
}

export async function updateSocialAction(id: number, formData: FormData) {
  await requireAuth();
  await updateSocial(id, {
    label: asString(formData.get("label")) || "Social",
    img: asString(formData.get("img")),
    link: asString(formData.get("link")) || null,
    enabled: formData.get("enabled") === "1",
  });
  revalidatePath("/admin/social");
}

export async function toggleSocialAction(id: number, formData: FormData) {
  await requireAuth();
  const enabled = asString(formData.get("enabled")) === "1";
  await setSocialEnabled(id, enabled);
  revalidatePath("/admin/social");
}

export async function deleteSocialAction(id: number) {
  await requireAuth();
  await deleteSocial(id);
  revalidatePath("/admin/social");
}

export async function syncSocialsAction() {
  await requireAuth();
  const result = await syncSocialsFromDisk();
  revalidatePath("/admin/social");
  revalidatePath("/admin/assets");
  redirect(
    `/admin/social?sync_socials=${result.added}&sync_socials_skipped=${result.skipped}`
  );
}

export async function createCoverImageAction(formData: FormData) {
  await requireAuth();
  const label = asString(formData.get("label"));
  const file = formData.get("file");

  if (!label) {
    redirect("/admin/assets?cover_error=nolabel");
  }

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/assets?cover_error=nofile");
  }

  const limits = await getUploadLimits();
  if (file.size > limits.maxCoverSize) {
    redirect("/admin/assets?cover_error=toobig");
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    redirect("/admin/assets?cover_error=badtype");
  }

  const ext = (() => {
    const t = file.type;
    if (t === "image/png") return "png";
    if (t === "image/jpeg" || t === "image/jpg") return "jpg";
    if (t === "image/webp") return "webp";
    if (t === "image/svg+xml") return "svg";
    return "bin";
  })();

  const baseSlug = slugify(label) || "cover";
  const filename = `${baseSlug}-${Date.now().toString(36)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadBlob(`${URL_PREFIX_COVERS}/${filename}`, buffer, {
    contentType: file.type,
  });

  await createCover({
    label,
    path: url,
  });

  redirect("/admin/assets?cover_success=1");
}

export async function deleteCoverImageAction(id: number) {
  await requireAuth();
  await deleteCover(id);
  revalidatePath("/admin/assets");
}

export async function syncTechIconsAction() {
  await requireAuth();
  const result = await syncTechIconsFromDisk();
  revalidatePath("/admin/assets");
  redirect(
    `/admin/assets?sync_icons=${result.added}&sync_icons_skipped=${result.skipped}`
  );
}

export async function syncCoverImagesAction() {
  await requireAuth();
  const result = await syncCoversFromDisk();
  revalidatePath("/admin/assets");
  redirect(
    `/admin/assets?sync_covers=${result.added}&sync_covers_skipped=${result.skipped}`
  );
}

export async function syncProjectImagesAction() {
  await requireAuth();
  const result = await syncProjectImagesFromDisk();
  revalidatePath("/admin/projects");
  redirect(`/admin/projects?sync_projects=${result.added}`);
}

export async function updateProfileAction(formData: FormData) {
  await requireAuth();
  await updateProfile({
    name: asString(formData.get("name")) || "Anonymous",
    role: asString(formData.get("role")) || "",
    location: asString(formData.get("location")) || "",
    avatar: asString(formData.get("avatar")) || null,
    bio1: asString(formData.get("bio1")) || null,
    bio2: asString(formData.get("bio2")) || null,
  });
  redirect("/admin/profile?success=1");
}

export async function uploadAvatarAction(formData: FormData) {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/profile?avatar_error=nofile");
  }

  const limits = await getUploadLimits();
  if (file.size > limits.maxAvatarSize) {
    redirect("/admin/profile?avatar_error=toobig");
  }

  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type)) {
    redirect("/admin/profile?avatar_error=badtype");
  }

  const ext = (() => {
    const t = file.type;
    if (t === "image/png") return "png";
    if (t === "image/webp") return "webp";
    return "jpg";
  })();

  const baseSlug = "avatar";
  const filename = `${baseSlug}-${Date.now().toString(36)}.${ext}`;
  const blobPath = `uploads/avatars/${filename}`;

  try {
    const { getProfile } = await import("@/lib/data");
    const current = await getProfile();
    if (current.avatar) {
      await deleteBlob(current.avatar);
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBlob(blobPath, buffer, { contentType: file.type });
    await updateProfile({
      ...current,
      avatar: url,
    });
  } catch (err) {
    console.error("[uploadAvatarAction]", err);
    redirect("/admin/profile?avatar_error=db");
  }

  revalidatePath("/admin/profile");
  revalidatePath("/info");
  redirect("/admin/profile?avatar_success=1");
}
