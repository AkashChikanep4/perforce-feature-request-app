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

import perforceIconCircle from "./assets/brand/logo-perforce-icon-circle-indigo.svg";

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

const PRODUCTS = PRODUCT_VIEWS;
const STEPS = ["Product", "Describe", "Submit"] as const;

type ViewState = {
  step: number;
  userProduct: ProductId | null;
  oneLiner: string | null;
  structured: StructuredRequirement | null;
  formValues: Record<string, string | number>;
  [key: string]: unknown;
};

const initialState: ViewState = {
  step: 0,
  userProduct: null,
  oneLiner: null,
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
  const userOneLiner = (state.oneLiner ?? null) as string | null;
  const structuredFromState = (state.structured ?? null) as StructuredRequirement | null;
  const formValues = (state.formValues ?? {}) as Record<string, string | number>;

  const autoDetected = (input?.product ?? null) as ProductId | null;
  const llmRequirement = input?.requirement ?? "";
  const llmExtraFields = (output?.extraFields ?? []) as FormField[];

  const selectedProduct: ProductId | null = userProduct ?? autoDetected;
  const product = selectedProduct ? PRODUCTS[selectedProduct] : null;

  const oneLiner = userOneLiner ?? llmRequirement.split("\n")[0]?.slice(0, 140) ?? "";
  const structured: StructuredRequirement = structuredFromState ?? {
    problem: llmRequirement.includes("\n") ? llmRequirement : "",
    outcome: "",
    audience: "",
  };

  const requirementText = useMemo(
    () => composeRequirementText(oneLiner, structured),
    [oneLiner, structured],
  );

  const tailoredCount = llmExtraFields.length;

  const [tailoring, setTailoring] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const prevExtras = useRef(tailoredCount);
  useEffect(() => {
    if (tailoring && tailoredCount > prevExtras.current) {
      setTailoring(false);
    }
    prevExtras.current = tailoredCount;
  }, [tailoredCount, tailoring]);

  const prevReq = useRef(requirementText);
  useEffect(() => {
    if (drafting && requirementText !== prevReq.current) {
      setDrafting(false);
    }
    prevReq.current = requirementText;
  }, [requirementText, drafting]);

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

  const onOneLinerChange = (v: string) =>
    setState((p) => ({ ...p, oneLiner: v }));

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

  const onDraft = async () => {
    if (!selectedProduct || !oneLiner.trim()) return;
    setDrafting(true);
    const productName = PRODUCTS[selectedProduct].name;
    const prompt =
      `The user is in the Perforce Feature Request console for ${productName}. ` +
      `Their one-line idea is: "${oneLiner.trim()}".\n\n` +
      `Do two things in a single re-invocation of the feature-request tool:\n` +
      `1. Expand the one-liner into three concise sections (Problem / Desired outcome / Who benefits — each 1–3 sentences, concrete and specific). Compose them into the requirement field as:\n` +
      `   "Headline: <one-liner>\\n\\nProblem: <expanded problem>\\n\\nDesired outcome: <expanded outcome>\\n\\nWho benefits: <expanded audience>".\n` +
      `2. Generate 1–2 extra form fields tailored to the idea (sliders with realistic min/max/default/unit, OR dropdowns with 3–6 concrete options). Pick fields that complement the base fields (priority, effort_estimate, component). Use kebab-case keys. Skip if the idea is too generic.\n\n` +
      `Then re-invoke the feature-request tool with product="${selectedProduct}", the composed requirement string, and extraFields=[...].`;
    try {
      await sendFollowUp(prompt);
    } catch (err) {
      console.error("Failed to send Draft request", err);
      setDrafting(false);
    }
  };

  const onTailorFields = async () => {
    if (!selectedProduct || !oneLiner.trim()) return;
    setTailoring(true);
    const productName = PRODUCTS[selectedProduct].name;
    const prompt =
      `The user is in the Perforce Feature Request console for ${productName}. ` +
      `Their idea: "${oneLiner.trim()}".\n\n` +
      `Generate 1–2 extra form fields (sliders or dropdowns) that gather useful extra signal about this specific request. ` +
      `Sliders need realistic min/max/default/unit; dropdowns need 3–6 concrete option strings. Use kebab-case for keys. ` +
      `Then re-invoke the feature-request tool with product="${selectedProduct}", requirement=${JSON.stringify(
        requirementText,
      )}, and extraFields=[...]. Replace existing extraFields entirely.`;
    try {
      await sendFollowUp(prompt);
    } catch (err) {
      console.error("Failed to send Tailor request", err);
      setTailoring(false);
    }
  };

  const canAdvance =
    (step === 0 && !!selectedProduct) ||
    (step === 1 && oneLiner.trim().length > 0) ||
    step === 2;

  const setStep = (s: number) => setState((p) => ({ ...p, step: s }));

  const llmHint = `Perforce Feature Request console. Step ${step + 1}/${STEPS.length} (${STEPS[step]}). Product: ${
    selectedProduct ?? "none"
  }. One-liner: "${oneLiner || "(empty)"}". Tailored fields: ${tailoredCount}.`;

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-p4-300/30 bg-background text-foreground shadow-xl shadow-p4-700/10`}
      data-llm={llmHint}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-0 bg-[linear-gradient(135deg,#f1ecff_0%,#e3d9ff_50%,#c4b3ff_100%)] bg-[length:200%_200%] animate-aurora dark:bg-[linear-gradient(135deg,#0a0420_0%,#1f006e_50%,#0a0420_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-p4-500 to-transparent" />

        <div className="relative z-10 flex flex-col gap-3 p-4">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={perforceIconCircle}
                alt="Perforce"
                className="h-7 w-7 shrink-0"
                draggable={false}
              />
              <h1 className="text-sm font-semibold leading-tight text-foreground">
                Perforce Feature Request
              </h1>
            </div>
            {product && (
              <div className="flex items-center gap-1.5 rounded-full border border-p4-300/60 bg-card/80 px-2.5 py-1 text-xs backdrop-blur-sm">
                <img
                  src={product.iconSrc}
                  alt=""
                  className="h-3.5 w-3.5 object-contain"
                  draggable={false}
                />
                <span className="font-semibold text-foreground">{product.name}</span>
              </div>
            )}
          </header>

          <Progress steps={STEPS} current={step} onSelect={setStep} />

          <div className="grid">
            {/* Step 0: Product picker */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-3 ${
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

            {/* Step 1: Describe + tailor (combined) */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-4 ${
                step === 1 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 1}
            >
              <RequirementInput
                product={product}
                oneLiner={oneLiner}
                onOneLinerChange={onOneLinerChange}
                value={structured}
                onChange={onChangeStructured}
                onSharpen={onDraft}
                sharpening={drafting}
              />
              {product && (
                <DynamicForm
                  baseFields={baseFields}
                  extraFields={llmExtraFields}
                  values={formValues}
                  onChange={onChangeFormValue}
                  onTailor={onTailorFields}
                  isTailoring={tailoring}
                  canTailor={oneLiner.trim().length > 0}
                />
              )}
            </div>

            {/* Step 2: Submit */}
            <div
              className={`col-start-1 row-start-1 flex flex-col gap-3 ${
                step === 2 ? "animate-fade-in" : "invisible pointer-events-none"
              }`}
              aria-hidden={step !== 2}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Review & submit</h3>
                <span className="text-[10px] text-muted-foreground">
                  Sends to{" "}
                  <code className="rounded bg-muted px-1 py-px font-mono text-[10px]">
                    localhost:3001/submit-request
                  </code>
                </span>
              </div>
              <PromptPreview prompt={finalPrompt} />
              <SubmitButton
                prompt={finalPrompt}
                disabled={!selectedProduct || !oneLiner.trim()}
              />
            </div>
          </div>

          <Nav
            current={step}
            total={STEPS.length}
            onChange={setStep}
            canAdvance={canAdvance}
            nextLabel={step === 1 ? "Review" : "Next"}
          />
        </div>
      </div>
    </div>
  );
}
