import {
  Sparkles,
  ImageIcon,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderSync,
} from "lucide-react";
import {
  getTechIcons,
  getCovers,
  syncCoversFromDisk,
  syncTechIconsFromDisk,
} from "@/lib/icons-data";
import { DeleteButton } from "@/components/admin/EntityForm";
import { FileInput } from "@/components/admin/FileInput";
import { PageHeader } from "@/components/admin/PageHeader";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  createCoverImageAction,
  createTechIconAction,
  deleteCoverImageAction,
  deleteTechIconAction,
  syncCoverImagesAction,
  syncTechIconsAction,
} from "../../actions";

const coverErrorMessages: Record<string, string> = {
  nolabel: "Label wajib diisi",
  nofile: "File gambar wajib dipilih",
  toobig: "File terlalu besar (max 2MB)",
  badtype: "Format harus PNG, JPG, WebP, atau SVG",
};
const coverSuccessMessage = "Cover image berhasil diupload";

const iconErrorMessages: Record<string, string> = {
  nolabel: "Label wajib diisi",
  nofile: "File SVG wajib dipilih",
  not24x24:
    'SVG harus 24x24 (width="24" height="24" atau viewBox="0 0 24 24")',
  toobig: "File terlalu besar (max 100KB)",
  notsvg: "File harus berisi SVG valid",
};
const iconSuccessMessage = "Icon berhasil ditambahkan";

