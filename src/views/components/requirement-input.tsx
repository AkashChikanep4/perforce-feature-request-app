import { useEffect, useMemo, useRef } from "react";
import { Pencil, Wand2, AlertCircle, Target, Users, FileText } from "lucide-react";
import type { ProductView } from "../product-assets.js";
import ClarityMeter, { type ClarityState } from "./clarity-meter.js";
import ExamplesPopover from "./examples-popover.js";

export interface StructuredRequirement {
  problem: string;
  outcome: string;
  audience: string;
}

interface Props {
  product: ProductView | null;
  value: StructuredRequirement;
  onChange: (next: StructuredRequirement) => void;
  onSharpen: () => void;
  sharpening?: boolean;
}

const MAX = 600;

function lengthOk(s: string) {
  return s.trim().length >= 30;
}

function hasSpecific(text: string) {
  const t = text.toLowerCase();
  return (
    /\d/.test(t) ||
    /(saml|sso|okta|azure|aws|gcp|jwt|oauth|api|sdk|cli|ui|ux|kpi|sla|p\d{2})/.test(t) ||
    /(slack|github|gitlab|jenkins|terraform|kubernetes|docker|vault|jira)/.test(t)
  );
}

export default function RequirementInput({
  product,
  value,
  onChange,
  onSharpen,
  sharpening,
}: Props) {
  const problemRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    problemRef.current?.focus();
  }, []);

  const clarity = useMemo<ClarityState>(
    () => ({
      problem: lengthOk(value.problem),
      outcome: lengthOk(value.outcome),
      audience: lengthOk(value.audience),
      specific:
        hasSpecific(value.problem) || hasSpecific(value.outcome) || hasSpecific(value.audience),
    }),
    [value],
  );
  const score = Object.values(clarity).filter(Boolean).length;

  const set = (key: keyof StructuredRequirement, v: string) =>
    onChange({ ...value, [key]: v });

  const productName = product?.name ?? "your product";
  const chips = product?.starterChips ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Pencil className="h-4 w-4 text-p4-700" /> Tell us about your idea
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Three short answers compose a clear {productName} feature request.
          </p>
        </div>
        {product && <ExamplesPopover product={product} onUse={(ex) => onChange({ problem: ex.problem, outcome: ex.outcome, audience: ex.audience })} />}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="self-center text-[11px] uppercase tracking-wide text-muted-foreground">
            Start with:
          </span>
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onChange(chip.seed)}
              className="inline-flex items-center gap-1 rounded-full border border-p4-200 bg-p4-50/70 px-3 py-1 text-xs font-medium text-p4-700 transition-all hover:-translate-y-0.5 hover:border-p4-400 hover:bg-p4-100 dark:border-p4-700/40 dark:bg-p4-800/30 dark:text-p4-100 dark:hover:bg-p4-700/50"
            >
              <Wand2 className="h-3 w-3" />
              {chip.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-3">
        <Field
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          label="What's the problem today?"
          textareaRef={problemRef}
          value={value.problem}
          placeholder={
            product
              ? `What about ${productName} is broken, missing, or annoying?`
              : "Pick a product first to see tailored placeholders."
          }
          onChange={(v) => set("problem", v)}
        />
        <Field
          icon={<Target className="h-4 w-4 text-p4-700" />}
          label="What's the ideal outcome?"
          value={value.outcome}
          placeholder={"What does success look like, concretely?"}
          onChange={(v) => set("outcome", v)}
        />
        <Field
          icon={<Users className="h-4 w-4 text-emerald-600" />}
          label="Who benefits and how?"
          value={value.audience}
          placeholder={"Which roles or customers, and what's the impact?"}
          onChange={(v) => set("audience", v)}
        />
      </div>

      <ClarityMeter
        state={clarity}
        score={score}
        onSharpen={onSharpen}
        sharpening={sharpening}
      />
    </div>
  );
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  textareaRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
}

function Field({ icon, label, value, placeholder, onChange, textareaRef }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
          {icon}
          {label}
        </label>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        maxLength={MAX}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="resize-none rounded-xl border border-border bg-card px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground shadow-sm transition-all focus:border-p4-700 focus:outline-none focus:ring-4 focus:ring-p4-300/40"
      />
    </div>
  );
}

export function composeRequirementText(s: StructuredRequirement): string {
  const parts: string[] = [];
  if (s.problem.trim()) parts.push(`Problem: ${s.problem.trim()}`);
  if (s.outcome.trim()) parts.push(`Desired outcome: ${s.outcome.trim()}`);
  if (s.audience.trim()) parts.push(`Who benefits: ${s.audience.trim()}`);
  return parts.join("\n\n");
}

export const requirementSectionsIcon = FileText;
