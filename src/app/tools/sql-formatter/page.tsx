import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { SqlFormatterClient } from "./SqlFormatterClient";

export const metadata: Metadata = buildPageMeta({
  title: "SQL Formatter & Beautifier",
  description:
    "Format, beautify, and standardize SQL queries instantly. Supports standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, and T-SQL. 100% free and client-side.",
  path: "/tools/sql-formatter",
});

export default function SqlFormatterPage() {
  return (
    <>
      <SqlFormatterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why use an SQL Formatter?</h2>
        <p className="text-muted leading-relaxed mb-6">
          SQL is a powerful language, but unformatted, nested, or minified SQL queries can be incredibly difficult to read and debug. 
          Our SQL Formatter takes chaotic query strings and applies standard indentation, spacing, and keyword capitalization rules to make your code human-readable instantly.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Dialect Support</h3>
        <p className="text-muted leading-relaxed mb-6">
          Different database engines have slight variations in their SQL syntax. We support multiple dialects including:
        </p>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Standard SQL:</strong> The baseline ISO standard syntax.</li>
          <li><strong>PostgreSQL:</strong> Supports Postgres-specific features like array operators and JSONB functions.</li>
          <li><strong>MySQL & MariaDB:</strong> Handles backtick quoting and specific function syntaxes.</li>
          <li><strong>T-SQL:</strong> Microsoft SQL Server&apos;s proprietary extension.</li>
        </ul>
      </div>
    </>
  );
}
