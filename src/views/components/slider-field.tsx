import type { SliderField } from "@/products.js";

interface Props {
  field: SliderField;
  value: number;
  onChange: (v: number) => void;
  aiSuggested?: boolean;
}

export default function SliderFieldInput({ field, value, onChange, aiSuggested }: Props) {
  const pct = ((value - field.min) / (field.max - field.min)) * 100;
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm transition-colors hover:border-p4-300">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          {field.title}
          {aiSuggested && (
            <span className="rounded-full bg-p4-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-p4-700 dark:bg-p4-700/40 dark:text-p4-100">
              AI
            </span>
          )}
        </label>
        <span className="font-mono text-sm tabular-nums font-semibold text-p4-700 dark:text-p4-200">
          {value}
          {field.unit ?? ""}
        </span>
      </div>
      <div className="relative h-1.5">
        <div className="absolute inset-0 rounded-full bg-muted" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-p4-500 to-p4-400"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-p4-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-p4-600"
          aria-label={field.title}
        />
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground/70">
        <span>
          {field.min}
          {field.unit ?? ""}
        </span>
        <span>
          {field.max}
          {field.unit ?? ""}
        </span>
      </div>
    </div>
  );
}
