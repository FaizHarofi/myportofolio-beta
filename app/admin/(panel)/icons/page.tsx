import { getTechIcons } from "@/lib/icons-data";
import { DeleteButton } from "@/components/admin/EntityForm";
import { createTechIconAction, deleteTechIconAction } from "../../actions";

const errorMessages: Record<string, string> = {
  nolabel: "Label wajib diisi",
  nofile: "File SVG wajib dipilih",
  not24x24:
    "SVG harus 24x24 (width=\"24\" height=\"24\" atau viewBox=\"0 0 24 24\")",
  toobig: "File terlalu besar (max 100KB)",
  notsvg: "File harus berisi SVG valid",
};
const successMessage = "Icon berhasil ditambahkan";

export default async function AdminIcons({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const icons = await getTechIcons();

  const errorKey = params?.error;
  const error = errorKey ? errorMessages[errorKey] || "Terjadi error" : null;
  const success = params?.success === "1" ? successMessage : null;

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-2">Tech Icons</h1>
      <p className="text-sm text-slate-400 mb-6">
        Manage icon library untuk tech stack di projects. SVG 24x24 only.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-500/40 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded border border-green-500/40 bg-green-500/10 text-green-300 text-sm">
          {success}
        </div>
      )}

      <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-sky-400 mb-3">Add new icon</h2>
        <form
          action={createTechIconAction}
          encType="multipart/form-data"
          className="space-y-3"
        >
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Label
            </label>
            <input
              type="text"
              name="label"
              required
              placeholder="e.g. Vue, Svelte, Angular"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm text-white outline-none focus:border-sky-500 placeholder:text-slate-600"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              SVG file (24x24 only, max 100KB)
            </label>
            <input
              type="file"
              name="file"
              accept=".svg,image/svg+xml"
              required
              className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sky-500 file:text-slate-950 hover:file:bg-sky-400"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              SVG harus punya <code className="text-sky-400">width="24" height="24"</code> atau <code className="text-sky-400">viewBox="0 0 24 24"</code>
            </p>
          </div>
          <button
            type="submit"
            className="rounded-md bg-sky-500 hover:bg-sky-400 transition px-4 py-1.5 text-sm font-semibold text-slate-950"
          >
            Add icon
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 mb-3">
          {icons.length} icon{icons.length === 1 ? "" : "s"} available
        </h2>
        <div className="space-y-3">
          {icons.map((icon) => (
            <div
              key={icon.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center p-1">
                <img
                  src={icon.path}
                  alt={icon.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium">{icon.label}</h3>
                <p className="text-xs text-slate-500 truncate font-mono">
                  {icon.path}
                </p>
              </div>
              <DeleteButton
                action={deleteTechIconAction.bind(null, icon.id)}
              />
            </div>
          ))}
          {icons.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">
              No icons yet. Add one above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
