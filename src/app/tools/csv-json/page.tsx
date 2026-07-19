import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { CsvJsonClient } from "./CsvJsonClient";

export const metadata: Metadata = buildPageMeta({
  title: "CSV to JSON & JSON to CSV Converter",
  description:
    "Convert CSV (Comma Separated Values) data to JSON arrays and vice versa. Offline, fast, and handles quotes and commas correctly.",
  path: "/tools/csv-json",
});

export default function CsvJsonPage() {
  return (
    <>
      <CsvJsonClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why convert between CSV and JSON?</h2>
        <p className="text-muted leading-relaxed mb-6">
          CSV (Comma Separated Values) is the standard format for spreadsheets, Excel exports, and tabular data. JSON (JavaScript Object Notation) is the standard format for web APIs, NoSQL databases, and frontend applications. 
          Converting between these two is one of the most common tasks in data migration and backend development.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Handling Edge Cases</h3>
        <p className="text-muted leading-relaxed mb-6">
          Writing a custom script to split a string by commas often breaks because CSV files can contain commas <i>inside</i> quoted fields (e.g. <code>"Smith, John"</code>). 
          Our converter uses a robust, industry-standard CSV parsing engine that correctly handles escaped quotes, internal commas, and multi-line fields.
        </p>
      </div>
    </>
  );
}
