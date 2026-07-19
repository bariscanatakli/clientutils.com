import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { WordCounterClient } from "./WordCounterClient";

export const metadata: Metadata = buildPageMeta({
  title: "Word & Character Counter",
  description:
    "Count words, characters, lines, and paragraphs instantly. Check your text length limits for Twitter, SEO meta tags, and essays.",
  path: "/tools/word-counter",
});

export default function WordCounterPage() {
  return (
    <>
      <WordCounterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why use a Word Counter?</h2>
        <p className="text-muted leading-relaxed mb-6">
          Whether you are writing an essay, crafting the perfect tweet, or optimizing SEO meta descriptions, knowing the exact length of your text is crucial.
          Our word counter provides instant, offline-first analysis of your content without sending any of your sensitive text to a server.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Common Character Limits</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Twitter (X):</strong> 280 characters</li>
          <li><strong>SEO Title Tag:</strong> ~60 characters</li>
          <li><strong>SEO Meta Description:</strong> ~155-160 characters</li>
          <li><strong>SMS Message:</strong> 160 characters</li>
        </ul>
      </div>
    </>
  );
}
