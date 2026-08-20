import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { HtmlEncodeClient } from "./HtmlEncodeClient";

export const metadata: Metadata = buildPageMeta({
  title: "HTML Entity Encoder / Decoder",
  description:
    "Securely encode special characters into HTML entities to prevent XSS attacks, or decode HTML entities back to their original characters.",
  path: "/tools/html-encode",
});

export default function HtmlEncodePage() {
  return (
    <>
      <HtmlEncodeClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why Encode HTML?</h2>
        <p className="text-muted leading-relaxed mb-6">
          When displaying user-generated content on a website, special characters like <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>, and <code>&quot;</code> have specific meanings in HTML. 
          If a user submits text containing a <code>{"<script>"}</code> tag, the browser might accidentally execute it, leading to Cross-Site Scripting (XSS) vulnerabilities.
          Encoding converts these dangerous characters into safe &quot;entities&quot; (like <code>&amp;lt;script&amp;gt;</code>), ensuring the browser displays the text visually without executing it as code.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Common Entities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-foreground">Character</th>
                <th className="py-2 text-foreground">Entity Name</th>
                <th className="py-2 text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-b border-border/50">
                <td className="py-2"><code>&lt;</code></td>
                <td className="py-2"><code>&amp;lt;</code></td>
                <td className="py-2">Less than</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2"><code>&gt;</code></td>
                <td className="py-2"><code>&amp;gt;</code></td>
                <td className="py-2">Greater than</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2"><code>&amp;</code></td>
                <td className="py-2"><code>&amp;amp;</code></td>
                <td className="py-2">Ampersand</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2"><code>&quot;</code></td>
                <td className="py-2"><code>&amp;quot;</code></td>
                <td className="py-2">Double quote</td>
              </tr>
              <tr>
                <td className="py-2"><code>&apos;</code></td>
                <td className="py-2"><code>&amp;#39;</code></td>
                <td className="py-2">Single quote (Apostrophe)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
