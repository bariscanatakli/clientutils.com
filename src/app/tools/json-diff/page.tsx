import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { JsonDiffClient } from "./JsonDiffClient";

export const metadata: Metadata = buildPageMeta({
  title: "JSON Compare & Diff Tool",
  description:
    "Compare two JSON objects and find structural differences instantly. Ignores spaces and formatting. See additions, removals, and changes highlighted.",
  path: "/tools/json-diff",
});

export default function JsonDiffPage() {
  return (
    <>
      <JsonDiffClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why use a dedicated JSON Diff Tool?</h2>
        <p className="text-muted leading-relaxed mb-6">
          Comparing JSON using standard text-based diff tools (like `git diff`) often results in noisy outputs. 
          A standard diff tool flags differences in spacing, indentation, and trailing commas as errors.
          Our JSON Compare tool parses the text into actual JavaScript objects first, meaning it only highlights true data differences—ignoring trivial formatting changes.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Common Use Cases</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>API Debugging:</strong> Compare the payload of a successful API request with a failed one to spot missing fields or changed data types.</li>
          <li><strong>Configuration Changes:</strong> Check what changed between `package.json` or `tsconfig.json` files.</li>
          <li><strong>State Management:</strong> In React/Redux applications, comparing previous state objects to current state objects can reveal unintended mutations.</li>
        </ul>
      </div>
    </>
  );
}
