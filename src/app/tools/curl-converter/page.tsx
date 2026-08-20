import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { CurlConverterClient } from "./CurlConverterClient";

const path = "/tools/curl-converter";
const description = "Convert cURL commands to Axios or JavaScript Fetch code with headers, JSON bodies, query parameters, cookies, and authentication preserved.";

export const metadata: Metadata = buildPageMeta({ title: "cURL to Axios Converter", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cURL to Axios Converter",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CurlConverterPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-[1400px] text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">cURL to Axios</span>
      </nav>

      <CurlConverterClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">How to convert cURL to Axios</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Copy a complete cURL command from API documentation, your terminal, or a browser network panel.</li>
            <li>Paste it above and keep Axios selected, or choose Browser Fetch or Node Fetch.</li>
            <li>Review the generated method, URL, headers, authentication, and body before running the request.</li>
            <li>Copy the code or download it as a JavaScript file.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">What the converter preserves</h2>
          <p className="leading-relaxed">The parser understands common options including <code>-X</code>/<code>--request</code>, <code>-H</code>/<code>--header</code>, data variants, <code>--json</code>, <code>-G</code>/<code>--get</code>, <code>-u</code>/<code>--user</code>, cookies, referrers, and user agents. Quoted and multiline commands are supported. JSON bodies become JavaScript objects in Axios output; non-JSON bodies stay strings.</p>
          <p className="mt-4 leading-relaxed"><strong className="text-foreground">Known limit:</strong> multipart uploads and local <code>@file</code> bodies require browser File/FormData handling and are deliberately rejected with an actionable message instead of producing misleading code.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Does this execute my cURL request?</h3><p className="mt-1 leading-relaxed">No. It only parses the command and generates code locally in your browser.</p></div>
            <div><h3 className="font-semibold text-foreground">Are API keys uploaded?</h3><p className="mt-1 leading-relaxed">No. Input remains in the page and is not sent to a server. You should still avoid sharing generated code that contains live credentials.</p></div>
            <div><h3 className="font-semibold text-foreground">Why does Axios use an options object?</h3><p className="mt-1 leading-relaxed">A single options object keeps the HTTP method, URL, headers, authentication, and data explicit and easy to audit.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related developer tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/json-formatter">JSON Formatter</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/url-encoder">URL Encoder &amp; Decoder</Link>
          </div>
        </section>
      </div>
    </>
  );
}
