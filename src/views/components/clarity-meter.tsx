import { Sparkles, Check, Circle } from "lucide-react";

export interface ClarityState {
  problem: boolean;
  outcome: boolean;
  audience: boolean;
  specific: boolean;
}

interface Props {
  state: ClarityState;
  score: number; // 0..4
  onSharpen: () => void;
  sharpening?: boolean;
}

const LABELS: { key: keyof ClarityState; label: string; hint: string }[] = [
  { key: "problem", label: "Problem", hint: "Describe what's broken or missing today." },
  { key: "outcome", label: "Outcome", hint: "Spell out what success looks like." },
  { key: "audience", label: "Audience", hint: "Name who benefits and why." },
  { key: "specific", label: "Specific", hint: "Add a concrete detail (numbers, names, scenarios)." },
];

export default function ClarityMeter({ state, score, onSharpen, sharpening }: Props) {
  const pct = (score / 4) * 100;
  const tone =
    score >= 4
      ? "text-green-700 dark:text-green-300"
      : score >= 3
        ? "text-p4-700 dark:text-p4-200"
        : "text-amber-700 dark:text-amber-300";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-p4-200/70 bg-gradient-to-br from-p4-50/70 to-card p-4 dark:border-p4-700/40 dark:from-p4-800/30 dark:to-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-p4-700" />
          <h4 className="text-sm font-semibold text-foreground">Clarity check</h4>
          <span className={`text-xs font-medium tabular-nums ${tone}`}>{score}/4</span>
        </div>
        <button
          type="button"
          onClick={onSharpen}
          disabled={sharpening || score === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-p4-300/70 bg-p4-50 px-3 py-1.5 text-xs font-medium text-p4-700 transition-colors hover:bg-p4-100 disabled:opacity-50 dark:bg-p4-800/40 dark:text-p4-100 dark:hover:bg-p4-700/50"
        >
          <Sparkles className={`h-3.5 w-3.5 ${sharpening ? "animate-pulse" : ""}`} />
          {sharpening ? "Sharpening…" : "Sharpen with AI"}
        </button>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-p4-500 to-p4-300 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {LABELS.map(({ key, label, hint }) => {
          const on = state[key];
          return (
            <div
              key={key}
              className={`flex items-start gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                on
                  ? "border-p4-300/60 bg-card text-foreground"
                  : "border-border bg-muted/40 text-muted-foreground"
              }`}
              title={hint}
            >
              {on ? (
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-p4-700" strokeWidth={3} />
              ) : (
                <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              )}
              <span className="font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
