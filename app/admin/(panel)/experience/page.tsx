import { getExperiences } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { type Field } from "@/components/admin/EntityForm";
import {
  createExperienceAction,
  deleteExperienceAction,
  updateExperienceAction,
} from "../../actions";

const fields: Field[] = [
  { name: "title", label: "Title", placeholder: "Frontend Engineer" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "className", label: "ClassName", placeholder: "md:col-span-2" },
  { name: "thumbnail", label: "Thumbnail path", placeholder: "/exp1.svg" },
];

export default async function AdminExperience() {
  const items = await getExperiences();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Work Experience</h1>
        <AddNewButton
          title="Add new experience"
          fields={fields}
          action={createExperienceAction}
          modalSize="full"
        />
      </div>

      <div className="space-y-3">
        {items.map((e) => (
          <EditableItem
            key={e.id}
            title={e.title}
            subtitle={`id: ${e.id}`}
            fields={fields}
            defaults={{
              title: e.title,
              description: e.description,
              className: e.className,
              thumbnail: e.thumbnail,
            }}
            updateAction={updateExperienceAction.bind(null, e.id)}
            deleteAction={deleteExperienceAction.bind(null, e.id)}
            modalSize="full"
          />
        ))}
      </div>
    </div>
  );
}
