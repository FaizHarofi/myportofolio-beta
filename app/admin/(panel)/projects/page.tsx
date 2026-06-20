import { ExternalLink, FolderKanban, Image as ImageIcon } from "lucide-react";
import { getProjects } from "@/lib/data";
import { getTechIcons, getCovers } from "@/lib/icons-data";
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

function ProjectThumbnail({ img, title }: { img: string; title: string }) {
  if (img) {
    return (
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-slate-800 border border-white/10">
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

export default async function AdminProjects() {
  const [projects, techIcons, covers] = await Promise.all([
    getProjects(),
    getTechIcons(),
    getCovers(),
  ]);

  const iconOptions = techIcons.map((i) => ({ path: i.path, label: i.label }));
  const coverOptions = covers.map((c) => ({ path: c.path, label: c.label }));

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
              {projects.map((p) => (
                <EditableItem
                  key={p.id}
                  title={p.title}
                  subtitle={
                    p.des ||
                    (p.link ? p.link : `Project #${p.id}`)
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
                  thumbnail={<ProjectThumbnail img={p.img} title={p.title} />}
                  fields={fields}
                  defaults={{
                    title: p.title,
                    des: p.des,
                    link: p.link,
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
                </EditableItem>
              ))}
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
}
