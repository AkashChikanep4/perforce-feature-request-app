import { ChevronDown } from "lucide-react";
import type { DropdownField } from "@/products.js";

interface Props {
  field: DropdownField;
  value: string;
  onChange: (v: string) => void;
  aiSuggested?: boolean;
}

export default function DropdownFieldInput({ field, value, onChange, aiSuggested }: Props) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 transition-colors hover:border-p4-300">
      <label className="flex items-center gap-1.5 truncate text-[11px] font-semibold text-foreground">
        {field.title}
        {aiSuggested && (
          <span className="rounded-full bg-p4-100 px-1 py-0 text-[8px] font-semibold uppercase tracking-wider text-p4-700 dark:bg-p4-800/40 dark:text-p4-100">
            AI
          </span>
        )}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border bg-background py-1.5 pl-2.5 pr-7 text-xs text-foreground transition-colors focus:border-p4-700 focus:outline-none focus:ring-2 focus:ring-p4-300/40"
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
