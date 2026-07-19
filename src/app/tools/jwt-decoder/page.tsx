import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/constants/seo";
import { JwtDecoderClient } from "./JwtDecoderClient";

export const metadata: Metadata = buildPageMeta({
  title: "JWT Decoder",
  description:
    "Decode JSON Web Tokens (JWT) instantly. View headers, payloads, and signatures. 100% secure, client-side processing. Your tokens are never sent to a server.",
  path: "/tools/jwt-decoder",
});

export default function JwtDecoderPage() {
  return (
    <>
      <JwtDecoderClient />

      {/* SEO & Context Content */}
      <div className="mt-16 mx-auto max-w-6xl pt-8 border-t border-border prose prose-sm dark:prose-invert">
        <h2 className="text-lg font-semibold text-foreground mb-4">What is a JSON Web Token (JWT)?</h2>
        <p className="text-muted leading-relaxed mb-6">
          JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. 
          This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
        </p>

        <h3 className="text-md font-semibold text-foreground mb-3">Structure of a JWT</h3>
        <p className="text-muted leading-relaxed mb-4">
          In its compact form, JSON Web Tokens consist of three parts separated by dots (<code>.</code>), which are:
        </p>
        
        <ul className="space-y-3 text-muted list-none pl-0">
          <li>
            <strong className="text-danger">Header:</strong> 
            Typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.
          </li>
          <li>
            <strong className="text-primary">Payload:</strong> 
            Contains the claims. Claims are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.
          </li>
          <li>
            <strong className="text-info">Signature:</strong> 
            To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.
          </li>
        </ul>
      </div>
    </>
  );
}
