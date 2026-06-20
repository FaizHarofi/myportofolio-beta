import { Sparkles, Layers } from "lucide-react";
import { getSkills } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createSkillAction,
  deleteSkillAction,
  updateSkillAction,
} from "../../actions";

const GROUP_OPTIONS = ["Design", "Web", "Other"];

const fields: Field[] = [
  {
    name: "group_name",
    label: "Group",
    placeholder: "Design / Web / Other",
    hint: "Items with the same group render in one card.",
  },
  {
    name: "label",
    label: "Skill name",
    placeholder: "Photoshop, HTML, etc.",
  },
];

function GroupBadge({ group }: { group: string }) {
  const tone =
    group.toLowerCase() === "design"
      ? "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20"
      : group.toLowerCase() === "web"
      ? "bg-violet-500/10 text-violet-300 border-violet-500/20"
      : "bg-sky-500/10 text-sky-300 border-sky-500/20";
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${tone}`}
    >
      {group}
    </span>
  );
}

export default async function AdminSkills() {
  const items = await getSkills();
  const groupOrder = [...GROUP_OPTIONS];
  const sorted = [...items].sort(
    (a, b) =>
      groupOrder.indexOf(a.group_name) - groupOrder.indexOf(b.group_name) ||
      a.position - b.position
  );

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Skills"
        description="Skills shown on the /info page. Group items by category (Design, Web, Other)."
        icon={<Sparkles size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new skill"
            description="Pick a group and enter the skill name."
            fields={fields}
            action={createSkillAction}
            modalSize="md"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All skills"
            description="Click edit to update group or label."
            count={items.length}
          />
          {sorted.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No skills yet"
              description="Add your first skill and group it under Design or Web."
              action={
                <AddNewButton
                  title="Add new skill"
                  fields={fields}
                  action={createSkillAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {sorted.map((s) => (
                <EditableItem
                  key={s.id}
                  title={s.label}
                  subtitle={`Group: ${s.group_name}`}
                  meta={
                    <div className="flex items-center gap-2 flex-wrap">
                      <GroupBadge group={s.group_name} />
                      <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-950/5 text-slate-300 border border-white/10">
                        #{s.id}
                      </span>
                    </div>
                  }
                  thumbnail={
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-violet-500/25 via-fuchsia-500/15 to-indigo-500/25 border border-white/10 flex items-center justify-center text-violet-200">
                      <Layers size={18} />
                    </div>
                  }
                  fields={fields}
                  defaults={{
                    group_name: s.group_name,
                    label: s.label,
                  }}
                  updateAction={updateSkillAction.bind(null, s.id)}
                  deleteAction={deleteSkillAction.bind(null, s.id)}
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
