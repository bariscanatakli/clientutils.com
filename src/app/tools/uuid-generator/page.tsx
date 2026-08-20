import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { UuidGeneratorClient } from "./UuidGeneratorClient";

const path = "/tools/uuid-generator";
const description = "Generate UUID v1, v4, v7 and ULID batches, or validate pasted identifiers and inspect UUID versions, variants, normalization and ULID timestamps locally.";

export const metadata: Metadata = buildPageMeta({ title: "UUID Generator & Validator — v1, v4, v7 and ULID", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UUID Generator and Validator",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function UuidGeneratorPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">UUID Generator &amp; Validator</span>
      </nav>

      <UuidGeneratorClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Generate or validate an identifier</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Choose UUID v4 for random identifiers, v7 or ULID for time-sortable values, or v1 for compatibility with time-based systems.</li>
            <li>Select 1–100 values and generate, copy, or download the batch.</li>
            <li>Open Validate &amp; inspect to paste values or upload a text file. UUIDs may include or omit hyphens.</li>
            <li>Review validity, normalized form, detected UUID version and variant, or the timestamp embedded in a ULID.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Which identifier format should you use?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">UUID v4</h3><p className="mt-2 text-sm leading-relaxed">Random and widely supported. A dependable default when insertion order is not important.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">UUID v7</h3><p className="mt-2 text-sm leading-relaxed">Combines a Unix-millisecond timestamp with random data, making freshly generated values time ordered.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">UUID v1</h3><p className="mt-2 text-sm leading-relaxed">A legacy time-based format. This browser library uses an internal node value; the page does not read your device MAC address.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">ULID</h3><p className="mt-2 text-sm leading-relaxed">A 26-character Crockford Base32 identifier whose leading characters encode time for lexical sorting.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Validation and normalization</h2>
          <p className="leading-relaxed">The validator accepts standard hyphenated UUIDs and 32-digit compact UUIDs, normalizing valid UUID output to lowercase 8-4-4-4-12 form. It recognizes RFC UUID versions, Nil and Max special values, and valid ULIDs. Validation checks structure and reserved bits; it cannot prove that an identifier is unique or that it exists in a database.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">I searched for “uudi”. Is that the same thing?</h3><p className="mt-1 leading-relaxed">“UUDI” is a common transposition of UUID. The standard term is UUID: Universally Unique Identifier. This page generates and validates UUIDs.</p></div>
            <div><h3 className="font-semibold text-foreground">Are UUIDs safe for passwords or API secrets?</h3><p className="mt-1 leading-relaxed">No. UUIDs and ULIDs are identifiers, not credentials. Use a cryptographically generated secret with sufficient entropy for passwords, tokens, and API keys.</p></div>
            <div><h3 className="font-semibold text-foreground">Does UUID v7 reveal creation time?</h3><p className="mt-1 leading-relaxed">Yes, UUID v7 includes a Unix-millisecond timestamp. The validator reports UUID version but currently decodes the embedded timestamp only for ULIDs.</p></div>
            <div><h3 className="font-semibold text-foreground">Are uploaded values sent anywhere?</h3><p className="mt-1 leading-relaxed">No. Text-file reading, generation, validation, and normalization run locally in the browser.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related developer tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/hash-generator">Hash Generator</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/password-generator">Password Generator</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/timestamp-converter">Timestamp Converter</Link>
          </div>
        </section>
      </div>
    </>
  );
}
