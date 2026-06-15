"use client";

import { useState, type ReactNode } from "react";
import { EditModal } from "./EditModal";
import { DeleteButton, EntityForm, type Field } from "./EntityForm";

export function EditableItem({
  title,
  subtitle,
  fields,
  defaults,
  updateAction,
  deleteAction,
  modalSize = "full",
  columns = 1,
  children,
}: {
  title: string;
  subtitle?: string;
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-white font-medium truncate">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="rounded-md border border-sky-500/40 text-sky-300 hover:bg-sky-500/10 px-3 py-1 text-xs font-medium transition"
        >
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
          submitLabel="Save"
          columns={columns}
        >
          {children}
        </EntityForm>
      </EditModal>
    </div>
  );
}
