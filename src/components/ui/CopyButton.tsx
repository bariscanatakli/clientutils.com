"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Emil: Buttons must feel responsive.
 * - scale(0.97) on :active (handled by globals.css)
 * - Copied state uses opacity crossfade, not position change
 * - Specific transition properties, never `all`
 */
export function CopyButton({
  text,
  label = "Copy",
  className = "",
  size = "md",
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const sizeClasses =
    size === "sm" ? "px-2.5 py-1 text-xs gap-1" : "px-3 py-1.5 text-sm gap-1.5";

  return (
    <button
      onClick={() => copy(text)}
      className={`inline-flex items-center rounded-lg font-medium
                  ${sizeClasses}
                  ${className}`}
      style={{
        background: copied ? "var(--success)" : "var(--primary-soft)",
        color: copied ? "var(--success-foreground)" : "var(--primary)",
        transition:
          "background 200ms cubic-bezier(0.23,1,0.32,1), color 200ms cubic-bezier(0.23,1,0.32,1)",
      }}
      aria-label={copied ? "Copied!" : `Copy ${label}`}
    >
      {/* Icon crossfade — Emil: never animate from scale(0) */}
      <span className="relative h-3.5 w-3.5">
        {/* Check icon */}
        <svg
          className="absolute inset-0 h-3.5 w-3.5"
          style={{
            opacity: copied ? 1 : 0,
            transform: copied ? "scale(1)" : "scale(0.8)",
            transition:
              "opacity 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {/* Clipboard icon */}
        <svg
          className="absolute inset-0 h-3.5 w-3.5"
          style={{
            opacity: copied ? 0 : 1,
            transform: copied ? "scale(0.8)" : "scale(1)",
            transition:
              "opacity 150ms cubic-bezier(0.23,1,0.32,1), transform 150ms cubic-bezier(0.23,1,0.32,1)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
          />
        </svg>
      </span>
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}
