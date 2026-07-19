import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { HexConverterClient } from "./HexConverterClient";

export const metadata: Metadata = buildPageMeta({
  title: "Hex / ASCII / Binary / Octal / Decimal Converter",
  description:
    "Instantly convert strings between text, hexadecimal, binary, octal, and decimal representations. Features an interactive, real-time sync grid.",
  path: "/tools/hex-converter",
});

export default function HexConverterPage() {
  return (
    <>
      <HexConverterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Number Bases Explained</h2>
        <p className="text-muted leading-relaxed mb-6">
          Computers operate entirely on binary (1s and 0s), but binary strings are long and difficult for humans to read. 
          To solve this, computer scientists group binary numbers into larger bases like Hexadecimal (Base-16) or Octal (Base-8). 
          This tool lets you instantly translate data between the human-readable text format (ASCII/UTF-8) and machine-readable number bases.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border border-border bg-card rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-2 mt-0">Hexadecimal (Base-16)</h3>
            <p className="text-muted text-xs leading-relaxed m-0">
              Uses digits 0-9 and letters A-F. A single hex digit represents exactly 4 bits (a nibble). Two hex digits make one Byte. Extremely common in cryptography, color codes, and memory addresses.
            </p>
          </div>
          <div className="p-4 border border-border bg-card rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-2 mt-0">Binary (Base-2)</h3>
            <p className="text-muted text-xs leading-relaxed m-0">
              Uses only 0 and 1. The fundamental language of CPUs. Each digit represents a single bit of data.
            </p>
          </div>
          <div className="p-4 border border-border bg-card rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-2 mt-0">Octal (Base-8)</h3>
            <p className="text-muted text-xs leading-relaxed m-0">
              Uses digits 0-7. Commonly used in Unix file permissions (e.g., <code>chmod 777</code>).
            </p>
          </div>
          <div className="p-4 border border-border bg-card rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-2 mt-0">Decimal (Base-10)</h3>
            <p className="text-muted text-xs leading-relaxed m-0">
              The standard numbering system used by humans. Uses digits 0-9. Represents the exact numeric value of the ASCII character.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