export default async function AdminAssets({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
    cover_error?: string;
    cover_success?: string;
    msg?: string;
    sync_icons?: string;
    sync_icons_skipped?: string;
    sync_covers?: string;
    sync_covers_skipped?: string;
  }>;
}) {
  const params = await searchParams;

  // Lazy sync: scan upload folders + insert missing DB rows for any new files
  // dropped directly into the directory (without using the upload form).
  const [iconsSync, coversSync] = await Promise.all([
    syncTechIconsFromDisk(),
    syncCoversFromDisk(),
  ]);
  const syncNotice =
    iconsSync.added > 0 || coversSync.added > 0
      ? `${iconsSync.added} icon${iconsSync.added === 1 ? "" : "s"} + ${coversSync.added} cover${coversSync.added === 1 ? "" : "s"} synced from disk`
      : null;

  const [icons, covers] = await Promise.all([getTechIcons(), getCovers()]);

  const iconError = params?.error
    ? iconErrorMessages[params.error] || "Terjadi error"
    : null;
  const iconSuccess = params?.success === "1" ? iconSuccessMessage : null;
  const dbErrorDetail =
    params?.error === "dbinsert" && params?.msg ? params.msg : null;

  const coverError = params?.cover_error
    ? coverErrorMessages[params.cover_error] || "Terjadi error"
    : null;
  const coverSuccess = params?.cover_success === "1" ? coverSuccessMessage : null;

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Assets"
        description="Upload and manage all reusable assets: tech stack icons (24×24 SVG) and project cover images."
        icon={<Sparkles size={22} />}
        badge={`${icons.length + covers.length} total`}
      />

      {coverError ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{coverError}</span>
        </div>
      ) : null}
      {coverSuccess ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{coverSuccess}</span>
        </div>
      ) : null}
      {iconError ? (
        <div className="mb-4 flex flex-col gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{iconError}</span>
          </div>
          {dbErrorDetail ? (
            <p className="ml-6 font-mono text-[11px] text-rose-300/80">
              {dbErrorDetail}
            </p>
          ) : null}
        </div>
      ) : null}
      {iconSuccess ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{iconSuccess}</span>
        </div>
      ) : null}
      {syncNotice ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          <Sparkles size={16} className="mt-0.5 shrink-0" />
          <span>
            {syncNotice}. Files dropped directly into the upload folder are
            now in the library.
          </span>
        </div>
      ) : null}
      {params?.sync_icons !== undefined ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-3 text-sm text-fuchsia-200">
          <RefreshCw size={16} className="mt-0.5 shrink-0" />
          <span>
            Tech icon sync: {params.sync_icons} added
            {params.sync_icons_skipped
              ? `, ${params.sync_icons_skipped} already in library`
              : ""}
            .
          </span>
        </div>
      ) : null}
      {params?.sync_covers !== undefined ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          <FolderSync size={16} className="mt-0.5 shrink-0" />
          <span>
            Cover image sync: {params.sync_covers} added
            {params.sync_covers_skipped
              ? `, ${params.sync_covers_skipped} already in library`
              : ""}
            .
          </span>
        </div>
      ) : null}

      <Surface className="mb-6" padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="Upload cover image"
            description="Used for project cover images. PNG / JPG / WebP / SVG, max 2MB."
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20">
                <ImageIcon size={11} />
                Cover
              </span>
            }
          />
          <form action={createCoverImageAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cover-label"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Label
                </label>
                <input
                  id="cover-label"
                  type="text"
                  name="label"
                  required
                  placeholder="e.g. Project Hero, Banner, etc."
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="cover-file"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Image file
                </label>
                <FileInput
                  id="cover-file"
                  name="file"
                  accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                  required
                  variant="cover"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 transition active:scale-[0.98]"
              >
                <Upload size={15} />
                Upload cover
              </button>
            </div>
          </form>
        </div>
      </Surface>

      <Surface className="mb-6" padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="Cover library"
            description="Click delete to remove a cover image."
            count={`${covers.length} images`}
            action={
              <form action={syncCoverImagesAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md border border-sky-400/30 bg-sky-500/10 px-2.5 py-1.5 text-[11px] font-medium text-sky-200 transition hover:border-sky-400/50 hover:bg-sky-500/20"
                  title="Scan public\uploads\covers and add any new files to the library"
                >
                  <FolderSync size={11} />
                  Sync from disk
                </button>
              </form>
            }
          />
          {covers.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No cover images yet"
              description="Upload your first cover image to start building the project covers library."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {covers.map((cover) => (
                <div
                  key={cover.id}
                  className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3 hover:border-white/10 hover:bg-slate-900/70 transition-all"
                >
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-950/60 border border-white/10 flex items-center justify-center p-1">
                    <img
                      src={cover.path}
                      alt={cover.label}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="w-full text-center min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {cover.label}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {cover.path.split("/").pop()}
                    </p>
                  </div>
                  <DeleteButton
                    action={deleteCoverImageAction.bind(null, cover.id)}
                    label=""
                    icon={<Trash2 size={13} />}
                    className="!h-7 !w-7 !p-0"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Surface>

      <Surface className="mb-6" padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="Upload tech icon"
            description="Add a 24×24 SVG to the library."
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                <Sparkles size={11} />
                24×24 SVG
              </span>
            }
          />
          <form action={createTechIconAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="icon-label"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Label
                </label>
                <input
                  id="icon-label"
                  type="text"
                  name="label"
                  required
                  placeholder="e.g. Vue, Svelte, Angular"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="icon-file"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  SVG file
                </label>
                <FileInput
                  id="icon-file"
                  name="file"
                  accept=".svg,image/svg+xml"
                  required
                  variant="icon"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              SVG harus punya{" "}
              <code className="rounded bg-slate-900/60 px-1.5 py-0.5 text-violet-300">
                width="24" height="24"
              </code>{" "}
              atau{" "}
              <code className="rounded bg-slate-900/60 px-1.5 py-0.5 text-violet-300">
                viewBox="0 0 24 24"
              </code>
              .
            </p>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 transition active:scale-[0.98]"
              >
                <Upload size={15} />
                Add icon
              </button>
            </div>
          </form>
        </div>
      </Surface>

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="Tech icon library"
            description="Click delete to remove an icon."
            count={`${icons.length} icons`}
            action={
              <form action={syncTechIconsAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-1.5 text-[11px] font-medium text-fuchsia-200 transition hover:border-fuchsia-400/50 hover:bg-fuchsia-500/20"
                  title="Scan public\uploads\tech\icon and add any new files to the library"
                >
                  <RefreshCw size={11} />
                  Sync from disk
                </button>
              </form>
            }
          />
          {icons.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No icons yet"
              description="Upload your first SVG to start building the tech stack library."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 p-3 hover:border-white/10 hover:bg-slate-900/70 transition-all"
                >
                  <div className="h-12 w-12 rounded-lg bg-slate-950/60 border border-white/10 flex items-center justify-center p-1.5">
                    <img
                      src={icon.path}
                      alt={icon.label}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="w-full text-center min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {icon.label}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {icon.path.split("/").pop()}
                    </p>
                  </div>
                  <DeleteButton
                    action={deleteTechIconAction.bind(null, icon.id)}
                    label=""
                    icon={<Trash2 size={13} />}
                    className="!h-7 !w-7 !p-0"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
}
