import {
  ExternalLink,
  FolderKanban,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { readdir } from "fs/promises";
import { resolve } from "path";
import { getProjects } from "@/lib/data";
import { getCovers, getTechIcons } from "@/lib/icons-data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { IconPicker } from "@/components/admin/IconPicker";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createProjectAction,
  deleteProjectAction,
  syncProjectImagesAction,
  toggleProjectAction,
  updateProjectAction,
} from "../../actions";

const fields: Field[] = [
  { name: "title", label: "Title", placeholder: "Project name" },
  {
    name: "des",
    label: "Description",
    type: "textarea",
    placeholder: "Short summary of the project",
  },
  { name: "link", label: "External link", placeholder: "https://..." },
];

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
    .slice(0, 64);
}

async function listProjectImages(): Promise<{ path: string; label: string }[]> {
  // Use the covers library (Vercel Blob in prod) plus any legacy files on
  // disk so the picker has options in both environments.
  const covers = await getCovers();
  const options = covers.map((c) => ({
    path: c.path,
    label: c.label,
  }));
  try {
    const dir = resolve(process.cwd(), "public", "uploads", "project");
    const files = await readdir(dir);
    for (const f of files) {
      if (!/\.(png|jpe?g|webp|svg)$/i.test(f)) continue;
      const p = `/uploads/project/${f}`;
      if (!options.some((o) => o.path === p)) {
        options.push({ path: p, label: humanizeFilename(f) });
      }
    }
  } catch {
    /* no on-disk legacy files */
  }
  return options;
}

function IconPickerBlock({
  selected,
  options,
}: {
  selected: string[];
  options: { path: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-300">
        Tech icons
      </label>
      <IconPicker name="iconLists" selected={selected} options={options} />
    </div>
  );
}

function ProjectThumbnail({
  img,
  title,
  enabled = true,
}: {
  img: string;
  title: string;
  enabled?: boolean;
}) {
  if (img) {
    return (
      <div
        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-slate-800 border border-white/10 transition ${
          enabled ? "" : "opacity-40 grayscale"
        }`}
      >
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-indigo-500/30 border border-white/10 flex items-center justify-center text-violet-200">
      <ImageIcon size={20} />
    </div>
  );
}

function ToggleProjectField({ enabled }: { enabled: boolean }) {
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
          Disabled projects are hidden from the homepage marquee.
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

export default async function AdminProjects({
  searchParams,
}: {
  searchParams: Promise<{
    sync_projects?: string;
    error?: string;
  }>;
}) {
  const [projects, techIcons, coverOptions] = await Promise.all([
    getProjects(),
    getTechIcons(),
    listProjectImages(),
  ]);

  const params = await searchParams;

  const iconOptions = techIcons.map((i) => ({ path: i.path, label: i.label }));

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Projects"
        description="Manage featured work, cover images, and tech stack for each card."
        icon={<FolderKanban size={22} />}
        badge={`${projects.length} total`}
        actions={
          <AddNewButton
            title="Add new project"
            description="Create a new project card for the portfolio."
            fields={fields}
            action={createProjectAction}
            modalSize="lg"
            columns={2}
          >
            <ImagePicker name="img" value="" options={coverOptions} />
            <IconPickerBlock selected={[]} options={iconOptions} />
          </AddNewButton>
        }
      />

      {params?.sync_projects !== undefined ? (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">
          <RefreshCw size={16} className="mt-0.5 shrink-0" />
          <span>
            Project image sync: {params.sync_projects} new project
            {params.sync_projects === "1" ? "" : "s"} created from{" "}
            <code className="rounded bg-slate-900/60 px-1 py-0.5 text-violet-200">
              public\uploads\project
            </code>
            .
          </span>
        </div>
      ) : null}

      <Surface className="mb-6" padded={false}>
        <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Cover images on disk
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Drop project cover images into{" "}
              <code className="rounded bg-slate-900/60 px-1 py-0.5 text-slate-300">
                public\uploads\project
              </code>{" "}
              and click Sync to create new projects from them.
            </p>
          </div>
          <form action={syncProjectImagesAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/30 bg-violet-500/10 px-2.5 py-1.5 text-[11px] font-medium text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-500/20"
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
            title="All projects"
            description="Click edit to update, or delete to remove."
            count={projects.length}
          />
          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to populate the Recent Projects section."
              action={
                <AddNewButton
                  title="Add new project"
                  fields={fields}
                  action={createProjectAction}
                  modalSize="lg"
                  columns={2}
                >
                  <ImagePicker name="img" value="" options={coverOptions} />
                  <IconPickerBlock selected={[]} options={iconOptions} />
                </AddNewButton>
              }
            />
          ) : (
            <div className="space-y-2.5">
              {projects.map((p) => {
                const enabled = Boolean(p.enabled);
                return (
                  <div key={p.id} className="relative">
                    <EditableItem
                      title={p.title}
                      subtitle={
                        <span className="flex items-center gap-2">
                          <span className="truncate">
                            {p.des || p.link || `Project #${p.id}`}
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
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            #{p.id}
                          </span>
                          {p.link ? (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-violet-300 transition truncate max-w-[180px]"
                            >
                              <ExternalLink size={11} />
                              {p.link}
                            </a>
                          ) : null}
                          {p.iconLists.length > 0 ? (
                            <div className="flex -space-x-1.5">
                              {p.iconLists.slice(0, 4).map((iconPath, idx) => (
                                <span
                                  key={`${iconPath}-${idx}`}
                                  className="h-5 w-5 rounded bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden"
                                  title={iconPath}
                                >
                                  <img
                                    src={iconPath}
                                    alt=""
                                    className="h-3.5 w-3.5 object-contain"
                                  />
                                </span>
                              ))}
                              {p.iconLists.length > 4 ? (
                                <span className="h-5 w-5 rounded bg-slate-900 border border-white/10 flex items-center justify-center text-[9px] text-slate-400 font-semibold">
                                  +{p.iconLists.length - 4}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      }
                      thumbnail={
                        <ProjectThumbnail
                          img={p.img}
                          title={p.title}
                          enabled={enabled}
                        />
                      }
                      fields={fields}
                      defaults={{
                        title: p.title,
                        des: p.des,
                        link: p.link,
                        img: p.img,
                        enabled: enabled ? "1" : "0",
                      }}
                      updateAction={updateProjectAction.bind(null, p.id)}
                      deleteAction={deleteProjectAction.bind(null, p.id)}
                      modalSize="lg"
                      columns={2}
                    >
                      <ImagePicker
                        name="img"
                        value={p.img}
                        options={coverOptions}
                      />
                      <IconPickerBlock
                        selected={p.iconLists}
                        options={iconOptions}
                      />
                      <ToggleProjectField enabled={enabled} />
                    </EditableItem>

                    <form
                      action={toggleProjectAction.bind(null, p.id)}
                      className="absolute right-3 top-3 sm:right-4 sm:top-4"
                    >
                      <input
                        type="hidden"
                        name="enabled"
                        value={enabled ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        title={
                          enabled ? "Hide from marquee" : "Show in marquee"
                        }
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
