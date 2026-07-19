import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { CurlConverterClient } from "./CurlConverterClient";

export const metadata: Metadata = buildPageMeta({
  title: "cURL to Fetch & Axios Converter",
  description:
    "Instantly convert bash cURL commands into JavaScript Fetch or Axios code. Auto-parses headers, data payloads, and HTTP methods.",
  path: "/tools/curl-converter",
});

export default function CurlConverterPage() {
  return (
    <>
      <CurlConverterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Translating API Documentation to Code</h2>
        <p className="text-muted leading-relaxed mb-6">
          Most API documentation (like Stripe, Twilio, or GitHub) provides examples in bash `curl`. 
          Translating these multi-line curl commands into JavaScript code manually is tedious and error-prone, especially when dealing with nested JSON payloads, authorization headers, and specific HTTP methods.
          Our converter instantly translates any cURL string into production-ready code.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Supported Output Formats</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Browser Fetch:</strong> Generates native JavaScript `fetch()` code suitable for modern web browsers.</li>
          <li><strong>Node Fetch:</strong> Generates code compatible with the `node-fetch` package for Node.js environments.</li>
          <li><strong>Axios:</strong> Generates code for Axios, the most popular HTTP client library for both browser and Node.js.</li>
        </ul>
      </div>
    </>
  );
}
