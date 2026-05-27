import { Sparkles } from "lucide-react";
import type { FormField } from "@/products.js";
import SliderFieldInput from "./slider-field.js";
import DropdownFieldInput from "./dropdown-field.js";

interface Props {
  baseFields: FormField[];
  extraFields: FormField[];
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
  onTailor: () => void;
  isTailoring?: boolean;
  canTailor: boolean;
}

export default function DynamicForm({
  baseFields,
  extraFields,
  values,
  onChange,
  onTailor,
  isTailoring,
  canTailor,
}: Props) {
  const renderField = (field: FormField, aiSuggested = false) => {
    if (field.type === "slider") {
      const raw = values[field.key];
      const val = typeof raw === "number" ? raw : field.default;
      return (
        <SliderFieldInput
          key={field.key}
          field={field}
          value={val}
          onChange={(v) => onChange(field.key, v)}
          aiSuggested={aiSuggested}
        />
      );
    }
    const raw = values[field.key];
    const val = typeof raw === "string" ? raw : (field.default ?? field.options[0]);
    return (
      <DropdownFieldInput
        key={field.key}
        field={field}
        value={val}
        onChange={(v) => onChange(field.key, v)}
        aiSuggested={aiSuggested}
      />
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Form details
        </h4>
        <button
          type="button"
          onClick={onTailor}
          disabled={isTailoring || !canTailor}
          className="inline-flex items-center gap-1 rounded-full border border-p4-300/70 bg-p4-50 px-2.5 py-1 text-[11px] font-medium text-p4-700 transition-colors hover:bg-p4-100 disabled:opacity-50 dark:bg-p4-800/40 dark:text-p4-100 dark:hover:bg-p4-700/50"
          title="Ask AI to add 1-2 form fields tailored to your idea"
        >
          <Sparkles className={`h-3 w-3 ${isTailoring ? "animate-pulse" : ""}`} />
          {isTailoring ? "Adding fields…" : extraFields.length > 0 ? "Re-tailor" : "+ AI fields"}
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {baseFields.map((f) => renderField(f))}
      </div>

      {extraFields.length > 0 && (
        <div className="grid gap-2 animate-fade-in sm:grid-cols-3">
          {extraFields.map((f) => renderField(f, true))}
        </div>
      )}

      {isTailoring && extraFields.length === 0 && (
        <div className="grid gap-2 sm:grid-cols-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-border/40 bg-gradient-to-r from-muted via-p4-100/50 to-muted bg-[length:200%_100%] animate-shimmer"
            />
          ))}
        </div>
      )}
    </div>
  );
}
