import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@alpic-ai/ui/components/tooltip";

export default function Progress({
  steps,
  current,
  onSelect,
}: {
  steps: readonly string[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {steps.map((label, i) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => onSelect(i)}
              className={`relative h-1.5 flex-1 rounded-full transition-all before:absolute before:-inset-y-5 before:inset-x-0 before:content-[''] [@media(hover:hover)]:hover:opacity-80 ${
                i < current
                  ? "bg-p4-500"
                  : i === current
                    ? "bg-gradient-to-r from-p4-500 to-p4-300 shadow-[0_0_10px_rgba(123,77,181,0.6)]"
                    : "bg-muted"
              }`}
              aria-label={label}
            />
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
