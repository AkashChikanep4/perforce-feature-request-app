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
}

export default function DynamicForm({
  baseFields,
  extraFields,
  values,
  onChange,
  onTailor,
  isTailoring,
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
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {baseFields.map((f) => renderField(f))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-p4-500" />
            <h4 className="text-sm font-semibold text-foreground">
              AI-tailored signal
            </h4>
            <span className="text-xs text-muted-foreground">
              ({extraFields.length} field{extraFields.length === 1 ? "" : "s"})
            </span>
          </div>
          <button
            type="button"
            onClick={onTailor}
            disabled={isTailoring}
            className="inline-flex items-center gap-1.5 rounded-full border border-p4-300/70 bg-p4-50 px-3 py-1.5 text-xs font-medium text-p4-700 transition-colors hover:bg-p4-100 disabled:opacity-50 dark:bg-p4-700/30 dark:text-p4-100 dark:hover:bg-p4-700/50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isTailoring ? "animate-pulse" : ""}`} />
            {isTailoring ? "Asking AI…" : "Tailor form to my requirement"}
          </button>
        </div>

        {extraFields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-p4-300/50 bg-p4-50/40 p-4 text-xs text-muted-foreground dark:bg-p4-700/10">
            Claude will pick 1–2 extra slider or dropdown fields specific to your requirement (e.g.
            <em> expected scale</em>, <em>customer tier</em>, <em>integration target</em>).
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 animate-fade-in">
            {extraFields.map((f) => renderField(f, true))}
          </div>
        )}

        {isTailoring && extraFields.length === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border/40 bg-gradient-to-r from-muted via-p4-100/50 to-muted bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
