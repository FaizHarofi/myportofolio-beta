import { Briefcase, Sparkles } from "lucide-react";
import { getServices } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "../../actions";

const ICON_OPTIONS = [
  "Palette",
  "Code2",
  "Layout",
  "Smartphone",
  "Film",
  "Printer",
  "Sparkles",
  "Image",
  "Globe",
  "Zap",
  "Camera",
  "Music",
  "Pen",
  "Brush",
  "Wand",
];

const TONE_OPTIONS = [
  "violet",
  "fuchsia",
  "indigo",
  "sky",
  "emerald",
  "amber",
];

const fields: Field[] = [
  {
    name: "title",
    label: "Service name",
    placeholder: "Web Development",
  },
  {
    name: "icon",
    label: "Icon",
    placeholder: "Code2",
    hint: `Pick from: ${ICON_OPTIONS.slice(0, 6).join(", ")}…`,
  },
  {
    name: "tone",
    label: "Color tone",
    placeholder: "violet",
    hint: `Pick from: ${TONE_OPTIONS.join(", ")}`,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "What this service includes.",
  },
];

const toneStyles: Record<string, string> = {
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  sky: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

export default async function AdminServices() {
  const items = await getServices();

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Services"
        description="Services shown on the homepage. Each entry has title, icon, color tone, and description."
        icon={<Briefcase size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new service"
            description="Pick an icon and color tone for visual consistency."
            fields={fields}
            action={createServiceAction}
            modalSize="md"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All services"
            description="Click edit to update title, icon, tone, or description."
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No services yet"
              description="Add your first service to populate the homepage services section."
              action={
                <AddNewButton
                  title="Add new service"
                  fields={fields}
                  action={createServiceAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((s) => (
                <EditableItem
                  key={s.id}
                  title={s.title}
                  subtitle={s.description}
                  meta={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                          toneStyles[s.tone] || toneStyles.violet
                        }`}
                      >
                        {s.tone}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-950/5 text-slate-300 border border-white/10 font-mono">
                        {s.icon}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-950/5 text-slate-400 border border-white/10">
                        #{s.id}
                      </span>
                    </div>
                  }
                  fields={fields}
                  defaults={{
                    title: s.title,
                    icon: s.icon,
                    tone: s.tone,
                    description: s.description,
                  }}
                  updateAction={updateServiceAction.bind(null, s.id)}
                  deleteAction={deleteServiceAction.bind(null, s.id)}
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
