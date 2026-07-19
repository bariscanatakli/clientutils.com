import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { YamlFormatterClient } from "./YamlFormatterClient";

export const metadata: Metadata = buildPageMeta({
  title: "YAML Formatter & JSON Converter",
  description:
    "Format, validate, and convert YAML files. Easily convert YAML to JSON or JSON to YAML. Instant, offline, and secure.",
  path: "/tools/yaml-formatter",
});

export default function YamlFormatterPage() {
  return (
    <>
      <YamlFormatterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Why use a YAML Formatter?</h2>
        <p className="text-muted leading-relaxed mb-6">
          YAML (YAML Ain't Markup Language) is incredibly popular for configuration files (like Docker Compose, Kubernetes, CI/CD pipelines). 
          However, YAML relies on strict indentation (spaces, not tabs). A single missing or extra space can break an entire deployment.
          Our YAML Formatter instantly validates your syntax, fixes formatting inconsistencies, and ensures your files are structurally sound.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Converting between YAML and JSON</h3>
        <p className="text-muted leading-relaxed mb-6">
          YAML is a superset of JSON, meaning any valid JSON file is technically a valid YAML file. 
          Converting between the two formats is a common task for developers.
        </p>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>YAML to JSON:</strong> Useful when you need to send configuration data to a web API or parse it with native JavaScript `JSON.parse()`.</li>
          <li><strong>JSON to YAML:</strong> Great for converting unreadable, dense JSON machine-outputs into a human-readable, comment-friendly format.</li>
        </ul>
      </div>
    </>
  );
}
