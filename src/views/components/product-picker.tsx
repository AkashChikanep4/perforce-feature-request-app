import { useState } from "react";
import { Sparkles } from "lucide-react";
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
  const [over, setOver] = useState(false);

  const selectedProduct = selected ? PRODUCTS[selected] : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Which product is this for?
        </h2>
        {autoDetected && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-p4-700" />
            We picked{" "}
            <span className="font-medium text-foreground">
              {PRODUCTS[autoDetected].name}
            </span>{" "}
            from your message — click any other tile to change it.
          </p>
        )}
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
          if (PRODUCT_IDS.includes(id)) onSelect(id);
        }}
        className={`grid grid-cols-2 gap-3 rounded-2xl p-2 transition-colors sm:grid-cols-3 lg:grid-cols-5 ${
          over ? "bg-p4-100/60 dark:bg-p4-800/30" : ""
        }`}
      >
        {PRODUCT_IDS.map((id) => (
          <ProductTile
            key={id}
            product={PRODUCTS[id]}
            selected={selected === id}
            onClick={() => onSelect(id)}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", id);
              e.dataTransfer.effectAllowed = "copy";
            }}
            onDragEnd={() => setOver(false)}
          />
        ))}
      </div>

      {selectedProduct && (
        <div className="flex items-center gap-3 rounded-xl border border-p4-200 bg-p4-50/60 px-4 py-2.5 dark:border-p4-700/40 dark:bg-p4-800/20">
          <img
            src={selectedProduct.wordmarkSrc}
            alt={selectedProduct.name}
            className="h-5 max-w-[180px] object-contain object-left"
            draggable={false}
          />
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{selectedProduct.tagline}</span>
        </div>
      )}
    </div>
  );
}
