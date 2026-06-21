"use client";

import { useState, type ReactNode } from "react";
import { Save, Trash2, Loader2, Upload } from "lucide-react";
import { Button } from "./Button";
import { FileInput } from "./FileInput";
import { SocialPicker, type SocialOption } from "./SocialPicker";
import { CompanyPicker, type CompanyOption } from "./CompanyPicker";
import { CoverPicker, type CoverOption } from "./CoverPicker";
import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "list"
    | "file"
    | "social-picker"
    | "company-picker"
    | "cover-picker";
  placeholder?: string;
  hint?: string;
  accept?: string;
  options?: SocialOption[] | CompanyOption[] | CoverOption[];
};

const inputBase =
  "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-slate-900 focus:ring-2 focus:ring-violet-500/20";

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
  submitIcon,
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
  submitIcon?: ReactNode;
}) {
  const [pending, setPending] = useState(false);

  async function handleAction(formData: FormData) {
    setPending(true);
    try {
      await action(formData);
      onAfterSubmit?.();
    } finally {
      setPending(false);
    }
  }

  const renderField = (f: Field) => {
    const value = defaults?.[f.name] ?? "";
    return (
      <div key={f.name}>
        <label
          htmlFor={f.name}
          className="mb-1.5 block text-xs font-medium text-slate-300"
        >
          {f.label}
        </label>
        {f.type === "textarea" ? (
          <textarea
            id={f.name}
            name={f.name}
            defaultValue={value}
            placeholder={f.placeholder}
            rows={3}
            className={cn(inputBase, "min-h-[88px] resize-y leading-relaxed")}
          />
        ) : f.type === "list" ? (
          <input
            id={f.name}
            type="text"
            name={f.name}
            defaultValue={value}
            placeholder={f.placeholder ?? "/a.svg,/b.svg"}
            className={inputBase}
          />
        ) : f.type === "file" ? (
          <FileInput
            id={f.name}
            name={f.name}
            accept={f.accept ?? ".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"}
            variant="cover"
          />
        ) : f.type === "social-picker" ? (
          <SocialPicker
            name={f.name}
            value={value}
            options={(f.options ?? []) as SocialOption[]}
          />
        ) : f.type === "company-picker" ? (
          <CompanyPicker
            name={f.name}
            value={value}
            options={(f.options ?? []) as CompanyOption[]}
          />
        ) : f.type === "cover-picker" ? (
          <CoverPicker
            name={f.name}
            value={value}
            options={(f.options ?? []) as CoverOption[]}
          />
        ) : (
          <input
            id={f.name}
            type="text"
            name={f.name}
            defaultValue={value}
            placeholder={f.placeholder}
            className={inputBase}
          />
        )}
        {f.hint ? (
          <p className="mt-1.5 text-[11px] text-slate-500">{f.hint}</p>
        ) : null}
      </div>
    );
  };

  return (
    <form
      action={handleAction}
      className={cn("space-y-4", className)}
    >
      {columns === 2 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(renderField)}
        </div>
      ) : (
        <div className="space-y-4">{fields.map(renderField)}</div>
      )}
      {children}
      {extra}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
        <Button
          type="submit"
          disabled={pending}
          variant="primary"
          size="md"
        >
          {pending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : submitIcon ? (
            submitIcon
          ) : (
            <Save size={16} />
          )}
          {pending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function DeleteButton({
  action,
  label = "Delete",
  onAfterSubmit,
  size = "sm",
  variant = "danger",
  icon,
  className = "",
}: {
  action: () => Promise<void>;
  label?: string;
  onAfterSubmit?: () => void;
  size?: "sm" | "md";
  variant?: "danger" | "ghost";
  icon?: ReactNode;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleAction() {
    if (pending) return;
    setPending(true);
    try {
      await action();
      onAfterSubmit?.();
    } finally {
      setPending(false);
    }
  }

  const sizeClass =
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm";

  const variantClass =
    variant === "danger"
      ? "bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-200"
      : "bg-transparent text-slate-400 hover:text-rose-300 hover:bg-rose-500/10";

  return (
    <form action={handleAction}>
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass,
          variantClass,
          className
        )}
      >
        {pending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : icon ? (
          icon
        ) : (
          <Trash2 size={14} />
        )}
        {label}
      </button>
    </form>
  );
}
