export const MAX_JWT_LENGTH = 100_000;

export interface JwtPart {
  raw: string;
  decoded: Record<string, unknown> | null;
  json: string | null;
  error: string | null;
}

export type JwtTimeStatus = "active" | "expired" | "not-active" | "future-issued" | "no-time-claims" | "invalid";

export interface JwtTimeClaim {
  name: "exp" | "nbf" | "iat";
  label: string;
  value: unknown;
  iso: string | null;
  status: "past" | "future" | "now" | "invalid";
  message: string;
}

export interface JwtDecodeResult {
  isDecodable: boolean;
  header: JwtPart;
  payload: JwtPart;
  signature: string;
  signatureBytes: number | null;
  signingInput: string;
  algorithm: string | null;
  tokenType: string | null;
  timeClaims: JwtTimeClaim[];
  timeStatus: JwtTimeStatus;
  warnings: string[];
  error: string | null;
}

const EMPTY_PART: JwtPart = { raw: "", decoded: null, json: null, error: null };
const BASE64URL_RE = /^[A-Za-z0-9_-]+$/;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function decodeBase64Url(value: string): { bytes: Uint8Array; error: string | null } {
  if (!value) return { bytes: new Uint8Array(), error: "Segment is empty." };
  if (!BASE64URL_RE.test(value)) return { bytes: new Uint8Array(), error: "Segment must use unpadded Base64URL characters only." };
  if (value.length % 4 === 1) return { bytes: new Uint8Array(), error: "Segment has an impossible Base64URL length." };
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    if (bytesToBase64Url(bytes) !== value) return { bytes: new Uint8Array(), error: "Segment is not canonical Base64URL." };
    return { bytes, error: null };
  } catch {
    return { bytes: new Uint8Array(), error: "Segment is not valid Base64URL." };
  }
}

function parseJsonPart(raw: string, label: string): JwtPart {
  const decoded = decodeBase64Url(raw);
  if (decoded.error) return { raw, decoded: null, json: null, error: `${label}: ${decoded.error}` };
  let json: string;
  try {
    json = new TextDecoder("utf-8", { fatal: true }).decode(decoded.bytes);
  } catch {
    return { raw, decoded: null, json: null, error: `${label}: decoded bytes are not valid UTF-8.` };
  }
  try {
    const value: unknown = JSON.parse(json);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { raw, decoded: null, json, error: `${label}: JSON must be an object.` };
    return { raw, decoded: value as Record<string, unknown>, json, error: null };
  } catch {
    return { raw, decoded: null, json, error: `${label}: decoded text is not valid JSON.` };
  }
}

function inspectNumericDate(name: JwtTimeClaim["name"], value: unknown, nowSeconds: number): JwtTimeClaim {
  const labels = { exp: "Expiration", nbf: "Not before", iat: "Issued at" } as const;
  if (typeof value !== "number" || !Number.isFinite(value)) return { name, label: labels[name], value, iso: null, status: "invalid", message: `${name} must be a finite NumericDate in seconds.` };
  const date = new Date(value * 1000);
  if (!Number.isFinite(date.getTime())) return { name, label: labels[name], value, iso: null, status: "invalid", message: `${name} is outside the supported date range.` };
  const status = value < nowSeconds ? "past" : value > nowSeconds ? "future" : "now";
  const relation = status === "past" ? "before" : status === "future" ? "after" : "equal to";
  return { name, label: labels[name], value, iso: date.toISOString(), status, message: `${name} is ${relation} this browser's current clock.` };
}

function getTimeStatus(claims: JwtTimeClaim[], nowSeconds: number): JwtTimeStatus {
  if (claims.some((claim) => claim.status === "invalid")) return "invalid";
  const exp = claims.find((claim) => claim.name === "exp");
  if (exp && typeof exp.value === "number" && nowSeconds >= exp.value) return "expired";
  const nbf = claims.find((claim) => claim.name === "nbf");
  if (nbf && typeof nbf.value === "number" && nowSeconds < nbf.value) return "not-active";
  const iat = claims.find((claim) => claim.name === "iat");
  if (iat && typeof iat.value === "number" && nowSeconds < iat.value) return "future-issued";
  return claims.length ? "active" : "no-time-claims";
}

export function decodeJWT(token: string, nowMs = Date.now()): JwtDecodeResult {
  const input = token.trim();
  const empty = (error: string): JwtDecodeResult => ({ isDecodable: false, header: EMPTY_PART, payload: EMPTY_PART, signature: "", signatureBytes: null, signingInput: "", algorithm: null, tokenType: null, timeClaims: [], timeStatus: "no-time-claims", warnings: [], error });
  if (!input) return empty("Paste a compact JWT to inspect it.");
  if (input.length > MAX_JWT_LENGTH) return empty(`Token exceeds the ${MAX_JWT_LENGTH.toLocaleString()} character browser limit.`);
  if (/\s/u.test(input)) return empty("Compact JWTs cannot contain spaces or line breaks.");
  const parts = input.split(".");
  if (parts.length !== 3) return empty("A compact JWT must contain exactly three dot-separated segments.");

  const header = parseJsonPart(parts[0], "Header");
  const payload = parseJsonPart(parts[1], "Payload");
  const algorithm = typeof header.decoded?.alg === "string" && header.decoded.alg ? header.decoded.alg : null;
  const tokenType = typeof header.decoded?.typ === "string" ? header.decoded.typ : null;
  const signatureResult = parts[2] ? decodeBase64Url(parts[2]) : { bytes: new Uint8Array(), error: algorithm === "none" ? null : "Signature segment is empty." };
  const structuralError = header.error ?? payload.error ?? (!algorithm ? "Header: alg must be a non-empty string." : null) ?? (signatureResult.error ? `Signature: ${signatureResult.error}` : null);
  const warnings = ["Decoded only: the signature, issuer, audience and token policy have not been verified."];
  if (algorithm === "none") warnings.push("Critical: alg is none, so this token is unsigned and must not be trusted for authorization.");
  else if (algorithm?.startsWith("HS")) warnings.push("HMAC algorithms use a shared secret. Verify with the expected server-side algorithm and secret; never trust the decoded alg value alone.");
  else if (algorithm) warnings.push(`The header requests ${algorithm}. A trusted verifier must allow that algorithm and use the correct verification key.`);
  if (header.decoded && "crit" in header.decoded) warnings.push("The crit header is present. This inspector does not process critical header extensions.");
  const timeClaims = payload.decoded ? (["exp", "nbf", "iat"] as const).filter((name) => name in payload.decoded!).map((name) => inspectNumericDate(name, payload.decoded![name], nowMs / 1000)) : [];
  return { isDecodable: !structuralError, header, payload, signature: parts[2], signatureBytes: signatureResult.error ? null : signatureResult.bytes.length, signingInput: `${parts[0]}.${parts[1]}`, algorithm, tokenType, timeClaims, timeStatus: getTimeStatus(timeClaims, nowMs / 1000), warnings, error: structuralError };
}

export function getClaimDescription(claim: string): string {
  const map: Record<string, string> = {
    iss: "Issuer", sub: "Subject", aud: "Audience", exp: "Expiration time", nbf: "Not before", iat: "Issued at", jti: "JWT ID",
    name: "Full name", given_name: "Given name", family_name: "Family name", email: "Email address", role: "User role", scp: "Scopes", scope: "Scopes",
    azp: "Authorized party", nonce: "Replay-binding value", sid: "Session ID", auth_time: "Authentication time",
  };
  return map[claim] || "Custom claim";
}
