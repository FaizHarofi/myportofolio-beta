import { Share2, Image as ImageIcon, ExternalLink } from "lucide-react";
import { getSocials } from "@/lib/data";
import { AddNewButton } from "@/components/admin/AddNewButton";
import { EditableItem } from "@/components/admin/EditableItem";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Surface, SectionHeader } from "@/components/admin/Surface";
import { type Field } from "@/components/admin/EntityForm";
import {
  createSocialAction,
  deleteSocialAction,
  updateSocialAction,
} from "../../actions";

const fields: Field[] = [
  { name: "img", label: "Icon path", placeholder: "/git.svg" },
  {
    name: "link",
    label: "Link URL",
    placeholder: "https://github.com/yourname",
    hint: "Where the icon should take visitors when clicked.",
  },
];

export default async function AdminSocial() {
  const items = await getSocials();

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Social Media"
        description="Icons shown in the footer social row. Each entry has an icon path and a clickable link."
        icon={<Share2 size={22} />}
        badge={`${items.length} total`}
        actions={
          <AddNewButton
            title="Add new social"
            description="Add an icon path and a link URL."
            fields={fields}
            action={createSocialAction}
            modalSize="md"
          />
        }
      />

      <Surface padded={false}>
        <div className="p-5 sm:p-6">
          <SectionHeader
            title="All socials"
            description="Click edit to update icon path or link URL."
            count={items.length}
          />
          {items.length === 0 ? (
            <EmptyState
              icon={Share2}
              title="No socials yet"
              description="Add the icons and links for the platforms you want to showcase."
              action={
                <AddNewButton
                  title="Add new social"
                  fields={fields}
                  action={createSocialAction}
                  modalSize="md"
                />
              }
            />
          ) : (
            <div className="space-y-2.5">
              {items.map((s) => (
                <EditableItem
                  key={s.id}
                  title={s.link ? hostname(s.link) : `Social #${s.id}`}
                  subtitle={s.link || "No link set"}
                  meta={
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        #{s.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/70 border border-white/10 rounded px-1.5 py-0.5 truncate max-w-[260px]">
                        <ExternalLink size={9} />
                        {s.link || "—"}
                      </span>
                    </div>
                  }
                  thumbnail={
                    s.img ? (
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center p-1.5">
                        <img
                          src={s.img}
                          alt="social"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 sm:h-14 sm:h-14 rounded-xl bg-gradient-to-br from-rose-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center text-rose-200">
                        <ImageIcon size={18} />
                      </div>
                    )
                  }
                  fields={fields}
                  defaults={{ img: s.img, link: s.link ?? "" }}
                  updateAction={updateSocialAction.bind(null, s.id)}
                  deleteAction={deleteSocialAction.bind(null, s.id)}
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

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || url;
  } catch {
    return url;
  }
}
