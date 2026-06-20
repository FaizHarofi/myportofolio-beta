import { GraduationCap } from "lucide-react";
import { getEducations } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createEducationAction,
  deleteEducationAction,
  updateEducationAction,
} from "../../actions";

const fields: Field[] = [
  { name: "school", label: "School", placeholder: "School name" },
  { name: "period", label: "Period", placeholder: "2015 - 2021" },
  { name: "level", label: "Level", placeholder: "Sekolah Dasar (SD)" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief summary",
  },
];

export default async function AdminEducations() {
  const items = await getEducations();

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Education"
        description="Schools shown on the /info page. Each entry has school, period, level, and description."
        icon={<GraduationCap size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new education"
            description="Add a school, period, level, and description."
            fields={fields}
            action={createEducationAction}
            modalSize="md"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All education entries"
            description="Click edit to update details."
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No education yet"
              description="Add schools to populate the timeline on /info."
              action={
                <AddNewButton
                  title="Add new education"
                  fields={fields}
                  action={createEducationAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((e) => (
                <EditableItem
                  key={e.id}
                  title={e.school}
                  subtitle={e.description}
                  meta={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {e.level}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-900/70 border border-white/10 rounded px-1.5 py-0.5">
                        {e.period}
                      </span>
                    </div>
                  }
                  fields={fields}
                  defaults={{
                    school: e.school,
                    period: e.period,
                    level: e.level,
                    description: e.description,
                  }}
                  updateAction={updateEducationAction.bind(null, e.id)}
                  deleteAction={deleteEducationAction.bind(null, e.id)}
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
