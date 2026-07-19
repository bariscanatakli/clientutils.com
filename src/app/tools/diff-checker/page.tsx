import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { DiffCheckerClient } from "./DiffCheckerClient";

export const metadata: Metadata = buildPageMeta({
  title: "Text Diff Checker & Compare Tool",
  description:
    "Compare two text or code files instantly to find differences. Support for lines, words, characters, and JSON diffs. 100% secure and client-side.",
  path: "/tools/diff-checker",
});

export default function DiffCheckerPage() {
  return (
    <>
      <DiffCheckerClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a Diff Tool?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A diff tool (short for difference) is a utility that compares two files or text strings and outputs the differences between them. 
          It is an essential tool for programmers and writers to track revisions, find bugs introduced by code changes, and merge documents.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Comparison Modes</h3>
        <ul className="space-y-3 text-muted list-none pl-0">
          <li>
            <strong className="text-foreground">Lines Mode:</strong> 
            The standard mode for source code. It compares the text line by line. Entire lines are marked as added or removed.
          </li>
          <li>
            <strong className="text-foreground">Words Mode:</strong> 
            Useful for prose and documentation. It ignores whitespace changes and highlights exactly which words were modified within a sentence.
          </li>
          <li>
            <strong className="text-foreground">Characters Mode:</strong> 
            The most granular level. Useful for finding tiny typos in long strings, like a single missing semicolon or an incorrect digit in an ID.
          </li>
          <li>
            <strong className="text-foreground">JSON Mode:</strong> 
            Parses both inputs as JSON objects before comparing. This ignores differences in key ordering or formatting (like spaces vs tabs), focusing purely on the actual data changes.
          </li>
        </ul>
      </div>
    </>
  );
}
