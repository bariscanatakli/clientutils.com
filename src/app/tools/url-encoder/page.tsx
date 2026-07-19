import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { UrlEncoderClient } from "./UrlEncoderClient";

export const metadata: Metadata = buildPageMeta({
  title: "URL Encoder & Decoder",
  description:
    "Encode and decode URLs instantly and securely. Convert reserved characters into URL-safe formats to ensure your web links function correctly.",
  path: "/tools/url-encoder",
});

export default function UrlEncoderPage() {
  return (
    <>
      <UrlEncoderClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is URL Encoding?</h2>
        <p className="text-muted leading-relaxed mb-6">
          URL Encoding (officially known as percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). 
          URLs can only be sent over the Internet using the ASCII character-set. Since URLs often contain characters outside the ASCII set, they must be converted into a valid ASCII format.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Reserved Characters</h3>
        <p className="text-muted leading-relaxed mb-6">
          Certain characters have special meanings in URLs (like `?` to start a query string, or `&` to separate parameters). If you want to include these characters as actual data in your URL, they must be encoded. 
          For example, a space becomes `%20`, and an ampersand (`&`) becomes `%26`.
        </p>
      </div>
    </>
  );
}
