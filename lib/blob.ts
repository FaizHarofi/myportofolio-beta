import { put, del } from "@vercel/blob";

/**
 * Upload a buffer/string to Vercel Blob.
 * Returns the public URL.
 *
 * In local dev (without BLOB_READ_WRITE_TOKEN), falls back to writing
 * the file under public/uploads/<path>/ so the existing dev workflow
 * keeps working without needing Vercel Blob credentials.
 */
export async function uploadBlob(
  pathname: string,
  body: Buffer | string,
  options?: { contentType?: string; access?: "public" },
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const blob = await put(pathname, body, {
      access: "public",
      contentType: options?.contentType,
      token,
    });
    return blob.url;
  }

  // Local dev fallback
  const { mkdir, writeFile } = await import("fs/promises");
  const { join, resolve } = await import("path");
  const absPath = resolve(
    process.cwd(),
    "public",
    pathname.replace(/^\//, ""),
  );
  await mkdir(resolve(absPath, ".."), { recursive: true });
  await writeFile(
    absPath,
    typeof body === "string" ? body : body,
  );
  return `/${pathname.replace(/^\//, "")}`;
}

/**
 * Delete a previously uploaded blob.
 * In local dev, also handles unlinking local files under public/uploads/.
 */
export async function deleteBlob(urlOrPath: string): Promise<void> {
  if (!urlOrPath) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token && /^https?:\/\//.test(urlOrPath)) {
    try {
      await del(urlOrPath, { token });
    } catch {
      /* already gone */
    }
    return;
  }

  // Local dev fallback — only unlink files inside public/uploads/
  const { unlink } = await import("fs/promises");
  const { resolve } = await import("path");
  try {
    const absPath = resolve(
      process.cwd(),
      "public",
      urlOrPath.replace(/^\//, ""),
    );
    await unlink(absPath);
  } catch {
    /* missing */
  }
}
