import { useEffect, useMemo, useRef, useState } from "react";
import { Wand2, ChevronDown, Sparkles, BookOpen } from "lucide-react";
import type { ProductView } from "../product-assets.js";
import ExamplesPopover from "./examples-popover.js";

export interface StructuredRequirement {
  problem: string;
  outcome: string;
  audience: string;
}

interface Props {
  product: ProductView | null;
  oneLiner: string;
  onOneLinerChange: (v: string) => void;
  value: StructuredRequirement;
  onChange: (next: StructuredRequirement) => void;
  onSharpen: () => void;
  sharpening?: boolean;
}

const ONE_LINER_MAX = 140;
const MAX = 600;

export default function RequirementInput({
  product,
  oneLiner,
  onOneLinerChange,
  value,
  onChange,
  onSharpen,
  sharpening,
}: Props) {
  const oneLinerRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    oneLinerRef.current?.focus();
  }, []);

  const [expanded, setExpanded] = useState(false);
  const hasDetail =
    value.problem.trim().length > 0 ||
    value.outcome.trim().length > 0 ||
    value.audience.trim().length > 0;

  const productName = product?.name ?? "your product";
  const chips = product?.starterChips ?? [];

  const set = (key: keyof StructuredRequirement, v: string) =>
    onChange({ ...value, [key]: v });

  const composedFromOneLiner = useMemo(() => oneLiner.trim().length > 0, [oneLiner]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          In one line, what do you want from {productName}?
        </h3>
        {product && (
          <ExamplesPopover
            product={product}
            onUse={(ex) => {
              onOneLinerChange(ex.title);
              onChange({
                problem: ex.problem,
                outcome: ex.outcome,
                audience: ex.audience,
              });
              setExpanded(true);
            }}
          />
        )}
      </div>

      <div className="relative">
        <input
          ref={oneLinerRef}
          type="text"
          value={oneLiner}
          maxLength={ONE_LINER_MAX}
          onChange={(e) => onOneLinerChange(e.target.value)}
          placeholder={`e.g. "Add SAML SSO with Okta to ${productName}"`}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-32 text-sm font-medium text-foreground shadow-sm transition-all focus:border-p4-700 focus:outline-none focus:ring-4 focus:ring-p4-300/40"
        />
        <button
          type="button"
          onClick={onSharpen}
          disabled={sharpening || !composedFromOneLiner}
          className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg bg-p4-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-p4-800 disabled:opacity-40"
          title="Ask AI to fill in details and tailor the form"
        >
          <Sparkles className={`h-3.5 w-3.5 ${sharpening ? "animate-pulse" : ""}`} />
          {sharpening ? "Drafting…" : "Draft with AI"}
        </button>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Or start with:
          </span>
          {chips.slice(0, 4).map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                onOneLinerChange(chip.label);
                onChange(chip.seed);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-p4-200 bg-p4-50/70 px-2.5 py-0.5 text-xs font-medium text-p4-700 transition-all hover:border-p4-400 hover:bg-p4-100 dark:border-p4-700/40 dark:bg-p4-800/30 dark:text-p4-100 dark:hover:bg-p4-700/50"
            >
              <Wand2 className="h-3 w-3" />
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
        {expanded ? "Hide detail" : hasDetail ? "Edit detail" : "Add more detail (optional)"}
        {hasDetail && !expanded && (
          <span className="rounded-full bg-p4-100 px-1.5 py-px text-[9px] font-semibold text-p4-700 dark:bg-p4-800/40 dark:text-p4-100">
            saved
          </span>
        )}
      </button>

      {expanded && (
        <div className="grid gap-2 rounded-xl border border-border bg-card/60 p-3 animate-fade-in lg:grid-cols-3">
          <Mini label="Problem" value={value.problem} onChange={(v) => set("problem", v)} />
          <Mini label="Desired outcome" value={value.outcome} onChange={(v) => set("outcome", v)} />
          <Mini label="Who benefits" value={value.audience} onChange={(v) => set("audience", v)} />
        </div>
      )}
    </div>
  );
}

interface MiniProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function Mini({ label, value, onChange }: MiniProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
        <span className="text-[9px] tabular-nums text-muted-foreground">
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        value={value}
        maxLength={MAX}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="resize-none rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] leading-snug text-foreground transition-all focus:border-p4-700 focus:outline-none focus:ring-2 focus:ring-p4-300/40"
      />
    </div>
  );
}

export function composeRequirementText(
  oneLiner: string,
  s: StructuredRequirement,
): string {
  const parts: string[] = [];
  const headline = oneLiner.trim();
  if (headline) parts.push(`Headline: ${headline}`);
  if (s.problem.trim()) parts.push(`Problem: ${s.problem.trim()}`);
  if (s.outcome.trim()) parts.push(`Desired outcome: ${s.outcome.trim()}`);
  if (s.audience.trim()) parts.push(`Who benefits: ${s.audience.trim()}`);
  return parts.join("\n\n");
}

export const requirementHintIcon = BookOpen;
