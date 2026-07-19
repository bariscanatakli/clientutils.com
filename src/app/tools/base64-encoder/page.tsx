import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { Base64EncoderClient } from "./Base64EncoderClient";

export const metadata: Metadata = buildPageMeta({
  title: "Base64 Encoder & Decoder",
  description:
    "Encode and decode text or files to Base64 format instantly. Support for image previews and data URI extraction. 100% secure, client-side processing.",
  path: "/tools/base64-encoder",
});

export default function Base64EncoderPage() {
  return (
    <>
      <Base64EncoderClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is Base64 Encoding?</h2>
        <p className="text-muted leading-relaxed mb-6">
          Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation. 
          The term Base64 originates from a specific MIME content transfer encoding.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Why use Base64?</h3>
        <ul className="space-y-3 text-muted list-none pl-0">
          <li>
            <strong className="text-foreground">Data embedding:</strong> 
            It is commonly used to embed image files or other binary assets inside HTML, CSS, or JSON files. This reduces the number of HTTP requests required to load a web page.
          </li>
          <li>
            <strong className="text-foreground">Email attachments:</strong> 
            MIME uses Base64 to encode email attachments so they can be safely transmitted over SMTP, which was originally designed for 7-bit ASCII text.
          </li>
          <li>
            <strong className="text-foreground">Safe URL transmission:</strong> 
            Since Base64 encoded strings only contain letters, numbers, and basic symbols (`+`, `/`, `=`), they can be safely passed in URLs (sometimes using a URL-safe variant where `+` and `/` are replaced).
          </li>
        </ul>
        
        <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <p className="text-warning-foreground font-semibold m-0 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Security Note
          </p>
          <p className="text-muted mt-2 mb-0">
            Base64 is an <strong>encoding</strong> method, not an <strong>encryption</strong> method. It provides no security or obfuscation. 
            Anyone with access to the Base64 string can decode it back to its original form. Do not use Base64 to hide passwords or sensitive data.
          </p>
        </div>
      </div>
    </>
  );
}
