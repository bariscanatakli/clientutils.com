import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { JsonMinifierClient } from "./JsonMinifierClient";

export const metadata: Metadata = buildPageMeta({
  title: "JSON Minifier & Compressor",
  description:
    "Compress JSON data by removing spaces, newlines, and unnecessary formatting. Reduce payload sizes for faster API transfers and database storage.",
  path: "/tools/json-minifier",
});

export default function JsonMinifierPage() {
  return (
    <>
      <JsonMinifierClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why Minify JSON?</h2>
        <p className="text-muted leading-relaxed mb-6">
          While formatted (pretty-printed) JSON is great for humans to read, it includes a lot of unnecessary characters like spaces, tabs, and newline breaks. 
          When sending JSON data over a network in API requests, or storing it in databases (like MongoDB or Redis), these extra characters increase the payload size, wasting bandwidth and storage.
          Minifying your JSON strips out all whitespace, creating a dense, single-line string that is parsed faster by machines.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Is Minification the same as Compression?</h3>
        <p className="text-muted leading-relaxed mb-6">
          Not exactly. Minification removes whitespace and formatting. Compression (like GZIP or Brotli) uses algorithms to find repeating patterns and compress the data itself. 
          However, sending minified JSON over a GZIP-enabled connection yields the fastest and smallest possible data transfer.
        </p>
      </div>
    </>
  );
}
