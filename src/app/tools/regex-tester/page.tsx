import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { RegexTesterClient } from "./RegexTesterClient";

export const metadata: Metadata = buildPageMeta({
  title: "Online Regex Tester & Debugger",
  description:
    "Test, debug, and visualize regular expressions in real-time. Features live text highlighting, execution time metrics, and common regex templates.",
  path: "/tools/regex-tester",
});

export default function RegexTesterPage() {
  return (
    <>
      <RegexTesterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a Regular Expression?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A regular expression (shortened as regex or regexp) is a sequence of characters that specifies a search pattern in text. 
          Usually such patterns are used by string-searching algorithms for "find" or "find and replace" operations on strings, or for input validation.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Common Regex Flags</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>g (Global):</strong> Don't return after the first match, restart the subsequent searches from the end of the previous match.</li>
          <li><strong>i (Case Insensitive):</strong> Match both uppercase and lowercase letters.</li>
          <li><strong>m (Multiline):</strong> `^` and `$` match the start and end of a line, instead of the whole string.</li>
          <li><strong>s (DotAll):</strong> Allows the dot `.` character to match newline characters.</li>
        </ul>
      </div>
    </>
  );
}
