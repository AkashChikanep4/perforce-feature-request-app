import "@/index.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLayout, useSendFollowUpMessage, useViewState } from "skybridge/web";
import { useToolInfo } from "@/helpers.js";
import {
  type FormField,
  type ProductId,
  baseFieldsFor,
} from "@/products.js";
import { PRODUCT_VIEWS } from "./product-assets.js";

import perforceWordmark from "./assets/brand/logo-perforce-horiz-reg.svg";
import perforceIconCircle from "./assets/brand/logo-perforce-icon-circle-indigo.svg";

const PRODUCTS = PRODUCT_VIEWS;

import Nav from "./components/nav.js";
import Progress from "./components/progress.js";
import ProductPicker from "./components/product-picker.js";
import RequirementInput, {
  composeRequirementText,
  type StructuredRequirement,
} from "./components/requirement-input.js";
import DynamicForm from "./components/dynamic-form.js";
import PromptPreview from "./components/prompt-preview.js";
import SubmitButton from "./components/submit-button.js";

const STEPS = ["Pick product", "Describe", "Tailor", "Submit"] as const;

type ViewState = {
  step: number;
  userProduct: ProductId | null;
  structured: StructuredRequirement | null;
  formValues: Record<string, string | number>;
  [key: string]: unknown;
};

const initialState: ViewState = {
  step: 0,
  userProduct: null,
  structured: null,
  formValues: {},
};

