import { useState } from "react";
import { useOpenExternal } from "skybridge/web";
import { ArrowUpRight, Send } from "lucide-react";

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
      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-p4-700 via-p4-500 to-p4-400 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-p4-500/30 transition-all hover:shadow-xl hover:shadow-p4-500/50 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow"
    >
      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      {sending ? (
        <>
          <ArrowUpRight className="h-4 w-4 animate-pulse" /> Opening submit page…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Submit feature request
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      )}
    </button>
  );
}
