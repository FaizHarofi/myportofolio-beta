import { Quote } from "lucide-react";
import { getTestimonials } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
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
      <PageHeader
        title="Testimonials"
        description="Client and peer testimonials that appear in the infinite cards section."
        icon={<Quote size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new testimonial"
            description="Add a quote, attribution, and role."
            fields={fields}
            action={createTestimonialAction}
            modalSize="md"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All testimonials"
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={Quote}
              title="No testimonials yet"
              description="Collect quotes from clients to build social proof."
              action={
                <AddNewButton
                  title="Add new testimonial"
                  fields={fields}
                  action={createTestimonialAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((t) => (
                <EditableItem
                  key={t.id}
                  title={t.name || `Testimonial #${t.id}`}
                  subtitle={t.title}
                  meta={
                    t.quote ? (
                      <p className="text-xs text-slate-400 italic line-clamp-2">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    ) : null
                  }
                  fields={fields}
                  defaults={{ quote: t.quote, name: t.name, title: t.title }}
                  updateAction={updateTestimonialAction.bind(null, t.id)}
                  deleteAction={deleteTestimonialAction.bind(null, t.id)}
                  modalSize="md"
                />
              ))}
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
}