export default function FeatureRequest() {
  const { theme } = useLayout();
  const { input, output } = useToolInfo<"feature-request">();
  const sendFollowUp = useSendFollowUpMessage();

  const [state, setState] = useViewState<ViewState>(initialState);
  const step = state.step ?? 0;
  const userProduct = (state.userProduct ?? null) as ProductId | null;
  const structuredFromState = (state.structured ?? null) as StructuredRequirement | null;
  const formValues = (state.formValues ?? {}) as Record<string, string | number>;

  const autoDetected = (input?.product ?? null) as ProductId | null;
  const llmRequirement = input?.requirement ?? "";
  const llmExtraFields = (output?.extraFields ?? []) as FormField[];

  const selectedProduct: ProductId | null = userProduct ?? autoDetected;
  const product = selectedProduct ? PRODUCTS[selectedProduct] : null;

  const structured: StructuredRequirement = structuredFromState ?? {
    problem: llmRequirement,
    outcome: "",
    audience: "",
  };
  const requirementText = useMemo(() => composeRequirementText(structured), [structured]);

  const tailoredCount = llmExtraFields.length;

  const [tailoring, setTailoring] = useState(false);
  const [sharpening, setSharpening] = useState(false);
  const prevExtrasCount = useRef(tailoredCount);
  useEffect(() => {
    if (tailoring && tailoredCount > prevExtrasCount.current) {
      setTailoring(false);
    }
    prevExtrasCount.current = tailoredCount;
  }, [tailoredCount, tailoring]);

  const prevReq = useRef(requirementText);
  useEffect(() => {
    if (sharpening && requirementText !== prevReq.current) {
      setSharpening(false);
    }
    prevReq.current = requirementText;
  }, [requirementText, sharpening]);

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

  const onChangeStructured = (next: StructuredRequirement) =>
    setState((p) => ({ ...p, structured: next }));

  const onChangeFormValue = (key: string, value: string | number) =>
    setState((p) => ({ ...p, formValues: { ...p.formValues, [key]: value } }));

  const finalPrompt = useMemo(() => {
    if (!product) return "";
    const allFields: FormField[] = [...baseFields, ...llmExtraFields];
    const valueLines = allFields.map((f) => {
      const raw =
        formValues[f.key] ??
        (f.type === "slider" ? f.default : (f.default ?? f.options[0]));
      const unit = f.type === "slider" ? (f.unit ?? "") : "";
      return `- ${f.title}: ${raw}${unit}`;
    });
    const body = requirementText || "(no description provided)";
    return [
      `[Perforce Feature Request — ${product.name}]`,
      "",
      body,
      "",
      `Form details:`,
      ...valueLines,
    ].join("\n");
  }, [product, baseFields, llmExtraFields, formValues, requirementText]);

  const onSharpen = async () => {
    if (!selectedProduct) return;
    const filled = composeRequirementText(structured);
    if (!filled.trim()) return;
    setSharpening(true);
    const productName = PRODUCTS[selectedProduct].name;
    const prompt =
      `The user is in the Perforce Feature Request console for ${productName}. ` +
      `They have drafted a feature request structured as Problem / Desired outcome / Who benefits:\n\n` +
      `${filled}\n\n` +
      `Rewrite each of the three sections to be sharper, more specific, and more actionable while keeping the user's intent. ` +
      `Add a concrete detail (a number, a named integration, a customer persona, or a measurable success criterion) where each section is vague. ` +
      `Keep each section concise (1–3 sentences). Then re-invoke the feature-request tool with product="${selectedProduct}", ` +
      `requirement set to "Problem: <new problem>\\n\\nDesired outcome: <new outcome>\\n\\nWho benefits: <new audience>", ` +
      `and keep any existing extraFields unchanged. Do not change other fields.`;
    try {
      await sendFollowUp(prompt);
    } catch (err) {
      console.error("Failed to send Sharpen request", err);
      setSharpening(false);
    }
  };

  const onTailor = async () => {
    if (!selectedProduct || !requirementText.trim()) return;
    setTailoring(true);
    const productName = PRODUCTS[selectedProduct].name;
    const prompt =
      `The user is in the Perforce Feature Request console for ${productName}. ` +
      `Their structured requirement is:\n\n${requirementText}\n\n` +
      `Generate 1 or 2 extra form fields that would gather useful additional signal about this specific request, ` +
      `then re-invoke the feature-request tool with product="${selectedProduct}", requirement set to the full structured text, ` +
      `and extraFields=[...]. ` +
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

  const llmHint = `Perforce Feature Request console. Step ${step + 1}/${STEPS.length} (${STEPS[step]}). Selected product: ${
    selectedProduct ?? "none"
  }. Requirement filled: P=${structured.problem.length > 30}, O=${structured.outcome.length > 30}, A=${
    structured.audience.length > 30
  }. Tailored fields: ${llmExtraFields.length}.`;

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-p4-300/30 bg-background text-foreground shadow-2xl shadow-p4-700/10`}
      data-llm={llmHint}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-0 bg-[linear-gradient(135deg,#f1ecff_0%,#e3d9ff_40%,#c4b3ff_100%)] bg-[length:200%_200%] animate-aurora dark:bg-[linear-gradient(135deg,#0a0420_0%,#1f006e_50%,#0a0420_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-p4-500 to-transparent" />

        <div className="relative z-10 flex min-h-[36rem] flex-col gap-5 p-6 md:p-7">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={perforceIconCircle}
                alt="Perforce"
                className="h-10 w-10 shrink-0"
                draggable={false}
              />
              <div>
                <h1 className="text-lg font-semibold leading-tight text-foreground">
                  Feature Request Console
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-assisted intake across the Perforce product portfolio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {product && (
                <div className="hidden items-center gap-2 rounded-full border border-p4-300/60 bg-card/80 px-3 py-1.5 backdrop-blur-sm sm:flex">
                  <img
                    src={product.iconSrc}
                    alt=""
                    className="h-4 w-4 object-contain"
                    draggable={false}
                  />
                  <span className="text-xs font-semibold text-foreground">{product.name}</span>
                </div>
              )}
              <img
                src={perforceWordmark}
                alt="Perforce"
                className="h-5 max-w-[140px] opacity-80 dark:opacity-0"
                draggable={false}
              />
            </div>
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
                product={product}
                value={structured}
                onChange={onChangeStructured}
                onSharpen={onSharpen}
                sharpening={sharpening}
              />
            </div>

            {/* Step 2: Tailored form */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-5 ${
                step === 2 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 2}
            >
              {product ? (
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
                <div className="text-center text-[11px] text-muted-foreground/80">
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
                <h3 className="text-base font-semibold text-foreground">Review & submit</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
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
