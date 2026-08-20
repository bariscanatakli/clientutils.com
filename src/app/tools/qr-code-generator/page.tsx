import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import QrClient from "./QrClient";

const path = "/tools/qr-code-generator";
const description = "Create validated QR codes for URLs, Wi-Fi, vCards, email, SMS, phone and text. Preview the exact payload and download PNG or SVG locally.";

export const metadata: Metadata = buildPageMeta({ title: "QR Code Generator — URL, Wi-Fi, vCard & SMS", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QR Code Generator for URL, Wi-Fi, vCard and SMS",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function QrGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">QR Code Generator</span>
      </nav>

      <QrClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">How to create a dependable QR code</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Choose one payload type and enter the destination exactly as a scanner should receive it. URL and contact fields are validated before a code is rendered.</li>
            <li>Keep a dark foreground, light background and four-module quiet zone. Increase error correction when the code will be printed small or exposed to wear.</li>
            <li>Inspect or copy the exact encoded payload. Download PNG for screens and documents, or SVG for lossless resizing in print layouts.</li>
            <li>Scan-test the final exported asset with more than one device before publishing, printing signs or sharing credentials.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Supported QR payloads</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info title="URL and text">HTTP and HTTPS destinations are validated; plain text is preserved exactly, including Unicode and line breaks.</Info>
            <Info title="Wi-Fi">Generate escaped WIFI payloads for WPA-family, legacy WEP or open networks, including hidden SSIDs.</Info>
            <Info title="vCard contact">Create a vCard 3.0 contact with name, organization, title, email, phone and website.</Info>
            <Info title="Email">Encode a mailto address with optional subject and body using URL-safe parameters.</Info>
            <Info title="SMS and phone">Create sms: and tel: actions with a normalized number and optional prefilled message.</Info>
            <Info title="No redirects or tracking">The exported code contains the shown destination directly. ClientUtils does not add a short link, analytics or expiration.</Info>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Quality, capacity and security limits</h2>
          <p className="leading-relaxed">QR readers need contrast and empty space around the symbol. Four modules is the usual safe quiet zone; removing it may make a code fail when placed beside text or graphics. Error correction can recover some damaged modules, but higher settings also make a payload denser. This tool caps practical payloads at 2,000 UTF-8 bytes; shorter URLs and messages generally produce easier-to-scan codes.</p>
          <p className="mt-4 leading-relaxed">A QR code is not a security certificate. Anyone can replace a printed code or encode a deceptive URL. Review the displayed payload, use HTTPS destinations, and verify the scan prompt before opening a link or joining a network. Wi-Fi passwords and vCard details remain readable within the QR code itself, even though this page processes them only in your browser.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <Info title="Should I download PNG or SVG?">Use PNG at a chosen pixel size for common documents and social images. Use SVG for signs, packaging or any layout that may be resized; test the final rendered result.</Info>
            <Info title="Do these QR codes expire?">No. The code directly contains your payload and has no ClientUtils redirect. A linked page can still move, disappear or change.</Info>
            <Info title="Why will my QR code not scan?">Common causes are low contrast, a missing quiet zone, excessive payload density, small print size, blur, glare or editing that covers functional modules.</Info>
            <Info title="Are Wi-Fi passwords uploaded?">No. Payload construction and image export happen locally in your browser. The password is still embedded in the downloadable QR image, so share it accordingly.</Info>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/url-encoder">URL Encoder</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/color-converter">Color Converter</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/password-generator">Password Generator</Link>
          </div>
        </section>
      </div>
    </>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed">{children}</p></div>;
}
