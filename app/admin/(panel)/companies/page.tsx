import { getCompanies } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { type Field } from "@/components/admin/EntityForm";
import {
  createCompanyAction,
  deleteCompanyAction,
  updateCompanyAction,
} from "../../actions";

const fields: Field[] = [
  { name: "name", label: "Name", placeholder: "Cloudinary" },
  { name: "img", label: "Logo path", placeholder: "/cloud.svg" },
  { name: "nameImg", label: "Name image path", placeholder: "/cloudName.svg" },
];

export default async function AdminCompanies() {
  const items = await getCompanies();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <AddNewButton
          title="Add new company"
          fields={fields}
          action={createCompanyAction}
          modalSize="full"
        />
      </div>

      <div className="space-y-3">
        {items.map((c) => (
          <EditableItem
            key={c.id}
            title={c.name}
            subtitle={`id: ${c.id}`}
            fields={fields}
            defaults={{ name: c.name, img: c.img, nameImg: c.nameImg }}
            updateAction={updateCompanyAction.bind(null, c.id)}
            deleteAction={deleteCompanyAction.bind(null, c.id)}
            modalSize="full"
          />
        ))}
      </div>
    </div>
  );
}
