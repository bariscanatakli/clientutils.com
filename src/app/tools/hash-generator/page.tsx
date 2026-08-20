import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { HashGeneratorClient } from "./HashGeneratorClient";

const path = "/tools/hash-generator";
const description = "Generate and verify MD5, SHA-1, SHA-256, SHA-512 and bcrypt hashes locally. Hash text or files, choose hex or Base64, detect expected algorithms and download checksums.";

export const metadata: Metadata = buildPageMeta({ title: "Hash Generator & Checksum Verifier — Text and Files", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hash Generator and Checksum Verifier",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HashGeneratorPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">Hash Generator &amp; Verifier</span>
      </nav>

      <HashGeneratorClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Generate or verify a hash</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Choose exact UTF-8 text or a local file up to 25 MB. Spaces, line endings and byte order affect the result.</li>
            <li>Select hexadecimal for standard checksums or Base64 for encoded digest output. bcrypt is available for text only.</li>
            <li>Generate, copy individual values, copy the complete report, or download a checksum file.</li>
            <li>To verify, paste an expected hexadecimal digest or bcrypt string. The tool identifies its algorithm from a valid prefix or digest length.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Choose the right algorithm</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">SHA-256</h3><p className="mt-2 text-sm leading-relaxed">A strong general-purpose digest for file integrity, content addressing and signed workflows. Prefer it over MD5 or SHA-1 for new checksum systems.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">SHA-512</h3><p className="mt-2 text-sm leading-relaxed">A 512-bit SHA-2 digest. It is useful when a protocol explicitly requests SHA-512; a longer digest is not a substitute for a signature.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">bcrypt</h3><p className="mt-2 text-sm leading-relaxed">A salted, deliberately slow password-hashing function. The same password produces different bcrypt strings, so use Compare/Verify instead of direct equality.</p></div>
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-4"><h3 className="font-semibold text-foreground">MD5</h3><p className="mt-2 text-sm leading-relaxed">Cryptographically broken because practical collisions exist. Keep it only for compatibility with legacy, non-adversarial checksum lists.</p></div>
            <div className="rounded-xl border border-warning/20 bg-warning/5 p-4"><h3 className="font-semibold text-foreground">SHA-1</h3><p className="mt-2 text-sm leading-relaxed">Also collision-broken for security use. It may still appear in older checksum catalogs and version-control internals.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Password guidance</h3><p className="mt-2 text-sm leading-relaxed">Do not store passwords with raw MD5 or SHA. Use a password-specific KDF such as Argon2id, scrypt or bcrypt with a suitable cost and unique salt.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Checksum verification limits</h2>
          <p className="leading-relaxed">A checksum match proves that the local bytes produce the same digest. It does not prove who published the file, whether the expected hash came from a trustworthy source, or whether the content is malware-free. For authenticity, obtain the checksum over an independent trusted channel or verify a digital signature.</p>
          <p className="mt-4 leading-relaxed">File names and metadata are not hashed—only file bytes. Text uses UTF-8 exactly as entered, including spaces and line endings. Hexadecimal letter case is ignored during verification; Base64 output is generation-only because bare Base64 does not reliably identify its algorithm.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Known digest examples</h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-code-bg p-4 text-sm">
            <p><strong className="text-foreground">Empty text SHA-256:</strong> <code className="break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code></p>
            <p className="mt-3"><strong className="text-foreground">“hello” MD5:</strong> <code>5d41402abc4b2a76b9719d911017c592</code></p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Can two files have the same hash?</h3><p className="mt-1 leading-relaxed">Collisions are possible in principle for every fixed-size digest. Practical chosen collisions are a known reason not to trust MD5 or SHA-1 in adversarial security workflows.</p></div>
            <div><h3 className="font-semibold text-foreground">Why does bcrypt change every time?</h3><p className="mt-1 leading-relaxed">bcrypt embeds a randomly generated salt and cost in the output. Different strings can all correctly verify the same password.</p></div>
            <div><h3 className="font-semibold text-foreground">Why does my checksum not match?</h3><p className="mt-1 leading-relaxed">Common causes include hashing the wrong file, changed line endings, hidden whitespace, a different text encoding, or copying an incomplete expected digest.</p></div>
            <div><h3 className="font-semibold text-foreground">Is my file uploaded?</h3><p className="mt-1 leading-relaxed">No. The browser reads and hashes the file locally. The 25 MB limit protects browser responsiveness rather than a server upload limit.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related security and encoding tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/bcrypt-generator">Dedicated bcrypt tool</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/base64-encoder">Base64 Encoder</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/password-generator">Password Generator</Link>
          </div>
        </section>
      </div>
    </>
  );
}
