import "@/index.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLayout, useSendFollowUpMessage, useViewState } from "skybridge/web";
import { Sparkles } from "lucide-react";
import { useToolInfo } from "@/helpers.js";
import {
  PRODUCTS,
  type FormField,
  type ProductId,
  baseFieldsFor,
} from "@/products.js";

import Nav from "./components/nav.js";
import Progress from "./components/progress.js";
import ProductPicker from "./components/product-picker.js";
import RequirementInput from "./components/requirement-input.js";
import DynamicForm from "./components/dynamic-form.js";
import PromptPreview from "./components/prompt-preview.js";
import SubmitButton from "./components/submit-button.js";

const STEPS = ["Pick product", "Describe", "Tailor", "Submit"] as const;

type ViewState = {
  step: number;
  userProduct: ProductId | null;
  userRequirement: string | null;
  formValues: Record<string, string | number>;
  [key: string]: unknown;
};

const initialState: ViewState = {
  step: 0,
  userProduct: null,
  userRequirement: null,
  formValues: {},
};

export default function FeatureRequest() {
  const { theme } = useLayout();
  const { input, output } = useToolInfo<"feature-request">();
  const sendFollowUp = useSendFollowUpMessage();

  const [state, setState] = useViewState<ViewState>(initialState);
  const step = state.step ?? 0;
  const userProduct = (state.userProduct ?? null) as ProductId | null;
  const userRequirement = (state.userRequirement ?? null) as string | null;
  const formValues = (state.formValues ?? {}) as Record<string, string | number>;

  const autoDetected = (input?.product ?? null) as ProductId | null;
  const llmRequirement = input?.requirement ?? "";
  const llmExtraFields = (output?.extraFields ?? []) as FormField[];

  const selectedProduct: ProductId | null = userProduct ?? autoDetected;
  const requirementText = userRequirement ?? llmRequirement;
  const tailoredCount = llmExtraFields.length;

  const [tailoring, setTailoring] = useState(false);
  const prevExtrasCount = useRef(tailoredCount);
  useEffect(() => {
    if (tailoring && tailoredCount > prevExtrasCount.current) {
      setTailoring(false);
    }
    prevExtrasCount.current = tailoredCount;
  }, [tailoredCount, tailoring]);

  const baseFields = useMemo<FormField[]>(
    () => (selectedProduct ? baseFieldsFor(selectedProduct) : []),
    [selectedProduct],
  );

  const onSelectProduct = (id: ProductId) =>
    setState((p) => ({
      ...p,
      userProduct: id,
      formValues: {},
    }));

  const onChangeFormValue = (key: string, value: string | number) =>
    setState((p) => ({ ...p, formValues: { ...p.formValues, [key]: value } }));

  const finalPrompt = useMemo(() => {
    if (!selectedProduct) return "";
    const product = PRODUCTS[selectedProduct];
    const allFields: FormField[] = [...baseFields, ...llmExtraFields];
    const valueLines = allFields.map((f) => {
      const raw =
        formValues[f.key] ??
        (f.type === "slider" ? f.default : (f.default ?? f.options[0]));
      const unit = f.type === "slider" ? (f.unit ?? "") : "";
      return `- ${f.title}: ${raw}${unit}`;
    });
    return [
      `[Perforce Feature Request — ${product.name}]`,
      "",
      `Requirement:`,
      requirementText || "(no description provided)",
      "",
      `Form details:`,
      ...valueLines,
    ].join("\n");
  }, [selectedProduct, baseFields, llmExtraFields, formValues, requirementText]);

  const onTailor = async () => {
    if (!selectedProduct || !requirementText.trim()) return;
    setTailoring(true);
    const product = PRODUCTS[selectedProduct];
    const prompt =
      `The user is in the Perforce Feature Request console for ${product.name}. ` +
      `Their requirement is: "${requirementText}". ` +
      `Generate 1 or 2 extra form fields that would gather useful additional signal about this specific request, ` +
      `then re-invoke the feature-request tool with product="${selectedProduct}", requirement="${requirementText.replace(
        /"/g,
        '\\"',
      )}", and extraFields=[...]. ` +
      `Each extra field should be a slider (with realistic min/max/default/unit and a clear title) or a dropdown (with 3–6 concrete option strings tailored to the request). ` +
      `Pick fields that complement the existing base fields (priority, effort_estimate, component) — do not duplicate them. ` +
      `Use kebab-case for field keys. Be concrete and product-specific.`;
    try {
      await sendFollowUp(prompt);
    } catch (err) {
      console.error("Failed to send follow-up", err);
      setTailoring(false);
    }
  };

  const canAdvance =
    (step === 0 && !!selectedProduct) ||
    (step === 1 && requirementText.trim().length > 0) ||
    step === 2;

  const setStep = (s: number) => setState((p) => ({ ...p, step: s }));

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-p4-300/30 bg-background text-foreground shadow-2xl shadow-p4-700/10`}
      data-llm={`Perforce Feature Request console. Step ${step + 1}/${STEPS.length} (${STEPS[step]}). Selected product: ${
        selectedProduct ?? "none"
      }. Requirement: ${requirementText ? `"${requirementText}"` : "(empty)"}. Tailored fields: ${llmExtraFields.length}.`}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-0 bg-[linear-gradient(135deg,#f6f1ff_0%,#eadfff_40%,#d6bdff_100%)] bg-[length:200%_200%] animate-aurora dark:bg-[linear-gradient(135deg,#14092a_0%,#2d1f4a_50%,#1a1230_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-p4-400 to-transparent" />

        <div className="relative z-10 flex min-h-[34rem] flex-col gap-5 p-6 md:p-7">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-p4-700 to-p4-400 text-white shadow-md shadow-p4-500/40">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-tight text-foreground">
                  Perforce Feature Request
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-assisted intake for the Perforce product portfolio
                </p>
              </div>
            </div>
            {selectedProduct && (
              <div className="flex items-center gap-2 rounded-full border border-p4-300/60 bg-card/80 px-3 py-1 text-xs backdrop-blur-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PRODUCTS[selectedProduct].accent }}
                />
                <span className="font-medium text-foreground">
                  {PRODUCTS[selectedProduct].name}
                </span>
              </div>
            )}
          </header>

          <Progress steps={STEPS} current={step} onSelect={setStep} />

          <div className="grid flex-1">
            {/* Step 0: Product picker */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-5 ${
                step === 0 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 0}
            >
              <ProductPicker
                selected={selectedProduct}
                autoDetected={autoDetected}
                onSelect={onSelectProduct}
              />
            </div>

            {/* Step 1: Requirement */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-5 ${
                step === 1 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 1}
            >
              <RequirementInput
                value={requirementText}
                onChange={(v) => setState((p) => ({ ...p, userRequirement: v }))}
                productName={selectedProduct ? PRODUCTS[selectedProduct].name : null}
              />
            </div>

            {/* Step 2: Tailored form */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-5 ${
                step === 2 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 2}
            >
              {selectedProduct ? (
                <DynamicForm
                  baseFields={baseFields}
                  extraFields={llmExtraFields}
                  values={formValues}
                  onChange={onChangeFormValue}
                  onTailor={onTailor}
                  isTailoring={tailoring}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                  Pick a product first.
                </div>
              )}
              {tailoredCount > 0 && (
                <div className="text-[11px] text-muted-foreground/80 text-center">
                  ✨ {tailoredCount} field{tailoredCount === 1 ? "" : "s"} tailored by Claude.
                </div>
              )}
            </div>

            {/* Step 3: Submit */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-4 ${
                step === 3 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 3}
            >
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Review & submit
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This prompt will be sent to{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                    http://localhost:3001/submit-request
                  </code>
                  .
                </p>
              </div>
              <PromptPreview prompt={finalPrompt} />
              <SubmitButton
                prompt={finalPrompt}
                disabled={!selectedProduct || !requirementText.trim()}
              />
            </div>
          </div>

          <Nav
            current={step}
            total={STEPS.length}
            onChange={setStep}
            canAdvance={canAdvance}
            nextLabel={step === 2 ? "Review" : "Next"}
          />
        </div>
      </div>
    </div>
  );
}
