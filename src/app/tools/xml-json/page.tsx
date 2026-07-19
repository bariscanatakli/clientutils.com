import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { XmlJsonClient } from "./XmlJsonClient";

export const metadata: Metadata = buildPageMeta({
  title: "XML to JSON Converter",
  description:
    "Convert data securely between XML and JSON formats in your browser. 100% free, client-side, and instant.",
  path: "/tools/xml-json",
});

export default function XmlJsonPage() {
  return (
    <>
      <XmlJsonClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">XML vs JSON</h2>
        <p className="text-muted leading-relaxed mb-6">
          Both XML (eXtensible Markup Language) and JSON (JavaScript Object Notation) are widely used formats for storing and transporting data.
          While XML is older and relies on a tag-based structure (similar to HTML), JSON uses a lightweight key-value pair syntax that is natively understood by modern JavaScript applications.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Why convert between them?</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Modernizing Legacy APIs:</strong> Many older enterprise SOAP APIs return XML. Converting this to JSON makes it vastly easier to consume in modern frontend frameworks (React, Vue, Angular).</li>
          <li><strong>Data Migration:</strong> When moving data from old SQL/XML-based stores to modern NoSQL databases (like MongoDB), JSON conversion is a necessary middle step.</li>
          <li><strong>Configuration Files:</strong> Some systems require XML configs (like Java/Spring or MSBuild), while others prefer JSON. This tool lets you translate between the two instantly.</li>
        </ul>
      </div>
    </>
  );
}
