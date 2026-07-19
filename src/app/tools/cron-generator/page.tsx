import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { CronGeneratorClient } from "./CronGeneratorClient";

export const metadata: Metadata = buildPageMeta({
  title: "Cron Expression Generator",
  description:
    "Build cron expressions visually. Select minutes, hours, days, and months to generate schedule strings for Linux, Kubernetes, and GitHub Actions.",
  path: "/tools/cron-generator",
});

export default function CronGeneratorPage() {
  return (
    <>
      <CronGeneratorClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">How to write a Cron Expression</h2>
        <p className="text-muted leading-relaxed mb-6">
          A standard cron expression consists of 5 fields separated by spaces. It is a powerful syntax used in Unix-like operating systems to schedule jobs (commands or scripts) to run periodically at fixed times, dates, or intervals.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Syntax Breakdown</h3>
        <pre className="bg-code-bg p-4 rounded-lg text-xs font-mono text-code-foreground mb-6">
{`┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *`}
        </pre>

        <h3 className="text-md font-semibold text-foreground mb-3">Special Characters</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Asterisk (*):</strong> Specifies all possible values for a field. For example, an asterisk in the hour time field would be equivalent to every hour.</li>
          <li><strong>Comma (,):</strong> Specifies a list of values. For example: `1,5,10`.</li>
          <li><strong>Dash (-):</strong> Specifies a range of values. For example: `1-5`.</li>
          <li><strong>Slash (/):</strong> Specifies increments. For example, `*/5` in the minute field means "every 5 minutes".</li>
        </ul>
      </div>
    </>
  );
}
