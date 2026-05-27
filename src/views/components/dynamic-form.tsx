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
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">Add some context</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          A few quick controls. The AI can suggest extra fields tailored to your idea.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Base
        </span>
        <div className="grid gap-3 sm:grid-cols-3">
          {baseFields.map((f) => renderField(f))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-3 w-3 text-p4-700" />
            AI-tailored
          </span>
          <button
            type="button"
            onClick={onTailor}
            disabled={isTailoring || !canTailor}
            className="inline-flex items-center gap-1.5 rounded-full border border-p4-300/70 bg-p4-50 px-3 py-1.5 text-xs font-medium text-p4-700 transition-all hover:-translate-y-0.5 hover:border-p4-400 hover:bg-p4-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-p4-800/40 dark:text-p4-100 dark:hover:bg-p4-700/50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isTailoring ? "animate-pulse" : ""}`} />
            {isTailoring
              ? "Adding fields…"
              : extraFields.length > 0
                ? "Re-tailor"
                : "Add fields"}
          </button>
        </div>
        {extraFields.length === 0 && !isTailoring && (
          <div className="rounded-xl border border-dashed border-p4-300/60 bg-p4-50/40 px-4 py-3 text-xs text-muted-foreground dark:border-p4-700/40 dark:bg-p4-800/20">
            Claude will suggest 1–2 extra fields specific to your idea — like
            <em> expected scale</em>, <em>customer tier</em>, or <em>integration target</em>.
            Click <span className="font-medium text-foreground">Add fields</span>.
          </div>
        )}
        {isTailoring && extraFields.length === 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border/40 bg-gradient-to-r from-muted via-p4-100/50 to-muted bg-[length:200%_100%] animate-shimmer"
              />
            ))}
          </div>
        )}
        {extraFields.length > 0 && (
          <div className="grid gap-3 animate-fade-in sm:grid-cols-3">
            {extraFields.map((f) => renderField(f, true))}
          </div>
        )}
      </div>
    </div>
  );
}
