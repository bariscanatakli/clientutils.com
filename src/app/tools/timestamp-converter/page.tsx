import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { TimestampConverterClient } from "./TimestampConverterClient";

export const metadata: Metadata = buildPageMeta({
  title: "Unix Timestamp Converter",
  description:
    "Convert Unix epoch timestamps to human-readable dates and local times. Support for milliseconds, relative time, and ISO formats. Free, fast, client-side only.",
  path: "/tools/timestamp-converter",
});

export default function TimestampConverterPage() {
  return (
    <>
      <TimestampConverterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a Unix Timestamp?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A Unix timestamp (also known as Epoch time or POSIX time) is a system for describing a point in time. 
          It is defined as the number of seconds that have elapsed since the Unix epoch, which is 00:00:00 UTC on 1 January 1970, 
          minus leap seconds. Every day is treated as if it contains exactly 86400 seconds.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Seconds vs Milliseconds</h3>
        <p className="text-muted leading-relaxed mb-6">
          Standard Unix timestamps are measured in seconds (typically a 10-digit number). However, modern programming environments (like JavaScript or Java) often use timestamps in milliseconds (a 13-digit number).
          Our tool automatically detects if you&apos;ve entered a 10-digit or 13-digit timestamp and converts it appropriately without any configuration needed.
        </p>
      </div>
    </>
  );
}
