import { getTestimonials } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { type Field } from "@/components/admin/EntityForm";
import {
  createTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction,
} from "../../actions";

const fields: Field[] = [
  { name: "quote", label: "Quote", type: "textarea" },
  { name: "name", label: "Name", placeholder: "John Doe" },
  { name: "title", label: "Title / Role", placeholder: "CEO, Acme Inc." },
];

export default async function AdminTestimonials() {
  const items = await getTestimonials();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <AddNewButton
          title="Add new testimonial"
          fields={fields}
          action={createTestimonialAction}
          modalSize="full"
        />
      </div>

      <div className="space-y-3">
        {items.map((t) => (
          <EditableItem
            key={t.id}
            title={t.name}
            subtitle={t.title}
            fields={fields}
            defaults={{ quote: t.quote, name: t.name, title: t.title }}
            updateAction={updateTestimonialAction.bind(null, t.id)}
            deleteAction={deleteTestimonialAction.bind(null, t.id)}
            modalSize="full"
          />
        ))}
      </div>
    </div>
  );
}
