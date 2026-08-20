import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { CssGradientClient } from "./CssGradientClient";

const path = "/tools/css-gradient";
const description = "Build Tailwind CSS linear, radial, and conic gradients visually. Control colors, stop positions, angle and origin, then copy Tailwind v4 or v3-compatible classes.";

export const metadata: Metadata = buildPageMeta({ title: "Tailwind Gradient Generator", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tailwind Gradient Generator",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CssGradientPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">Tailwind Gradient Generator</span>
      </nav>

      <CssGradientClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">How to generate a Tailwind gradient</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Choose a linear, radial, or conic gradient and start from a preset or your own colors.</li>
            <li>Adjust each color stop and its exact percentage. Set an angle for linear/conic gradients or an origin for radial gradients.</li>
            <li>Select Tailwind v4 for native <code>bg-linear-*</code>, <code>bg-radial-*</code>, and <code>bg-conic-*</code> utilities. Select v3 for an exact arbitrary background-image class.</li>
            <li>Copy the class list or complete HTML example. Keep the CSS fallback when the gradient is used outside Tailwind.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Tailwind v4 and v3 output</h2>
          <p className="leading-relaxed">Tailwind v4 uses the current gradient utility names and supports native linear angles, radial gradients, conic gradients, arbitrary colors, and explicit stop positions. Tailwind v3 used the older <code>bg-gradient-*</code> family and did not provide the same native radial/conic workflow, so this generator emits one exact <code>bg-[...]</code> arbitrary background-image class in v3 mode. Gradients with more than three stops also use an exact arbitrary class because the composable <code>from</code>/<code>via</code>/<code>to</code> model represents at most three colors.</p>
          <p className="mt-4 leading-relaxed">For the underlying syntax, see Tailwind’s official <a className="font-semibold text-primary hover:underline" href="https://tailwindcss.com/docs/background-image" rel="noreferrer" target="_blank">background image and gradient documentation</a>.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Useful gradient patterns</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Hero backgrounds</h3><p className="mt-2 text-sm leading-relaxed">Use a subtle three-stop linear gradient and keep text contrast high across the full preview.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Gradient text</h3><p className="mt-2 text-sm leading-relaxed">Add <code>bg-clip-text text-transparent</code> to the generated v4 classes when the gradient should fill text.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Glow effects</h3><p className="mt-2 text-sm leading-relaxed">Use a radial gradient with a bright first stop and transparent-looking dark outer colors behind cards or illustrations.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Why does the v4 class start with bg-linear instead of bg-gradient?</h3><p className="mt-1 leading-relaxed">Tailwind renamed linear gradient utilities to <code>bg-linear-*</code> in v4 and added native radial and conic utilities.</p></div>
            <div><h3 className="font-semibold text-foreground">Will arbitrary color classes be detected?</h3><p className="mt-1 leading-relaxed">Yes when the complete generated class appears as plain text in a file scanned by Tailwind. Avoid assembling arbitrary class names from partial runtime strings.</p></div>
            <div><h3 className="font-semibold text-foreground">Does this generator upload my palette?</h3><p className="mt-1 leading-relaxed">No. Preview rendering and class generation happen locally in the browser.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related developer tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/color-converter">Color Code Converter</Link>
          </div>
        </section>
      </div>
    </>
  );
}
