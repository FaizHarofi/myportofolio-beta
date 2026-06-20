"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { EditModal } from "./EditModal";
import { EntityForm, type Field } from "./EntityForm";

export function AddNewButton({
  title,
  description,
  fields,
  action,
  modalSize = "lg",
  buttonLabel = "Add new",
  columns = 1,
  icon,
  children,
}: {
  title: string;
  description?: string;
  fields: Field[];
  action: (formData: FormData) => Promise<void>;
  modalSize?: "sm" | "md" | "lg" | "xl" | "full";
  buttonLabel?: string;
  columns?: 1 | 2;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:brightness-110 transition active:scale-[0.98]"
      >
        {icon ?? <Plus size={16} />}
        {buttonLabel}
      </button>

      <EditModal
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        size={modalSize}
      >
        <EntityForm
          fields={fields}
          action={action}
          onAfterSubmit={() => setOpen(false)}
          submitLabel="Create"
          columns={columns}
        >
          {children}
        </EntityForm>
      </EditModal>
    </>
  );
}
