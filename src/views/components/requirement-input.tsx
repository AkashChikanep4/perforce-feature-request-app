import { useEffect, useRef } from "react";
import { Pencil } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  productName: string | null;
}

const MAX = 800;

export default function RequirementInput({ value, onChange, productName }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const placeholder = productName
    ? `Describe what you want from ${productName}. E.g. "Add SAML SSO so customers can log in with Okta."`
    : `Describe the feature you'd like. E.g. "Add SAML SSO support to the console."`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Pencil className="h-4 w-4 text-p4-500" /> Tell us what you want
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        ref={ref}
        value={value}
        maxLength={MAX}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="resize-none rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm backdrop-blur-sm transition-all focus:border-p4-500 focus:outline-none focus:ring-4 focus:ring-p4-300/40"
      />
      <p className="text-xs text-muted-foreground">
        The clearer this is, the better the AI-tailored form fields will be.
      </p>
    </div>
  );
}
