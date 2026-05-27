import { Check } from "lucide-react";
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
      className={`group relative flex w-full flex-col items-center gap-2.5 rounded-2xl border bg-card px-3 py-4 text-center transition-all cursor-grab active:cursor-grabbing ${
        selected
          ? "border-p4-700 ring-2 ring-p4-500/60 shadow-[0_12px_30px_-12px_rgba(76,0,255,0.5)]"
          : "border-border hover:border-p4-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-p4-500/10"
      }`}
      data-llm={`product tile: ${product.name}${selected ? " (selected)" : ""}`}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-p4-700 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-inner shadow-p4-500/5 ring-1 ring-p4-500/10">
        <img
          src={product.iconSrc}
          alt=""
          className="h-10 w-10 object-contain"
          draggable={false}
        />
      </span>
      <span className="flex flex-col items-center gap-0.5">
        <span className="block truncate text-xs font-semibold text-foreground">
          {product.name}
        </span>
        <span className="block truncate text-[10px] leading-tight text-muted-foreground">
          {product.tagline}
        </span>
      </span>
    </button>
  );
}
