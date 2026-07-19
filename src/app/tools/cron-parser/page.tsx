import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { CronParserClient } from "./CronParserClient";

export const metadata: Metadata = buildPageMeta({
  title: "Cron Expression Parser",
  description:
    "Parse cron expressions instantly. Convert cron to human-readable text and see the next 5 run times in your local timezone. Free, client-side, no data sent to servers.",
  path: "/tools/cron-parser",
});

export default function CronParserPage() {
  return (
    <>
      <CronParserClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-4xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a Cron Expression?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A cron expression is a string consisting of five or six fields separated by white space that represents a set of times, normally as a schedule to execute some routine. 
          It is commonly used in Unix-like computer operating systems for scheduling tasks to be executed periodically (using the cron daemon).
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Cron Format</h3>
        <div className="bg-card border border-border rounded-lg p-4 mb-6 overflow-x-auto">
          <pre className="text-sm font-mono text-muted m-0">
{`* * * * *
│ │ │ │ │
│ │ │ │ └─── day of week (0 - 7) (0 or 7 is Sunday)
│ │ │ └────── month (1 - 12)
│ │ └───────── day of month (1 - 31)
│ └──────────── hour (0 - 23)
└─────────────── minute (0 - 59)`}
          </pre>
        </div>

        <h3 className="text-md font-semibold text-foreground mb-3">Special Characters</h3>
        <ul className="space-y-2 text-muted list-disc list-inside">
          <li><strong>*</strong> (Asterisk): Indicates all values. e.g. * in the minute field means every minute.</li>
          <li><strong>,</strong> (Comma): Separates items of a list. e.g. 1,3,5 in the day of week field means Monday, Wednesday, and Friday.</li>
          <li><strong>-</strong> (Hyphen): Defines ranges. e.g. 9-17 in the hour field means between 9 AM and 5 PM.</li>
          <li><strong>/</strong> (Slash): Specifies step values. e.g. */5 in the minute field means every 5 minutes.</li>
        </ul>
      </div>
    </>
  );
}
