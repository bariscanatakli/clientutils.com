import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { JsonEscapeClient } from "./JsonEscapeClient";

export const metadata: Metadata = buildPageMeta({
  title: "JSON Escape & Unescape Tool",
  description:
    "Safely escape JSON strings to embed them inside other JSON objects or code blocks. Convert escaped strings back to readable JSON instantly.",
  path: "/tools/json-escape",
});

export default function JsonEscapePage() {
  return (
    <>
      <JsonEscapeClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why Escape JSON?</h2>
        <p className="text-muted leading-relaxed mb-6">
          Escaping JSON is necessary when you want to store a JSON object as a string value inside another JSON object, or when you need to pass a JSON string as a command-line argument (like in a cURL payload).
          Without proper escaping, the quotes (`"`) inside your nested JSON will break the structure of the parent JSON, resulting in a syntax error.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">What characters get escaped?</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Quotes:</strong> <code>"</code> becomes <code>\\"</code></li>
          <li><strong>Backslashes:</strong> <code>\</code> becomes <code>\\\\</code></li>
          <li><strong>Newlines:</strong> Hard line breaks become <code>\\n</code></li>
          <li><strong>Tabs:</strong> Tab spaces become <code>\\t</code></li>
        </ul>
      </div>
    </>
  );
}
