import { UserCircle2, CheckCircle2, Quote, AlertCircle } from "lucide-react";
import { getProfile } from "@/lib/data";
import { PageHeader } from "@/components/admin/PageHeader";
import { Surface } from "@/components/admin/Surface";
import { AvatarCropper } from "@/components/admin/AvatarCropper";
import { updateProfileAction, uploadAvatarAction } from "../../actions";

const avatarErrorMessages: Record<string, string> = {
  nofile: "File gambar wajib dipilih",
  toobig: "File terlalu besar (max 3MB)",
  badtype: "Format harus PNG, JPG, atau WebP",
  db: "Gagal menyimpan ke database",
};
const avatarSuccessMessage = "Avatar berhasil diupload";

export default async function AdminProfile({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    avatar_success?: string;
    avatar_error?: string;
  }>;
}) {
  const params = await searchParams;
  const profile = await getProfile();
  const saved = params?.success === "1";
  const avatarSaved = params?.avatar_success === "1";
  const avatarError = params?.avatar_error
    ? avatarErrorMessages[params.avatar_error] || "Gagal upload avatar"
    : null;

  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile"
        description="Bio content shown on the /info page. Changes apply instantly."
        icon={<UserCircle2 size={22} />}
        badge="Single record"
      />

      {saved ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>Profile saved.</span>
        </div>
      ) : null}

      {avatarSaved ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{avatarSuccessMessage}</span>
        </div>
      ) : null}

      {avatarError ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{avatarError}</span>
        </div>
      ) : null}

      <Surface padded={false}>
        <div className="p-5 sm:p-7 space-y-6">
          {/* AVATAR UPLOAD */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Avatar
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Profile photo shown on the /info page. PNG, JPG, or WebP, max 3MB.
            </p>

            <div className="mt-4">
              <AvatarCropper
                action={uploadAvatarAction}
                currentAvatar={profile.avatar}
                initials={initials}
              />
              <p className="mt-2 text-[10px] text-slate-500">
                Saved to{" "}
                <code className="rounded bg-slate-900/60 px-1 py-0.5 text-slate-400">
                  public\uploads\avatars
                </code>
              </p>
            </div>
          </div>

          <div className="border-t border-white/10" />

          <form action={updateProfileAction} className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                Identity
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Used in the terminal block on the /info page.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-slate-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={profile.name}
                    placeholder="Zra Vanilla"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-xs font-medium text-slate-300"
                  >
                    Role
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    defaultValue={profile.role}
                    placeholder="Graphic Designer & Web Developer"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  defaultValue={profile.location}
                  placeholder="Pekanbaru, Riau, Indonesia"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            <div className="border-t border-white/10" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                Biography
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Shown as the two paragraphs above the terminal block.
              </p>

              <div className="mt-4">
                <label
                  htmlFor="bio1"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300"
                >
                  <Quote size={11} />
                  First paragraph
                </label>
                <textarea
                  id="bio1"
                  name="bio1"
                  rows={4}
                  defaultValue={profile.bio1 ?? ""}
                  placeholder="My name is Zra, a passionate graphic designer…"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20 resize-y leading-relaxed"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="bio2"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300"
                >
                  <Quote size={11} />
                  Second paragraph
                </label>
                <textarea
                  id="bio2"
                  name="bio2"
                  rows={4}
                  defaultValue={profile.bio2 ?? ""}
                  placeholder="I like making designs that are simple, clean, and modern…"
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20 resize-y leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-5">
              <p className="text-[11px] text-slate-500">
                Changes save instantly and revalidate the /info page.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg font-medium text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 transition active:scale-[0.98]"
              >
                Save profile
              </button>
            </div>
          </form>
        </div>
      </Surface>
    </div>
  );
}
