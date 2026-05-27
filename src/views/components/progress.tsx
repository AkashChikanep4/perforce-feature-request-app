import { Check } from "lucide-react";

export default function Progress({
  steps,
  current,
  onSelect,
}: {
  steps: readonly string[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-1.5">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const canJump = i <= current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => canJump && onSelect(i)}
              disabled={!canJump}
              aria-current={active ? "step" : undefined}
              className={`group flex flex-1 items-center gap-2 rounded-full px-2 py-1 text-left transition-colors ${
                canJump ? "cursor-pointer hover:bg-p4-50 dark:hover:bg-p4-800/30" : "cursor-not-allowed"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all ${
                  done
                    ? "bg-p4-700 text-white"
                    : active
                      ? "bg-p4-700 text-white shadow-md shadow-p4-500/40 ring-4 ring-p4-200 dark:ring-p4-700/40"
                      : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`hidden truncate text-[11px] font-medium sm:inline ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={`h-px w-3 shrink-0 transition-colors sm:w-5 ${
                  done ? "bg-p4-500" : "bg-border"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
