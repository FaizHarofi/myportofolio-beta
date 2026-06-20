import { LayoutGrid, Image as ImageIcon } from "lucide-react";
import { getGridItems } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
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
    hint: "Tailwind classes that control the bento grid placement.",
  },
  { name: "imgClassName", label: "Image className" },
  { name: "titleClassName", label: "Title className" },
  { name: "img", label: "Image path", placeholder: "/b1.svg" },
  { name: "spareImg", label: "Spare image path", placeholder: "/grid.svg" },
];

export default async function AdminGridItems() {
  const items = await getGridItems();

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Grid Items"
        description="Bento grid cards shown on the homepage. Each item controls its own layout, image, and text styles."
        icon={<LayoutGrid size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new grid item"
            description="Pick layout classes and visual assets for the homepage grid."
            fields={fields}
            action={createGridItemAction}
            modalSize="lg"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All grid items"
            description="Edit layout, classes, and assets per card."
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={LayoutGrid}
              title="No grid items yet"
              description="Add grid items to build out the homepage bento layout."
              action={
                <AddNewButton
                  title="Add new grid item"
                  fields={fields}
                  action={createGridItemAction}
                  modalSize="lg"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((g) => (
                <EditableItem
                  key={g.id}
                  title={g.title || `Item #${g.id}`}
                  subtitle={g.description}
                  meta={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        #{g.id}
                      </span>
                      {g.className ? (
                        <code className="text-[10px] text-slate-400 bg-slate-900/70 border border-white/10 rounded px-1.5 py-0.5 truncate max-w-[280px]">
                          {g.className}
                        </code>
                      ) : null}
                    </div>
                  }
                  thumbnail={
                    g.img ? (
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                        <img
                          src={g.img}
                          alt={g.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-indigo-200">
                        <ImageIcon size={20} />
                      </div>
                    )
                  }
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
                  modalSize="lg"
                />
              ))}
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
}
