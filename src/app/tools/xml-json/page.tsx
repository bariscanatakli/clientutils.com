import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { XmlJsonClient } from "./XmlJsonClient";

const path = "/tools/xml-json";
const description = "Convert XML to JSON for JavaScript locally. Preserve attributes, namespaces, arrays or node order; validate input, upload files, copy JavaScript and convert back to XML.";

export const metadata: Metadata = buildPageMeta({ title: "XML to JSON Converter for JavaScript", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "XML to JSON Converter for JavaScript",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function XmlJsonPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">XML to JSON</span>
      </nav>

      <XmlJsonClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Convert XML into JavaScript-ready JSON</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Paste XML, upload an <code>.xml</code> file up to 5 MB, or load the sample containing a declaration, namespace, attributes, and repeated elements.</li>
            <li>Choose a compact object for ordinary application data or preserve node order for mixed content, comments, and exact element ordering.</li>
            <li>Keep values as strings by default, or deliberately coerce number and boolean text. Choose whether declarations and comments remain.</li>
            <li>Copy or download JSON, switch to JavaScript output, or send the generated JSON into the reverse converter.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">How attributes, text, arrays, and namespaces map</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Compact object</h3><p className="mt-2 text-sm leading-relaxed">Element names become keys, attributes live under <code>_attributes</code>, and text lives under <code>_text</code>. Repeated sibling elements become arrays. Enable Always arrays when your code needs a stable array shape even for one occurrence.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Preserve node order</h3><p className="mt-2 text-sm leading-relaxed">Nodes become entries in an <code>elements</code> array with explicit <code>type</code>, <code>name</code>, <code>attributes</code>, and text fields. This is more verbose but preserves mixed-content order.</p></div>
          </div>
          <p className="mt-4 leading-relaxed">Qualified names such as <code>shop:item</code> and declarations such as <code>xmlns:shop</code> are preserved as written. The converter does not resolve a namespace prefix into a separate URI-aware object model. If namespace semantics matter, read the preserved declaration and qualified key explicitly.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Use the result in JavaScript</h2>
          <p className="leading-relaxed">The JavaScript tab wraps valid JSON in a sanitized variable declaration and can append an ES module default export. JSON output is also valid JavaScript object syntax, but a <code>.json</code> file is normally consumed with your runtime&apos;s JSON import or parsing support.</p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-code-bg p-4 text-sm text-code-foreground"><code>{`const parsedXml = {
  "product": {
    "_attributes": { "id": "sku-1" },
    "_text": "Keyboard"
  }
};

export default parsedXml;`}</code></pre>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Reverse JSON to XML conversion</h2>
          <p className="leading-relaxed">Reverse conversion expects the same compact or node-order schema produced by this tool. Arbitrary JSON has no universal XML representation: arrays, attributes, text nodes, and element names are ambiguous without a mapping convention. Use the sample or first convert XML to learn the supported shape, then edit that JSON predictably.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Why are numbers strings?</h3><p className="mt-1 leading-relaxed">XML text has no native number or boolean type. Keeping strings avoids changing identifiers such as <code>00123</code>. Enable Numbers / booleans only when that coercion matches your data contract.</p></div>
            <div><h3 className="font-semibold text-foreground">Why does one element sometimes become an object and sometimes an array?</h3><p className="mt-1 leading-relaxed">Compact mode naturally creates arrays for repeated siblings. Enable Always arrays when consumers require a consistent collection shape for both one and many elements.</p></div>
            <div><h3 className="font-semibold text-foreground">Does it support XML comments and declarations?</h3><p className="mt-1 leading-relaxed">Yes. Both are retained by default and can be omitted with independent controls. Preserve node order when their location relative to elements is important.</p></div>
            <div><h3 className="font-semibold text-foreground">Is my XML uploaded?</h3><p className="mt-1 leading-relaxed">No. Parsing and export happen in your browser. The 5 MB file limit protects responsiveness rather than reflecting a server upload limit.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related data tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/json-formatter">JSON Formatter &amp; Minifier</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/json-diff">JSON Diff</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/html-encode">HTML Encoder</Link>
          </div>
        </section>
      </div>
    </>
  );
}
