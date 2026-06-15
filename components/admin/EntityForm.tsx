"use client";

import { type ReactNode } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "list";
  placeholder?: string;
};

export function EntityForm({
  fields,
  defaults,
  action,
  submitLabel,
  extra,
  children,
  onAfterSubmit,
  columns = 1,
  className,
}: {
  fields: Field[];
  defaults?: Record<string, string>;
  action: (formData: FormData) => Promise<void> | void;
  submitLabel: string;
  extra?: ReactNode;
  children?: ReactNode;
  onAfterSubmit?: () => void;
  columns?: 1 | 2;
  className?: string;
}) {
  const baseInput =
    "w-full rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-sm text-white outline-none focus:border-sky-500 placeholder:text-slate-600";

  async function handleAction(formData: FormData) {
    await action(formData);
    onAfterSubmit?.();
  }

  const renderField = (f: Field) => {
    const value = defaults?.[f.name] ?? "";
    return (
      <div key={f.name}>
        <label className="block text-[11px] font-medium text-slate-400 mb-1">
          {f.label}
        </label>
        {f.type === "textarea" ? (
          <textarea
            name={f.name}
            defaultValue={value}
            placeholder={f.placeholder}
            rows={2}
            className={baseInput}
          />
        ) : f.type === "list" ? (
          <input
            type="text"
            name={f.name}
            defaultValue={value}
            placeholder={f.placeholder ?? "/a.svg,/b.svg"}
            className={baseInput}
          />
        ) : (
          <input
            type="text"
            name={f.name}
            defaultValue={value}
            placeholder={f.placeholder}
            className={baseInput}
          />
        )}
      </div>
    );
  };

  return (
    <form action={handleAction} className={`space-y-2 ${className ?? ""}`}>
      {columns === 2 ? (
        <div className="grid grid-cols-2 gap-3">{fields.map(renderField)}</div>
      ) : (
        <div className="space-y-2">{fields.map(renderField)}</div>
      )}
      {children}
      {extra}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="rounded-md bg-sky-500 hover:bg-sky-400 transition px-4 py-1.5 text-sm font-semibold text-slate-950"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function DeleteButton({
  action,
  onAfterSubmit,
}: {
  action: () => Promise<void>;
  onAfterSubmit?: () => void;
}) {
  async function handleAction() {
    await action();
    onAfterSubmit?.();
  }

  return (
    <form action={handleAction}>
      <button
        type="submit"
        className="rounded-md border border-red-500/40 text-red-300 hover:bg-red-500/10 px-3 py-1 text-xs font-medium transition"
      >
        Delete
      </button>
    </form>
  );
}
