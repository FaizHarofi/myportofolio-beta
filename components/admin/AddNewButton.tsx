"use client";

import { useState, type ReactNode } from "react";
import { EditModal } from "./EditModal";
import { EntityForm, type Field } from "./EntityForm";

export function AddNewButton({
  title,
  fields,
  action,
  modalSize = "full",
  buttonLabel = "+ Add new",
  columns = 1,
  children,
}: {
  title: string;
  fields: Field[];
  action: (formData: FormData) => Promise<void>;
  modalSize?: "sm" | "md" | "lg" | "xl" | "full";
  buttonLabel?: string;
  columns?: 1 | 2;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-sky-500 hover:bg-sky-400 transition px-4 py-2 text-sm font-semibold text-slate-950"
      >
        {buttonLabel}
      </button>

      <EditModal
        open={open}
        onOpenChange={setOpen}
        title={title}
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
