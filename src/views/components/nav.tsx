import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Nav({
  current,
  total,
  onChange,
  canAdvance = true,
  nextLabel = "Next",
}: {
  current: number;
  total: number;
  onChange: (index: number) => void;
  canAdvance?: boolean;
  nextLabel?: string;
}) {
  const atEnd = current === total - 1;
  return (
    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
      <button
        type="button"
        disabled={current === 0}
        onClick={() => onChange(Math.max(current - 1, 0))}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>
      <span className="text-xs text-muted-foreground tabular-nums">
        Step {current + 1} of {total}
      </span>
      <button
        type="button"
        disabled={atEnd || !canAdvance}
        onClick={() => onChange(Math.min(current + 1, total - 1))}
        className="inline-flex items-center gap-1.5 rounded-full bg-p4-600 px-4 py-1.5 text-xs font-medium text-white shadow-md shadow-p4-500/30 transition-colors hover:bg-p4-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {nextLabel} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
