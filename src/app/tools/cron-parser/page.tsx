import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG, buildPageMeta } from "@/lib/constants/seo";
import { CronParserClient } from "./CronParserClient";

const path = "/tools/cron-parser";
const description = "Build, validate, explain and test 5- or 6-field cron expressions. Preview up to 20 future runs in UTC, Istanbul, Berlin, New York and other named timezones.";

export const metadata: Metadata = buildPageMeta({ title: "Cron Expression Generator, Tester & Calculator", description, path });

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cron Expression Generator, Tester and Calculator",
  url: `${SITE_CONFIG.url}${path}`,
  description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CronParserPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <nav aria-label="Breadcrumb" className="mx-auto mb-5 max-w-6xl text-sm text-muted">
        <Link className="hover:text-foreground" href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link className="hover:text-foreground" href="/tools">Developer tools</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">Cron Generator &amp; Tester</span>
      </nav>

      <CronParserClient />

      <div className="mx-auto mt-16 max-w-5xl border-t border-border pt-8 text-muted">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-foreground">Build and test a cron schedule</h2>
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Start with a preset, enter an expression directly, or edit each field in the visual wizard.</li>
            <li>Use the standard five fields for Unix, Kubernetes and GitHub Actions; enable seconds only for runtimes that support a sixth field.</li>
            <li>Select the timezone in which the scheduler will interpret the expression, then choose 5, 10 or 20 future runs.</li>
            <li>Check the plain-language explanation and exact UTC instants before copying the expression or downloading the schedule.</li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Cron field order</h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-code-bg p-5">
            <pre className="m-0 min-w-[560px] text-sm text-code-foreground">{`┌───────────── minute (0–59)
│ ┌───────────── hour (0–23)
│ │ ┌───────────── day of month (1–31)
│ │ │ ┌───────────── month (1–12 or JAN–DEC)
│ │ │ │ ┌───────────── day of week (0–7 or SUN–SAT)
│ │ │ │ │
* * * * *`}</pre>
          </div>
          <p className="mt-3 leading-relaxed">An optional seconds field goes before minute, producing six fields. Confirm support in the scheduler you will deploy to; traditional crontab, Kubernetes CronJobs and GitHub Actions use five fields.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Lists, ranges and steps</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Wildcard *</h3><p className="mt-2 text-sm leading-relaxed">Matches every valid value in the field.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">List ,</h3><p className="mt-2 text-sm leading-relaxed"><code>1,15,30</code> matches three explicit values.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Range -</h3><p className="mt-2 text-sm leading-relaxed"><code>1-5</code> matches every value from one through five.</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold text-foreground">Step /</h3><p className="mt-2 text-sm leading-relaxed"><code>*/15</code> matches every fifteen units, starting at the field minimum.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Timezone and daylight-saving behavior</h2>
          <p className="leading-relaxed">Cron itself does not carry a timezone. The scheduler or application supplies it. This calculator uses IANA names such as <code>Europe/Istanbul</code> and <code>America/New_York</code>. Named zones apply their historical and future daylight-saving rules, so a local time may be skipped or occur twice around a transition. Use UTC when the job must avoid DST ambiguity.</p>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Frequently asked questions</h2>
          <div className="space-y-5">
            <div><h3 className="font-semibold text-foreground">Is this a cron timer or cron job runner?</h3><p className="mt-1 leading-relaxed">It is a generator and schedule tester. It calculates when an expression matches but does not execute commands or keep a timer running after the page closes.</p></div>
            <div><h3 className="font-semibold text-foreground">Does GitHub Actions use my local timezone?</h3><p className="mt-1 leading-relaxed">Scheduled GitHub Actions workflows use UTC and five cron fields. Preview with UTC here, then place the expression in the workflow schedule.</p></div>
            <div><h3 className="font-semibold text-foreground">Why can a DST day skip or repeat a run?</h3><p className="mt-1 leading-relaxed">Some named timezones move clocks forward or backward. A nonexistent local clock time can be skipped, while a repeated clock hour can create an ambiguous schedule.</p></div>
            <div><h3 className="font-semibold text-foreground">Is the expression sent to a server?</h3><p className="mt-1 leading-relaxed">No. Validation, explanation, timezone calculation and file export all run locally in the browser.</p></div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">Related time tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/timestamp-converter">Unix Timestamp Converter</Link>
            <Link className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-card-hover" href="/tools/uuid-generator">UUID v7 &amp; ULID Generator</Link>
          </div>
        </section>
      </div>
    </>
  );
}
