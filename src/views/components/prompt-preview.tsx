import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";

interface Props {
  prompt: string;
}

export default function PromptPreview({ prompt }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl border border-p4-200/70 bg-gradient-to-br from-p4-50/80 to-card/80 p-4 backdrop-blur-sm dark:border-p4-700/40 dark:from-p4-800/40 dark:to-card/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-p4-600" />
          <h4 className="text-sm font-semibold text-foreground">Final request</h4>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-p4-300/60 bg-card px-2.5 py-1 text-xs font-medium text-p4-700 transition-colors hover:bg-p4-50 dark:text-p4-100 dark:hover:bg-p4-700/40"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-border/50 bg-background/80 p-3 font-mono text-[11.5px] leading-relaxed text-foreground">
        {prompt}
      </pre>
    </div>
  );
}
