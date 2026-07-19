import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { CaseConverterClient } from "./CaseConverterClient";

export const metadata: Metadata = buildPageMeta({
  title: "Case Converter - CamelCase, Snake_case, PascalCase",
  description:
    "Convert text between all programming and standard casing formats instantly. CamelCase, snake_case, kebab-case, PascalCase, and more.",
  path: "/tools/case-converter",
});

export default function CaseConverterPage() {
  return (
    <>
      <CaseConverterClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">Programming Case Formats Explained</h2>
        <p className="text-muted leading-relaxed mb-6">
          Different programming languages and frameworks have distinct conventions for naming variables, functions, and files. 
          Our case converter intelligently parses your text (even splitting existing camelCase strings) and converts it to the format you need.
        </p>

        <ul className="space-y-4 text-muted list-none pl-0">
          <li>
             <strong className="text-foreground">camelCase:</strong> Words are joined without spaces. The first word is lowercase, and every subsequent word is capitalized. 
             <br/><code className="text-xs bg-code-bg px-1 rounded">exampleVariableName</code> (Standard in JavaScript, Java)
          </li>
          <li>
             <strong className="text-foreground">snake_case:</strong> Words are separated by underscores and are entirely lowercase. 
             <br/><code className="text-xs bg-code-bg px-1 rounded">example_variable_name</code> (Standard in Python, Ruby, Rust)
          </li>
          <li>
             <strong className="text-foreground">PascalCase:</strong> Like camelCase, but the first letter of the first word is also capitalized. 
             <br/><code className="text-xs bg-code-bg px-1 rounded">ExampleClassName</code> (Standard for Classes in most languages, React Components)
          </li>
          <li>
             <strong className="text-foreground">kebab-case:</strong> Words are separated by hyphens. 
             <br/><code className="text-xs bg-code-bg px-1 rounded">example-file-name</code> (Standard for CSS classes, URLs, HTML attributes)
          </li>
          <li>
             <strong className="text-foreground">CONSTANT_CASE:</strong> Words are separated by underscores and entirely uppercase. 
             <br/><code className="text-xs bg-code-bg px-1 rounded">MAX_RETRY_COUNT</code> (Standard for global constants)
          </li>
        </ul>
      </div>
    </>
  );
}
