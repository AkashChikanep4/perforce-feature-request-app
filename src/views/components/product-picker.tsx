import { useState } from "react";
import { Sparkles, MousePointer2, Inbox } from "lucide-react";
import { PRODUCT_IDS, type ProductId } from "@/products.js";
import { PRODUCT_VIEWS } from "../product-assets.js";
import ProductTile from "./product-tile.js";

const PRODUCTS = PRODUCT_VIEWS;

interface Props {
  selected: ProductId | null;
  autoDetected: ProductId | null;
  onSelect: (id: ProductId) => void;
}

export default function ProductPicker({ selected, autoDetected, onSelect }: Props) {
  const [dragging, setDragging] = useState<ProductId | null>(null);
  const [over, setOver] = useState(false);

  const selectedProduct = selected ? PRODUCTS[selected] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Pick your product</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {autoDetected ? (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-p4-700" />
                Auto-detected{" "}
                <span className="font-medium text-foreground">
                  {PRODUCTS[autoDetected].name}
                </span>{" "}
                — drag a different tile to override.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <MousePointer2 className="h-3.5 w-3.5" />
                Drag a tile into the drop zone, or just click one.
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {PRODUCT_IDS.map((id) => (
          <ProductTile
            key={id}
            product={PRODUCTS[id]}
            selected={selected === id}
            onClick={() => onSelect(id)}
            onDragStart={(e) => {
              setDragging(id);
              e.dataTransfer.setData("text/plain", id);
              e.dataTransfer.effectAllowed = "copy";
            }}
            onDragEnd={() => {
              setDragging(null);
              setOver(false);
            }}
          />
        ))}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const id = e.dataTransfer.getData("text/plain") as ProductId;
          if (PRODUCT_IDS.includes(id)) {
            onSelect(id);
          }
        }}
        className={`relative flex min-h-28 items-center justify-center rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          over
            ? "border-p4-700 bg-p4-50/80 dark:bg-p4-800/30 scale-[1.01]"
            : selectedProduct
              ? "border-p4-300 bg-card"
              : "border-border bg-muted/40"
        }`}
        data-llm={`drop zone. selected product: ${selectedProduct?.name ?? "none"}`}
      >
        {dragging && !selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-p4-200/40 to-transparent animate-shimmer bg-[length:200%_100%]" />
        )}
        {selectedProduct ? (
          <div className="relative flex w-full max-w-md items-center gap-5 px-5 py-3 animate-fade-in">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-p4-500/20 animate-float">
              <img
                src={selectedProduct.iconSrc}
                alt=""
                className="h-11 w-11 object-contain"
                draggable={false}
              />
            </div>
            <div className="min-w-0 flex-1">
              <img
                src={selectedProduct.wordmarkSrc}
                alt={selectedProduct.name}
                className="h-5 max-w-full object-contain object-left mb-1"
                draggable={false}
              />
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-p4-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-p4-700 dark:bg-p4-800/40 dark:text-p4-100">
                  Selected
                </span>
                <span className="text-xs text-muted-foreground">{selectedProduct.tagline}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Inbox className="h-5 w-5" />
            <span className="text-sm">Drop a product tile here</span>
          </div>
        )}
      </div>
    </div>
  );
}
