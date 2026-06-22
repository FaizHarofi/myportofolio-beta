import { SlidersHorizontal, CheckCircle2, AlertCircle } from "lucide-react";
import { getSettings } from "@/lib/data";
import { PageHeader } from "@/components/admin/PageHeader";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { updateSettingsAction } from "../../actions";

function formatMb(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2);
}

function formatKb(bytes: number): string {
  return (bytes / 1024).toFixed(0);
}

export default async function AdminSettings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Settings"
        description="Configure upload size limits. Changes apply immediately to all upload forms."
        icon={<SlidersHorizontal size={22} />}
        badge="Live"
      />

      {params?.saved ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>Settings saved. New limits are active now.</span>
        </div>
      ) : null}
      {params?.error ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{params.error}</span>
        </div>
      ) : null}

      <Surface padded={false}>
        <form action={updateSettingsAction} className="p-5 sm:p-7 space-y-6">
          <SectionHeader
            title="Upload size limits"
            description="Values in megabytes (MB) except tech icons (KB). 1 MB = 1024 KB."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LimitField
              name="maxAvatarSize"
              label="Profile avatar"
              description="Used in /admin/profile"
              unit="MB"
              valueMb={formatMb(settings.maxAvatarSize)}
            />
            <LimitField
              name="maxCoverSize"
              label="Cover image"
              description="Used in /admin/assets → Cover library"
              unit="MB"
              valueMb={formatMb(settings.maxCoverSize)}
            />
            <LimitField
              name="maxSocialSize"
              label="Social icon"
              description="Used in /admin/social"
              unit="MB"
              valueMb={formatMb(settings.maxSocialSize)}
            />
            <LimitField
              name="maxCompanySize"
              label="Company logo"
              description="Used in /admin/companies"
              unit="MB"
              valueMb={formatMb(settings.maxCompanySize)}
            />
            <LimitField
              name="maxIconSize"
              label="Tech icon"
              description="Used in /admin/assets → Tech icon library (24×24 SVG)"
              unit="KB"
              valueKb={formatKb(settings.maxIconSize)}
            />
            <LimitField
              name="maxProjectImageSize"
              label="Project image"
              description="Used in /admin/projects (Sync from disk)"
              unit="MB"
              valueMb={formatMb(settings.maxProjectImageSize)}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-xs text-slate-400">
            <p className="font-medium text-slate-300">Allowed file types (all uploads)</p>
            <p className="mt-1 font-mono">{settings.allowedImageTypes.join(", ")}</p>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <p className="text-[11px] text-slate-500">
              Empty fields keep current values. Changes apply to next upload.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg font-medium text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 transition active:scale-[0.98]"
            >
              <SlidersHorizontal size={15} />
              Save settings
            </button>
          </div>
        </form>
      </Surface>
    </div>
  );
}

function LimitField({
  name,
  label,
  description,
  unit,
  valueMb,
  valueKb,
}: {
  name: string;
  label: string;
  description: string;
  unit: "MB" | "KB";
  valueMb?: string;
  valueKb?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 flex items-baseline gap-2 text-xs font-medium text-slate-300"
      >
        {label}
        <span className="text-[10px] uppercase tracking-wider text-slate-500">
          max {unit}
        </span>
      </label>
      <div className="relative">
        <input
          id={name}
          name={unit === "KB" ? `${name}Kb` : name}
          type="number"
          min="0"
          step={unit === "KB" ? "10" : "0.1"}
          defaultValue={unit === "KB" ? valueKb : valueMb}
          placeholder={`Current: ${unit === "KB" ? valueKb : valueMb} ${unit}`}
          className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
          {unit}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-slate-500">{description}</p>
    </div>
  );
}
