import { useState } from "react";
import { Sparkles, MousePointer2, Inbox } from "lucide-react";
import { PRODUCTS, PRODUCT_IDS, type ProductId } from "@/products.js";
import ProductTile from "./product-tile.js";

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
                <Sparkles className="h-3.5 w-3.5 text-p4-500" />
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
        className={`relative flex min-h-24 items-center justify-center rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          over
            ? "border-p4-500 bg-p4-50/70 dark:bg-p4-700/20 scale-[1.01]"
            : selectedProduct
              ? "border-p4-300/70 bg-card/60"
              : "border-border bg-muted/40"
        }`}
        data-llm={`drop zone. selected product: ${selectedProduct?.name ?? "none"}`}
      >
        {dragging && !selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-p4-200/40 to-transparent animate-shimmer bg-[length:200%_100%]" />
        )}
        {selectedProduct ? (
          <div className="relative flex w-full max-w-md items-center gap-4 px-4 py-3 animate-fade-in">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white animate-float"
              style={{
                background: `linear-gradient(135deg, ${selectedProduct.accent}, ${selectedProduct.accent}cc)`,
                boxShadow: `0 12px 28px -8px ${selectedProduct.accent}80`,
              }}
            >
              {selectedProduct.monogram}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {selectedProduct.name}
                </span>
                <span className="rounded-full bg-p4-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-p4-700 dark:bg-p4-700/40 dark:text-p4-100">
                  Selected
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selectedProduct.tagline}
              </p>
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
