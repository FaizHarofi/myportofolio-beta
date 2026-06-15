import { getGridItems } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { type Field } from "@/components/admin/EntityForm";
import {
  createGridItemAction,
  deleteGridItemAction,
  updateGridItemAction,
} from "../../actions";

const fields: Field[] = [
  { name: "title", label: "Title", type: "textarea" },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "className",
    label: "Layout className",
    placeholder: "lg:col-span-2 md:col-span-3 md:row-span-2",
  },
  { name: "imgClassName", label: "Image className" },
  { name: "titleClassName", label: "Title className" },
  { name: "img", label: "Image path", placeholder: "/b1.svg" },
  { name: "spareImg", label: "Spare image path", placeholder: "/grid.svg" },
];

export default async function AdminGridItems() {
  const items = await getGridItems();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Grid Items</h1>
        <AddNewButton
          title="Add new grid item"
          fields={fields}
          action={createGridItemAction}
          modalSize="full"
        />
      </div>

      <div className="space-y-3">
        {items.map((g) => (
          <EditableItem
            key={g.id}
            title={g.title}
            subtitle={`id: ${g.id}`}
            fields={fields}
            defaults={{
              title: g.title,
              description: g.description,
              className: g.className,
              imgClassName: g.imgClassName,
              titleClassName: g.titleClassName,
              img: g.img,
              spareImg: g.spareImg,
            }}
            updateAction={updateGridItemAction.bind(null, g.id)}
            deleteAction={deleteGridItemAction.bind(null, g.id)}
            modalSize="full"
          />
        ))}
      </div>
    </div>
  );
}
