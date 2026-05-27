import { Check, GripVertical } from "lucide-react";
import type { ProductDef } from "@/products.js";

interface Props {
  product: ProductDef;
  selected?: boolean;
  hostHighlight?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void;
  compact?: boolean;
}

export default function ProductTile({
  product,
  selected,
  hostHighlight,
  onClick,
  onDragStart,
  onDragEnd,
  compact,
}: Props) {
  return (
    <button
      type="button"
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative flex w-full items-center gap-3 rounded-xl border bg-card/90 px-3 py-2.5 text-left transition-all cursor-grab active:cursor-grabbing backdrop-blur-sm ${
        selected
          ? "border-p4-500 ring-2 ring-p4-400 shadow-[0_8px_30px_-12px_rgba(78,42,132,0.55)]"
          : hostHighlight
            ? "border-p4-300/60 hover:border-p4-400"
            : "border-border/70 hover:border-p4-300 hover:-translate-y-0.5"
      } ${compact ? "py-2" : ""}`}
      data-llm={`product tile: ${product.name}${selected ? " (selected)" : ""}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold tracking-tight"
        style={{
          background: `linear-gradient(135deg, ${product.accent}, ${product.accentSoft})`,
          color: "#fff",
          boxShadow: `inset 0 0 0 1px ${product.accentSoft}`,
        }}
        aria-hidden
      >
        {product.monogram}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {product.name}
        </span>
        {!compact && (
          <span className="block truncate text-xs text-muted-foreground">
            {product.tagline}
          </span>
        )}
      </span>
      {selected ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-p4-500 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      ) : (
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-p4-500" />
      )}
    </button>
  );
}
