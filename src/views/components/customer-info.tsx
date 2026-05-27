import { User, Mail } from "lucide-react";

export interface CustomerDetails {
  name: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isCustomerValid(c: CustomerDetails): boolean {
  return c.name.trim().length >= 2 && EMAIL_RE.test(c.email.trim());
}

interface Props {
  value: CustomerDetails;
  onChange: (next: CustomerDetails) => void;
}

export default function CustomerInfo({ value, onChange }: Props) {
  const nameOk = value.name.trim().length >= 2;
  const emailOk = EMAIL_RE.test(value.email.trim());
  const emailDirty = value.email.length > 0;

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Your details</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          We'll attach these to the request so Product can follow up.
        </p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Field
          icon={<User className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Full name"
          value={value.name}
          placeholder="e.g. Jane Smith"
          onChange={(v) => onChange({ ...value, name: v })}
          valid={nameOk || value.name.length === 0}
          autoComplete="name"
        />
        <Field
          icon={<Mail className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Work email"
          value={value.email}
          placeholder="you@perforce.com"
          onChange={(v) => onChange({ ...value, email: v })}
          valid={emailOk || !emailDirty}
          type="email"
          autoComplete="email"
        />
      </div>
    </div>
  );
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  valid: boolean;
  type?: string;
  autoComplete?: string;
}

function Field({
  icon,
  label,
  value,
  placeholder,
  onChange,
  valid,
  type = "text",
  autoComplete,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border bg-background py-2 pl-8 pr-3 text-sm text-foreground transition-all focus:outline-none focus:ring-4 ${
            valid
              ? "border-border focus:border-p4-700 focus:ring-p4-300/40"
              : "border-red-300 focus:border-red-500 focus:ring-red-200/40"
          }`}
        />
      </span>
    </label>
  );
}
