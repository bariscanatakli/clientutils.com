import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { TomlJsonClient } from "./TomlJsonClient";

export const metadata: Metadata = buildPageMeta({
  title: "TOML to JSON & JSON to TOML Converter",
  description:
    "Convert TOML (Tom's Obvious, Minimal Language) files to JSON and vice versa. Perfect for migrating configuration files.",
  path: "/tools/toml-json",
});

export default function TomlJsonPage() {
  return (
    <>
      <TomlJsonClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is TOML?</h2>
        <p className="text-muted leading-relaxed mb-6">
          TOML (Tom's Obvious, Minimal Language) is a configuration file format that is easy to read and write. It is designed to map unambiguously to a hash table (dictionary/object). 
          It has become extremely popular as the configuration format of choice for modern package managers and toolchains like Rust (Cargo), Python (Poetry), and Go.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">TOML vs JSON</h3>
        <p className="text-muted leading-relaxed mb-6">
          While JSON is great for data serialization over networks, it lacks comments and can be overly verbose with brackets and quotes, making it tedious for human-edited configuration files. 
          TOML provides a cleaner syntax for settings, supporting comments, native dates, and multi-line strings, while still parsing into exactly the same data structures as JSON.
        </p>
      </div>
    </>
  );
}
