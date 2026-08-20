import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { JsonFormatterClient } from "./JsonFormatterClient";

const path = "/tools/json-formatter";
const description = "Format, validate, minify, compact, and expand JSON locally. Upload or paste JSON, inspect errors and tree data, compare UTF-8 size, then copy or download the result.";

export const metadata: Metadata = buildPageMeta({ title: "JSON Formatter, Minifier & Validator", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Formatter, Minifier and Validator",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonFormatterPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-[1400px] text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">JSON Formatter &amp; Minifier</span>
      </nav>

      <JsonFormatterClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Format, minify, or expand JSON</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Paste JSON, upload a <code>.json</code>/<code>.txt</code> file up to 5 MB, or load the sample.</li>
            <li>Fix any reported syntax error using its line and column location.</li>
            <li>Choose Formatted to make compact JSON readable, Minify / Compact to remove insignificant whitespace, or Tree to inspect nested data.</li>
            <li>Copy the result, download a JSON file, or move the result back into the editor for another pass.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">JSON minification versus compression</h2>
          <p className="leading-relaxed">JSON minification removes spaces, indentation, and line breaks that are not part of string values. It keeps the same parsed data and produces valid compact JSON. The size comparison above measures UTF-8 bytes, so non-ASCII characters are counted accurately.</p>
          <p className="mt-4 leading-relaxed">Minification is often called “JSON compression” in search and everyday usage, but it is not GZIP or Brotli. Transport compression produces binary encoded data and is normally configured by an HTTP server or build pipeline. This browser tool intentionally handles readable JSON text: compact it with Minify, or expand compact JSON with Formatted.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Common JSON validation errors</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Trailing commas</h3><p className="mt-2 text-sm leading-relaxed">JSON does not permit a comma after the last property or array item.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Single quotes</h3><p className="mt-2 text-sm leading-relaxed">Property names and string values must use double quotes in standard JSON.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Unescaped characters</h3><p className="mt-2 text-sm leading-relaxed">Quotes, backslashes, and control characters inside strings need valid escape sequences.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Does minifying JSON change values?</h3><p className="mt-1 leading-relaxed">No. The tool parses the input and serializes the same data without formatting whitespace. Whitespace inside string values remains part of the value.</p></div>
            <div><h3 className="font-semibold text-foreground">Can I decompress minified JSON?</h3><p className="mt-1 leading-relaxed">Yes. Paste the one-line JSON and choose Formatted. Binary GZIP or Brotli files are a different format and are not accepted here.</p></div>
            <div><h3 className="font-semibold text-foreground">Is uploaded JSON sent to a server?</h3><p className="mt-1 leading-relaxed">No. The browser reads the file locally and all transformations stay on the device.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related JSON tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/json-diff">Compare JSON</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/json-escape">Escape JSON Strings</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/csv-json">CSV to JSON</Link>
          </div>
        </section>
      </div>
    </>
  );
}
