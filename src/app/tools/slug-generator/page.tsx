import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { SlugGeneratorClient } from "./SlugGeneratorClient";

export const metadata: Metadata = buildPageMeta({
  title: "URL Slug Generator & Converter",
  description:
    "Convert article titles and strings into SEO-friendly URL slugs. Removes stop words, normalizes accents, and formats cleanly.",
  path: "/tools/slug-generator",
});

export default function SlugGeneratorPage() {
  return (
    <>
      <SlugGeneratorClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a URL Slug?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A slug is the part of a URL that identifies a particular page on a website in an easy-to-read form. 
          For example, in the URL <code>https://example.com/blog/what-is-a-slug</code>, the slug is <code>what-is-a-slug</code>.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">SEO Best Practices for Slugs</h3>
        <ul className="space-y-2 text-muted list-none pl-0">
          <li><strong>Keep it short:</strong> Shorter URLs are easier to copy, paste, and share. They also display fully in Google search results.</li>
          <li><strong>Use dashes (-):</strong> Google explicitly recommends using hyphens (-) instead of underscores (_) to separate words in URLs.</li>
          <li><strong>Remove Stop Words:</strong> Words like "a", "the", and "and" add length to your URL without adding any SEO value. Our tool can remove these automatically.</li>
        </ul>
      </div>
    </>
  );
}
