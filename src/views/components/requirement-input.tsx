import { useEffect, useRef, useState } from "react";
import { Sparkles, Wand2, ChevronDown } from "lucide-react";
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
  onDraft: () => void;
  drafting?: boolean;
}

const ONE_LINER_MAX = 140;
const DETAIL_MAX = 600;

export default function RequirementInput({
  product,
  oneLiner,
  onOneLinerChange,
  value,
  onChange,
  onDraft,
  drafting,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
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

  const canDraft = oneLiner.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            What do you want from {productName}?
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            One line is enough — Claude will fill in the rest.
          </p>
        </div>
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

      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={oneLiner}
            maxLength={ONE_LINER_MAX}
            onChange={(e) => onOneLinerChange(e.target.value)}
            placeholder={`e.g. "Add SAML SSO with Okta to ${productName}"`}
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 pr-36 text-[15px] font-medium text-foreground shadow-sm transition-all focus:border-p4-700 focus:outline-none focus:ring-4 focus:ring-p4-300/40"
          />
          <button
            type="button"
            onClick={onDraft}
            disabled={drafting || !canDraft}
            className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-xl bg-p4-700 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-p4-500/30 transition-all hover:bg-p4-800 disabled:opacity-40 disabled:shadow-none"
          >
            <Sparkles className={`h-3.5 w-3.5 ${drafting ? "animate-pulse" : ""}`} />
            {drafting ? "Drafting…" : "Draft with AI"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {oneLiner.length}/{ONE_LINER_MAX}
          </span>
          {hasDetail && !expanded && (
            <span className="inline-flex items-center gap-1 text-[10px] text-p4-700 dark:text-p4-200">
              <Sparkles className="h-3 w-3" /> Detail saved
            </span>
          )}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Quick starters
          </span>
          <div className="flex flex-wrap gap-2">
            {chips.slice(0, 4).map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  onOneLinerChange(chip.label);
                  onChange(chip.seed);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-p4-200 bg-p4-50/70 px-3 py-1.5 text-xs font-medium text-p4-700 transition-all hover:-translate-y-0.5 hover:border-p4-400 hover:bg-p4-100 dark:border-p4-700/40 dark:bg-p4-800/30 dark:text-p4-100 dark:hover:bg-p4-700/50"
              >
                <Wand2 className="h-3 w-3" />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded
            ? "Hide detail"
            : hasDetail
              ? "Edit Problem / Outcome / Audience"
              : "Add structured detail (optional)"}
        </button>

        {expanded && (
          <div className="mt-3 grid gap-3 animate-fade-in lg:grid-cols-3">
            <Mini label="Problem" value={value.problem} onChange={(v) => set("problem", v)} />
            <Mini label="Desired outcome" value={value.outcome} onChange={(v) => set("outcome", v)} />
            <Mini label="Who benefits" value={value.audience} onChange={(v) => set("audience", v)} />
          </div>
        )}
      </div>
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
        <span className="text-[9px] tabular-nums text-muted-foreground">
          {value.length}/{DETAIL_MAX}
        </span>
      </div>
      <textarea
        value={value}
        maxLength={DETAIL_MAX}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="resize-none rounded-lg border border-border bg-card px-3 py-2 text-[12px] leading-snug text-foreground transition-all focus:border-p4-700 focus:outline-none focus:ring-2 focus:ring-p4-300/40"
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
