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
    <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm transition-colors hover:border-p4-300">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {field.title}
        {aiSuggested && (
          <span className="rounded-full bg-p4-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-p4-700 dark:bg-p4-700/40 dark:text-p4-100">
            AI
          </span>
        )}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-9 text-sm text-foreground transition-colors focus:border-p4-500 focus:outline-none focus:ring-2 focus:ring-p4-300"
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
