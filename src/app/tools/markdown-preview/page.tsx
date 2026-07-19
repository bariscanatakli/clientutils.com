import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { MarkdownPreviewClient } from "./MarkdownPreviewClient";

export const metadata: Metadata = buildPageMeta({
  title: "Markdown Preview & Editor",
  description:
    "Write and edit Markdown files with a live HTML preview. Supports GitHub Flavored Markdown (GFM) including tables, code blocks, and strikethroughs.",
  path: "/tools/markdown-preview",
});

export default function MarkdownPreviewPage() {
  return (
    <>
      <MarkdownPreviewClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is Markdown?</h2>
        <p className="text-muted leading-relaxed mb-6">
          Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. Created by John Gruber in 2004, Markdown is now one of the world’s most popular markup languages. 
          It is the standard for formatting `README.md` files on GitHub, writing documentation, and authoring blog posts.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">GitHub Flavored Markdown (GFM)</h3>
        <p className="text-muted leading-relaxed mb-6">
          Our editor supports GitHub Flavored Markdown, which extends standard Markdown with several highly requested features:
        </p>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Tables:</strong> Easily create grid layouts using pipes <code>|</code> and hyphens <code>-</code>.</li>
          <li><strong>Task Lists:</strong> Create interactive checklists using <code>[ ]</code> and <code>[x]</code>.</li>
          <li><strong>Strikethrough:</strong> Cross out text using double tildes <code>~~like this~~</code>.</li>
          <li><strong>Auto-linking:</strong> Standard URLs automatically become clickable links without needing angle brackets.</li>
        </ul>
      </div>
    </>
  );
}
