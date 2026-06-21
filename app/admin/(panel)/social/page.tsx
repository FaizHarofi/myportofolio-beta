import {
  Share2,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getSocials } from "@/lib/data";
import { syncSocialsFromDisk } from "@/lib/icons-data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createSocialAction,
  deleteSocialAction,
  syncSocialsAction,
  toggleSocialAction,
  updateSocialAction,
} from "../../actions";

const fields: Field[] = [
  {
    name: "label",
    label: "Label",
    placeholder: "e.g. GitHub",
  },
  {
    name: "file",
    label: "Icon file",
    type: "file",
    hint: "PNG / JPG / WebP / SVG, max 2MB. Saved to public\\uploads\\social.",
  },
  {
    name: "img",
    label: "Source social",
    type: "social-picker",
    hint: "Override the uploaded file by picking an existing social icon. Leave blank to use the uploaded file.",
  },
  {
    name: "link",
    label: "Link URL",
    placeholder: "https://github.com/yourname",
    hint: "Where the icon should take visitors when clicked.",
  },
];

const socialErrorMessages: Record<string, string> = {
  nolabel: "Label wajib diisi",
  nosource: "Upload file atau isi Icon path",
  toobig: "File terlalu besar (max 2MB)",
  badtype: "Format harus PNG, JPG, WebP, atau SVG",
};

export default async function AdminSocial({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
    sync_socials?: string;
    sync_socials_skipped?: string;
  }>;
}) {
  const params = await searchParams;

  // Lazy sync: any new files dropped into public\uploads\social get added to the library
  await syncSocialsFromDisk();
  const items = await getSocials();

  const error = params?.error
    ? socialErrorMessages[params.error] || "Terjadi error"
    : null;
  const success = params?.success === "1" ? "Social berhasil ditambahkan" : null;

  const pickerOptions = items.map((s) => ({
    path: s.img,
    label: s.label || s.img,
  }));
  const fieldsWithOptions: Field[] = fields.map((f) =>
    f.name === "img" ? { ...f, options: pickerOptions } : f
  );

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Social Media"
        description="Icons shown in the footer social row. Each entry has a label, icon, and link."
        icon={<Share2 size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new social"
            description="Upload an icon and add a link URL."
            fields={fieldsWithOptions}
            action={createSocialAction}
            modalSize="md"
          />
        }
      />

      {error ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}
      {success ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      ) : null}
      {params?.sync_socials !== undefined ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <RefreshCw size={16} className="mt-0.5 shrink-0" />
          <span>
            Social sync: {params.sync_socials} added
            {params.sync_socials_skipped
              ? `, ${params.sync_socials_skipped} already in library`
              : ""}
            .
          </span>
        </div>
      ) : null}

      <Surface className="mb-6" padded={false}>
        <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Files on disk
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Drop additional icons into{" "}
              <code className="rounded bg-slate-900/60 px-1 py-0.5 text-slate-300">
                public\uploads\social
              </code>{" "}
              and click Sync to import them.
            </p>
          </div>
          <form action={syncSocialsAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md border border-rose-400/30 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-medium text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-500/20"
            >
              <RefreshCw size={11} />
              Sync from disk
            </button>
          </form>
        </div>
      </Surface>

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All socials"
            description="Click edit to update label, icon, link, or visibility."
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={Share2}
              title="No socials yet"
              description="Add the icons and links for the platforms you want to showcase."
              action={
                <AddNewButton
                  title="Add new social"
                  fields={fieldsWithOptions}
                  action={createSocialAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((s) => {
                const enabled = Boolean(s.enabled);
                return (
                  <div key={s.id} className="relative">
                    <EditableItem
                      title={s.label || `Social #${s.id}`}
                      subtitle={
                        <span className="flex items-center gap-2">
                          <span className="truncate">
                            {s.link || "No link set"}
                          </span>
                          <span
                            className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                              enabled
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                : "bg-slate-500/10 text-slate-400 border-white/10"
                            }`}
                          >
                            {enabled ? <Eye size={9} /> : <EyeOff size={9} />}
                            {enabled ? "Visible" : "Hidden"}
                          </span>
                        </span>
                      }
                      meta={
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            #{s.id}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/70 border border-white/10 rounded px-1.5 py-0.5 truncate max-w-[260px]">
                            <ExternalLink size={9} />
                            {s.link || "—"}
                          </span>
                        </div>
                      }
                      thumbnail={
                        s.img ? (
                          <div
                            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-950/60 border flex items-center justify-center p-1.5 ${
                              enabled
                                ? "border-white/10"
                                : "border-white/5 opacity-40 grayscale"
                            }`}
                          >
                            <img
                              src={s.img}
                              alt={s.label || "social"}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 sm:h-14 sm:h-14 rounded-xl bg-gradient-to-br from-rose-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-rose-200">
                            <ImageIcon size={18} />
                          </div>
                        )
                      }
                      fields={fieldsWithOptions}
                      defaults={{
                        label: s.label,
                        img: s.img,
                        link: s.link ?? "",
                        enabled: enabled ? "1" : "0",
                      }}
                      updateAction={updateSocialAction.bind(null, s.id)}
                      deleteAction={deleteSocialAction.bind(null, s.id)}
                      modalSize="md"
                    >
                      <ToggleSocialField enabled={enabled} />
                    </EditableItem>

                    <form
                      action={toggleSocialAction.bind(null, s.id)}
                      className="absolute right-3 top-3 sm:right-4 sm:top-4"
                    >
                      <input
                        type="hidden"
                        name="enabled"
                        value={enabled ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        title={enabled ? "Hide from footer" : "Show in footer"}
                        aria-label={
                          enabled
                            ? "Hide from footer"
                            : "Show in footer"
                        }
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md border transition active:scale-[0.95] ${
                          enabled
                            ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300 hover:bg-rose-500/15 hover:border-rose-400/40 hover:text-rose-300"
                            : "bg-slate-950/40 border-white/10 text-slate-400 hover:bg-emerald-500/15 hover:border-emerald-400/40 hover:text-emerald-300"
                        }`}
                      >
                        {enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
}

function ToggleSocialField({ enabled }: { enabled: boolean }) {
  return (
    <div className="sm:col-span-2 mt-1 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/30 px-3 py-2.5">
      <div>
        <label
          htmlFor="enabled"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300"
        >
          {enabled ? <Eye size={11} /> : <EyeOff size={11} />}
          Visibility
        </label>
        <p className="mt-0.5 text-[10px] text-slate-500">
          Disabled socials are hidden from the footer.
        </p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          id="enabled"
          name="enabled"
          type="checkbox"
          defaultChecked={enabled}
          value="1"
          className="peer sr-only"
        />
        <div className="h-5 w-9 rounded-full border border-white/10 bg-slate-800 transition peer-checked:bg-emerald-500/80 peer-checked:border-emerald-400/50 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500/30 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4" />
      </label>
    </div>
  );
}
