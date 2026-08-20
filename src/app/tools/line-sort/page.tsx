import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { LineSortClient } from "./LineSortClient";

const path = "/tools/line-sort";
const description = "Trim lines, remove blanks and duplicates, then sort text alphabetically, naturally or numerically. Process, copy and download lists privately in your browser.";

export const metadata: Metadata = buildPageMeta({ title: "Line Tools — Trim, Dedupe & Sort Text", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Line Tools — Trim, Dedupe and Sort Text",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function LineSortPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">Line Tools</span>
      </nav>

      <LineSortClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Clean a text list in one predictable pass</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Paste one value per line, upload a local text file up to 5 MB, or load the sample.</li>
            <li>Choose whether to trim the start, end, both sides, or neither. Trimming always happens before filtering.</li>
            <li>Remove blank lines and duplicates. Case-insensitive dedupe keeps the first spelling and capitalization it encounters.</li>
            <li>Keep the remaining order, reverse it, or choose alphabetical, natural, or numeric sorting.</li>
            <li>Review exact removal statistics, copy the result, use it as the next input, or download an LF/CRLF text file.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Choose the correct sort mode</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Alphabetical</h3><p className="mt-2 text-sm leading-relaxed">Uses an English locale-aware comparison. It is appropriate for words, domains, email addresses, keywords, and ordinary labels.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Natural</h3><p className="mt-2 text-sm leading-relaxed">Understands digit runs inside text, so <code>item2</code> comes before <code>item10</code>. Use it for filenames, version-like labels, ticket numbers, and IDs.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Numeric</h3><p className="mt-2 text-sm leading-relaxed">Recognizes full-line integers, decimals, signs, and scientific notation. Numeric lines sort first; non-numeric lines remain stable afterward.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Stable order and deduplication rules</h2>
          <p className="leading-relaxed">Equal sort values retain their relative input order. Deduplication also preserves the first matching line rather than arbitrarily choosing a later value. With case-sensitive comparison disabled, <code>Apple</code> and <code>apple</code> are duplicates; the first form remains in the output. Whitespace is evaluated after the selected trim operation, making the pipeline deterministic and repeatable.</p>
          <p className="mt-4 leading-relaxed">Blank-line removal treats whitespace-only lines as blank even when trimming is disabled. Selecting CRLF changes downloaded and copied output separators without changing the visible line count.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Practical examples</h2>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed">
            <li>Trim and deduplicate email lists while preserving the first entered address spelling.</li>
            <li>Natural-sort filenames such as <code>report2.csv</code>, <code>report9.csv</code>, and <code>report10.csv</code>.</li>
            <li>Numerically order measurements, prices, IDs, or exported database values without lexicographic mistakes.</li>
            <li>Remove blank and repeated lines from logs, allowlists, SEO keyword lists, and environment-variable inventories.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Does dedupe happen before or after trimming?</h3><p className="mt-1 leading-relaxed">After trimming. For example, <code> apple </code> and <code>apple</code> become duplicates when Both sides is selected.</p></div>
            <div><h3 className="font-semibold text-foreground">Why does alphabetical sort put 10 before 2?</h3><p className="mt-1 leading-relaxed">Alphabetical mode compares text. Choose Natural for digits embedded in labels or Numeric when every sortable value occupies a whole line.</p></div>
            <div><h3 className="font-semibold text-foreground">What happens to invalid values in numeric mode?</h3><p className="mt-1 leading-relaxed">Recognized finite numbers are sorted first. All other lines remain afterward in their original relative order, and the interface reports both counts.</p></div>
            <div><h3 className="font-semibold text-foreground">Is uploaded text sent anywhere?</h3><p className="mt-1 leading-relaxed">No. Reading, processing, copying, and downloading happen locally in the browser. The 5 MB limit protects responsiveness.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related text and data tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/case-converter">Case Converter</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/diff-checker">Diff Checker</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/word-counter">Word Counter</Link>
          </div>
        </section>
      </div>
    </>
  );
}
