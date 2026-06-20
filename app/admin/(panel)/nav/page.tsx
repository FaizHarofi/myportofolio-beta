import { getNavItems } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { type Field } from "@/components/admin/EntityForm";
import {
  createNavAction,
  deleteNavAction,
  updateNavAction,
} from "../../actions";

const fields: Field[] = [
  { name: "name", label: "Label", placeholder: "About" },
  {
    name: "link",
    label: "Anchor / link",
    placeholder: "#about",
    hint: "Use #section for in-page anchors, /path for routes, or full https:// URL.",
  },
];

export default async function AdminNav() {
  const items = await getNavItems();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Nav Items</h1>
        <AddNewButton
          title="Add new nav"
          fields={fields}
          action={createNavAction}
          modalSize="full"
        />
      </div>

      <div className="space-y-3">
        {items.map((n) => (
          <EditableItem
            key={n.id}
            title={n.name}
            subtitle={`id: ${n.id} • ${n.link}`}
            fields={fields}
            defaults={{ name: n.name, link: n.link }}
            updateAction={updateNavAction.bind(null, n.id)}
            deleteAction={deleteNavAction.bind(null, n.id)}
            modalSize="full"
          />
        ))}
      </div>
    </div>
  );
}
