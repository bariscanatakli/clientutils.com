import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { JsonFormatterClient } from "./JsonFormatterClient";

export const metadata: Metadata = buildPageMeta({
  title: "JSON Formatter & Validator",
  description:
    "Format, beautify, minify and validate JSON online. Features interactive tree view, precise error line highlighting, and client-side processing for privacy.",
  path: "/tools/json-formatter",
});

export default function JsonFormatterPage() {
  return (
    <>
      <JsonFormatterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why use our JSON Formatter?</h2>
        <p className="text-muted leading-relaxed mb-6">
          JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. 
          However, raw JSON data often lacks formatting and indentation, making it difficult to analyze.
        </p>

        <ul className="space-y-3 text-muted list-none pl-0">
          <li>
            <strong className="text-foreground">100% Client-Side Privacy:</strong> 
            Unlike many online tools, our formatter never sends your JSON data to a server. All formatting, validation, and tree generation happens directly in your browser. This is essential when handling API keys, tokens, or PII.
          </li>
          <li>
            <strong className="text-foreground">Precise Error Highlighting:</strong> 
            If your JSON is invalid (missing a comma, unquoted string), the exact line is highlighted in red, allowing you to quickly spot and fix the syntax error.
          </li>
          <li>
            <strong className="text-foreground">Interactive Tree View:</strong> 
            Instead of staring at a massive wall of text, switch to the Tree View to collapse/expand objects and arrays. It also color-codes values (strings, numbers, booleans) for rapid visual parsing.
          </li>
        </ul>
      </div>
    </>
  );
}
