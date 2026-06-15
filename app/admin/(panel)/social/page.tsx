import { getSocials } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { type Field } from "@/components/admin/EntityForm";
import {
  createSocialAction,
  deleteSocialAction,
  updateSocialAction,
} from "../../actions";

const fields: Field[] = [
  { name: "img", label: "Icon path", placeholder: "/git.svg" },
];

export default async function AdminSocial() {
  const items = await getSocials();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Social Media</h1>
        <AddNewButton
          title="Add new social"
          fields={fields}
          action={createSocialAction}
          modalSize="full"
        />
      </div>

      <div className="space-y-3">
        {items.map((s) => (
          <EditableItem
            key={s.id}
            title={s.img}
            subtitle={`id: ${s.id}`}
            fields={fields}
            defaults={{ img: s.img }}
            updateAction={updateSocialAction.bind(null, s.id)}
            deleteAction={deleteSocialAction.bind(null, s.id)}
            modalSize="full"
          />
        ))}
      </div>
    </div>
  );
}
