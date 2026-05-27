import { Check, GripVertical } from "lucide-react";
import type { ProductView } from "../product-assets.js";

interface Props {
  product: ProductView;
  selected?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLButtonElement>) => void;
}

export default function ProductTile({
  product,
  selected,
  onClick,
  onDragStart,
  onDragEnd,
}: Props) {
  return (
    <button
      type="button"
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group relative flex w-full items-center gap-3 rounded-2xl border bg-card px-3 py-3 text-left transition-all cursor-grab active:cursor-grabbing ${
        selected
          ? "border-p4-700 ring-2 ring-p4-500 shadow-[0_10px_30px_-12px_rgba(76,0,255,0.55)]"
          : "border-border hover:border-p4-400 hover:-translate-y-0.5 hover:shadow-md hover:shadow-p4-500/10"
      }`}
      data-llm={`product tile: ${product.name}${selected ? " (selected)" : ""}`}
      style={selected ? { background: `linear-gradient(135deg, ${product.tint}, transparent)` } : undefined}
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(76, 0, 255, 0.08)",
        }}
        aria-hidden
      >
        <img
          src={product.iconSrc}
          alt=""
          className="h-9 w-9 object-contain"
          draggable={false}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {product.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {product.tagline}
        </span>
      </span>
      {selected ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-p4-700 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      ) : (
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-p4-500" />
      )}
    </button>
  );
}
