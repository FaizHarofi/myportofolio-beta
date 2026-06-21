"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { EditModal } from "./EditModal";
import { DeleteButton, EntityForm, type Field } from "./EntityForm";

export function EditableItem({
  title,
  subtitle,
  meta,
  thumbnail,
  fields,
  defaults,
  updateAction,
  deleteAction,
  modalSize = "lg",
  columns = 1,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  meta?: ReactNode;
  thumbnail?: ReactNode;
  fields: Field[];
  defaults: Record<string, string>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
  modalSize?: "sm" | "md" | "lg" | "xl" | "full";
  columns?: 1 | 2;
  children?: ReactNode;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="group relative flex items-stretch gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-3 sm:p-4 hover:border-white/10 hover:bg-slate-900/60 transition-all">
      {thumbnail ? (
        <div className="shrink-0 self-stretch">{thumbnail}</div>
      ) : null}

      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <h3 className="text-sm sm:text-base font-semibold text-white truncate">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-slate-400 truncate">{subtitle}</p>
        ) : null}
        {meta ? <div className="mt-1.5">{meta}</div> : null}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium bg-slate-950/10 text-slate-200 border border-white/10 hover:bg-violet-500/15 hover:text-violet-200 hover:border-violet-400/40 transition active:scale-[0.98]"
        >
          <Pencil size={13} />
          Edit
        </button>
        <DeleteButton
          action={async () => {
            await deleteAction();
            setHidden(true);
          }}
        />
      </div>

      <EditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Edit: ${title}`}
        size={modalSize}
      >
        <EntityForm
          fields={fields}
          defaults={defaults}
          action={updateAction}
          onAfterSubmit={() => setEditOpen(false)}
          submitLabel="Save changes"
          columns={columns}
        >
          {children}
        </EntityForm>
      </EditModal>
    </div>
  );
}
