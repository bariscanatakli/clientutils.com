import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { HashGeneratorClient } from "./HashGeneratorClient";

export const metadata: Metadata = buildPageMeta({
  title: "Hash Generator & Verifier (MD5, SHA, bcrypt)",
  description:
    "Generate MD5, SHA-1, SHA-256, SHA-512, and bcrypt hashes simultaneously. Verify existing hashes securely. 100% client-side processing.",
  path: "/tools/hash-generator",
});

export default function HashGeneratorPage() {
  return (
    <>
      <HashGeneratorClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-5xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a Cryptographic Hash?</h2>
        <p className="text-muted leading-relaxed mb-6">
          A cryptographic hash function is a mathematical algorithm that maps data of arbitrary size to a bit array of a fixed size (the "hash"). 
          It is a one-way function, meaning it is practically impossible to invert the process and retrieve the original data from the hash alone.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Common Hashing Algorithms</h3>
        <ul className="space-y-3 text-muted list-none pl-0">
          <li>
            <strong className="text-foreground">MD5:</strong> 
            Produces a 128-bit hash value. While still widely used as a checksum to verify data integrity (like downloading files), it is <span className="text-danger font-semibold">cryptographically broken</span> and vulnerable to collision attacks. Do not use MD5 for passwords.
          </li>
          <li>
            <strong className="text-foreground">SHA-256 / SHA-512:</strong> 
            Part of the SHA-2 family. They provide strong cryptographic security and are widely used in TLS/SSL, blockchain, and digital signatures.
          </li>
          <li>
            <strong className="text-foreground">bcrypt:</strong> 
            A password hashing function designed specifically to be computationally expensive to resist brute-force attacks. It automatically handles "salting" (adding random data to the input) to protect against rainbow table attacks.
          </li>
        </ul>
      </div>
    </>
  );
}
