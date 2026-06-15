import { getProjects } from "@/lib/data";
import { getTechIcons } from "@/lib/icons-data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { IconPicker } from "@/components/admin/IconPicker";
import { type Field } from "@/components/admin/EntityForm";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../../actions";

const fields: Field[] = [
  { name: "title", label: "Title", placeholder: "Project name" },
  { name: "des", label: "Description", type: "textarea" },
  { name: "img", label: "Cover image path", placeholder: "/p1.svg" },
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
      <label className="block text-xs font-medium text-slate-400 mb-2">
        Tech icons
      </label>
      <IconPicker
        name="iconLists"
        selected={selected}
        options={options}
      />
    </div>
  );
}

export default async function AdminProjects() {
  const [projects, techIcons] = await Promise.all([
    getProjects(),
    getTechIcons(),
  ]);

  const iconOptions = techIcons.map((i) => ({ path: i.path, label: i.label }));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <AddNewButton
          title="Add new project"
          fields={fields}
          action={createProjectAction}
          modalSize="full"
          columns={2}
        >
          <IconPickerBlock selected={[]} options={iconOptions} />
        </AddNewButton>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <EditableItem
            key={p.id}
            title={p.title}
            subtitle={`id: ${p.id}`}
            fields={fields}
            defaults={{
              title: p.title,
              des: p.des,
              img: p.img,
              link: p.link,
            }}
            updateAction={updateProjectAction.bind(null, p.id)}
            deleteAction={deleteProjectAction.bind(null, p.id)}
            modalSize="full"
            columns={2}
          >
            <IconPickerBlock selected={p.iconLists} options={iconOptions} />
          </EditableItem>
        ))}
      </div>
    </div>
  );
}
