import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { UuidGeneratorClient } from "./UuidGeneratorClient";

export const metadata: Metadata = buildPageMeta({
  title: "UUID / ULID Generator",
  description:
    "Generate UUID v1, v4, v7 and ULID identifiers instantly. Bulk generate up to 100 IDs at once. Free, client-side, no data sent to servers.",
  path: "/tools/uuid-generator",
});

export default function UuidGeneratorPage() {
  return (
    <>
      <UuidGeneratorClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-4xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a UUID?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems. 
          When generated according to the standard methods, UUIDs are for practical purposes unique. 
          Their uniqueness does not depend on a central registration authority or coordination between the parties generating them.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">UUID Versions</h3>
        <ul className="space-y-3 text-muted list-none pl-0">
          <li>
            <strong className="text-foreground">UUID v4 (Random):</strong> 
            The most common version. It is generated using random or pseudo-random numbers. Extremely low probability of collision.
          </li>
          <li>
            <strong className="text-foreground">UUID v1 (Time-based):</strong> 
            Generated using a combination of the computer's MAC address and the current time. Useful if you need to know exactly when and where the UUID was generated.
          </li>
          <li>
            <strong className="text-foreground">UUID v7 (Time-ordered):</strong> 
            A newer standard that combines a Unix timestamp with random data. This makes UUIDs sortable by creation time, which is highly beneficial for database performance (especially as primary keys).
          </li>
        </ul>

        <h3 className="text-md font-semibold text-foreground mt-6 mb-3">What is a ULID?</h3>
        <p className="text-muted leading-relaxed mb-6">
          A Universally Unique Lexicographically Sortable Identifier (ULID) is an alternative to UUID. 
          It is 26 characters long (compared to 36 for UUID), uses Crockford's Base32 alphabet (no ambiguous characters like I, L, O, U), 
          and is lexicographically sortable by time. It provides 1.21e+24 unique ULIDs per millisecond.
        </p>
      </div>
    </>
  );
}
