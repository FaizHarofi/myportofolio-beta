import { Building2, Image as ImageIcon } from "lucide-react";
import { getCompanies } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
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
      <PageHeader
        title="Companies"
        description="Trusted-by logos and wordmarks shown in the Clients marquee."
        icon={<Building2 size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new company"
            description="Add a logo and its wordmark image."
            fields={fields}
            action={createCompanyAction}
            modalSize="md"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All companies"
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No companies yet"
              description="Add logos to showcase trusted-by clients and partners."
              action={
                <AddNewButton
                  title="Add new company"
                  fields={fields}
                  action={createCompanyAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((c) => (
                <EditableItem
                  key={c.id}
                  title={c.name || `Company #${c.id}`}
                  subtitle={
                    c.img ? c.img : "Add a logo path to display the mark."
                  }
                  meta={
                    <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      #{c.id}
                    </span>
                  }
                  thumbnail={
                    c.img ? (
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center p-2">
                        <img
                          src={c.img}
                          alt={c.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-sky-200">
                        <ImageIcon size={20} />
                      </div>
                    )
                  }
                  fields={fields}
                  defaults={{ name: c.name, img: c.img, nameImg: c.nameImg }}
                  updateAction={updateCompanyAction.bind(null, c.id)}
                  deleteAction={deleteCompanyAction.bind(null, c.id)}
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
