import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { LineSortClient } from "./LineSortClient";

export const metadata: Metadata = buildPageMeta({
  title: "Sort Lines & Remove Duplicates",
  description:
    "Alphabetize text lines, remove duplicate entries, and delete empty lines instantly. Perfect for cleaning up lists, CSVs, and arrays.",
  path: "/tools/line-sort",
});

export default function LineSortPage() {
  return (
    <>
      <LineSortClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why use a Line Sorting Tool?</h2>
        <p className="text-muted leading-relaxed mb-6">
          Cleaning up messy data is a daily task for developers and data analysts. Whether you&apos;ve extracted a list of email addresses, compiled a list of keywords for SEO, or copied an array from a log file, dealing with duplicates and empty spaces is tedious.
          This tool runs entirely in your browser, securely and instantly processing thousands of lines to give you a clean, sorted, and unique list.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Key Features</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Alphabetical Sort:</strong> Sort from A to Z or Z to A.</li>
          <li><strong>Deduplication:</strong> Automatically identify and remove duplicate lines. You can choose whether &quot;Apple&quot; and &quot;apple&quot; should be treated as duplicates (Case Sensitive toggle).</li>
          <li><strong>Remove Empty Lines:</strong> Strips out blank lines or lines that contain only spaces.</li>
        </ul>
      </div>
    </>
  );
}
