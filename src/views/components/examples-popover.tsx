import { useState } from "react";
import { BookOpen, X, ArrowRight } from "lucide-react";
import type { ProductView } from "../product-assets.js";

interface Props {
  product: ProductView;
  onUse: (example: ProductView["examples"][number]) => void;
}

export default function ExamplesPopover({ product, onUse }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-full text-xs font-medium text-p4-700 hover:underline dark:text-p4-200"
      >
        <BookOpen className="h-3.5 w-3.5" /> See examples
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-p4-700" />
                Example {product.name} feature requests
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-4">
                {product.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-p4-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-semibold text-foreground">{ex.title}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          onUse(ex);
                          setOpen(false);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-p4-300/70 bg-p4-50 px-2.5 py-1 text-[11px] font-medium text-p4-700 transition-colors hover:bg-p4-100 dark:bg-p4-800/40 dark:text-p4-100 dark:hover:bg-p4-700/50"
                      >
                        Use this <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                    <dl className="mt-3 grid gap-2 text-xs">
                      <div>
                        <dt className="font-medium text-muted-foreground">Problem</dt>
                        <dd className="mt-0.5 text-foreground">{ex.problem}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Outcome</dt>
                        <dd className="mt-0.5 text-foreground">{ex.outcome}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Audience</dt>
                        <dd className="mt-0.5 text-foreground">{ex.audience}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
