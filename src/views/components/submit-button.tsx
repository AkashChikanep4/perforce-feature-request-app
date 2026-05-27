import { useState } from "react";
import { useOpenExternal } from "skybridge/web";
import { ArrowUpRight } from "lucide-react";
import perforceMarkWhite from "@/views/assets/brand/logo-perforce-icon-circle-white.svg";

const SUBMIT_BASE = "http://localhost:3001/submit-request";

interface Props {
  prompt: string;
  disabled?: boolean;
}

export default function SubmitButton({ prompt, disabled }: Props) {
  const openExternal = useOpenExternal();
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (disabled || sending) return;
    setSending(true);
    const url = `${SUBMIT_BASE}?prompt=${encodeURIComponent(prompt)}`;
    try {
      await openExternal(url);
    } catch (err) {
      console.error("Failed to open submit URL", err);
    } finally {
      setTimeout(() => setSending(false), 800);
    }
  };

  return (
    <button
      type="button"
      onClick={submit}
      disabled={disabled || sending}
      className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-p4-900 via-p4-700 to-p4-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-p4-700/40 transition-all hover:shadow-xl hover:shadow-p4-700/60 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow"
    >
      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
        <img src={perforceMarkWhite} alt="" className="h-5 w-5" draggable={false} />
      </span>
      <span className="relative">
        {sending ? "Opening submit page…" : "Submit feature request to Perforce"}
      </span>
      <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}
