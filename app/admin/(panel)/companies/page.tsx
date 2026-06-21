import {
  Building2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getCompanies } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createCompanyAction,
  deleteCompanyAction,
  syncCompaniesAction,
  toggleCompanyAction,
  updateCompanyAction,
} from "../../actions";

const fields: Field[] = [
  { name: "name", label: "Name", placeholder: "Cloudinary" },
  {
    name: "file_logo",
    label: "Logo file",
    type: "file",
    hint: "PNG / JPG / WebP / SVG, max 2MB. Saved to public\\uploads\\companies.",
  },
  {
    name: "img",
    label: "Source logo",
    type: "company-picker",
    hint: "Override the uploaded file by picking an existing company logo. Leave blank to use the uploaded file.",
  },
];

const companyErrorMessages: Record<string, string> = {
  noname: "Name wajib diisi",
  nologo: "Upload logo file atau pilih dari library",
  toobig: "File terlalu besar (max 2MB)",
  badtype: "Format harus PNG, JPG, WebP, atau SVG",
};

export default async function AdminCompanies({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
    logo_error?: string;
    sync_companies?: string;
    sync_companies_skipped?: string;
  }>;
}) {
  const params = await searchParams;
  const items = await getCompanies();

  const error = params?.error
    ? companyErrorMessages[params.error] || "Terjadi error"
    : null;
  const logoError = params?.logo_error
    ? companyErrorMessages[params.logo_error] || "Logo upload error"
    : null;
  const success =
    params?.success === "1" ? "Company berhasil disimpan" : null;

  const logoOptions = items
    .filter((c) => c.img)
    .map((c) => ({ path: c.img, label: c.name }));

  const fieldsWithOptions: Field[] = fields.map((f) =>
    f.name === "img" ? { ...f, options: logoOptions } : f
  );

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Companies"
        description="Trusted-by logos shown in the Clients marquee. Upload logo, toggle visibility."
        icon={<Building2 size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new company"
            description="Upload a logo, then add the company name."
            fields={fieldsWithOptions}
            action={createCompanyAction}
            modalSize="lg"
          />
        }
      />

      {error || logoError ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error || logoError}</span>
        </div>
      ) : null}
      {success ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      ) : null}
      {params?.sync_companies !== undefined ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          <RefreshCw size={16} className="mt-0.5 shrink-0" />
          <span>
            Company sync: {params.sync_companies} added
            {params.sync_companies_skipped
              ? `, ${params.sync_companies_skipped} already in library`
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
              Drop logo files into{" "}
              <code className="rounded bg-slate-900/60 px-1 py-0.5 text-slate-300">
                public\uploads\companies
              </code>{" "}
              and click Sync to import them.
            </p>
          </div>
          <form action={syncCompaniesAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md border border-sky-400/30 bg-sky-500/10 px-2.5 py-1.5 text-[11px] font-medium text-sky-200 transition hover:border-sky-400/50 hover:bg-sky-500/20"
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
            title="All companies"
            description="Click edit to update name, logo, or visibility."
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No companies yet"
              description="Add logos to showcase trusted-by clients and partners."
              action={
                <AddNewButton
                  title="Add new company"
                  fields={fieldsWithOptions}
                  action={createCompanyAction}
                  modalSize="lg"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((c) => {
                const enabled = Boolean(c.enabled);
                return (
                  <div key={c.id} className="relative">
                    <EditableItem
                      title={c.name || `Company #${c.id}`}
                      subtitle={
                        <span className="flex items-center gap-2">
                          <span className="truncate font-mono text-[10px] text-slate-400">
                            {c.img ? c.img.split("/").pop() : "No logo"}
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
                          <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            #{c.id}
                          </span>
                        </div>
                      }
                      thumbnail={
                        c.img ? (
                          <div
                            className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-slate-950/60 border flex items-center justify-center p-2 ${
                              enabled
                                ? "border-white/10"
                                : "border-white/5 opacity-40 grayscale"
                            }`}
                          >
                            <img
                              src={c.img}
                              alt={c.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-sky-200">
                            <ImageIcon size={20} />
                          </div>
                        )
                      }
                      fields={fieldsWithOptions}
                      defaults={{
                        name: c.name,
                        img: c.img,
                        enabled: enabled ? "1" : "0",
                      }}
                      updateAction={updateCompanyAction.bind(null, c.id)}
                      deleteAction={deleteCompanyAction.bind(null, c.id)}
                      modalSize="lg"
                    >
                      <ToggleCompanyField enabled={enabled} />
                    </EditableItem>

                    <form
                      action={toggleCompanyAction.bind(null, c.id)}
                      className="absolute right-3 top-3 sm:right-4 sm:top-4"
                    >
                      <input
                        type="hidden"
                        name="enabled"
                        value={enabled ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        title={enabled ? "Hide from marquee" : "Show in marquee"}
                        aria-label={
                          enabled ? "Hide from marquee" : "Show in marquee"
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

function ToggleCompanyField({ enabled }: { enabled: boolean }) {
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
          Disabled companies are hidden from the marquee.
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
