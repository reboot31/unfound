import { cn } from "@/lib/utils";

/**
 * The mark: "un" recedes, "found" holds. Set in the same geometric
 * lowercase as the logo, in live text so it stays sharp anywhere.
 * Inherits colour, so it works on paper and on ink.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mark font-medium lowercase tracking-[-0.035em] select-none",
        className,
      )}
      aria-label="Unfound"
    >
      <span aria-hidden className="opacity-30">
        un
      </span>
      <span aria-hidden>found</span>
    </span>
  );
}
