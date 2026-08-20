export type Base64Variant = "standard" | "url";

export interface Base64DecodeResult {
  bytes: Uint8Array;
  error: string | null;
  mimeType: string | null;
  isDataUri: boolean;
  variant: Base64Variant;
  normalized: string;
}

export const MAX_BASE64_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_BASE64_TEXT_BYTES = 8 * 1024 * 1024;

function binaryFromBytes(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return binary;
}

export function encodeBytes(bytes: Uint8Array, variant: Base64Variant = "standard", includePadding = true): string {
  let encoded = btoa(binaryFromBytes(bytes));
  if (variant === "url") encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_");
  return includePadding ? encoded : encoded.replace(/=+$/, "");
}

export function encodeText(text: string, variant: Base64Variant = "standard", includePadding = true): string {
  return encodeBytes(new TextEncoder().encode(text), variant, includePadding);
}

function emptyDecode(error: string): Base64DecodeResult {
  return { bytes: new Uint8Array(), error, mimeType: null, isDataUri: false, variant: "standard", normalized: "" };
}

function parseInput(input: string): { payload: string; mimeType: string | null; isDataUri: boolean } | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { error: "Enter Base64 content to decode." };
  if (!trimmed.toLowerCase().startsWith("data:")) return { payload: trimmed.replace(/\s/g, ""), mimeType: null, isDataUri: false };
  const comma = trimmed.indexOf(",");
  if (comma < 0) return { error: "The data URI is missing its comma separator." };
  const header = trimmed.slice(5, comma);
  if (!/(?:^|;)base64(?:;|$)/i.test(header)) return { error: "Only base64-encoded data URIs are supported." };
  const mimeType = header.split(";")[0] || "application/octet-stream";
  if (!/^[\w.+-]+\/[\w.+-]+$/.test(mimeType)) return { error: "The data URI contains an invalid media type." };
  return { payload: trimmed.slice(comma + 1).replace(/\s/g, ""), mimeType, isDataUri: true };
}

export function decodeBase64(input: string): Base64DecodeResult {
  const parsed = parseInput(input);
  if ("error" in parsed) return emptyDecode(parsed.error);
  const payload = parsed.payload;
  if (!payload) return emptyDecode("The Base64 payload is empty.");
  if (/[^A-Za-z0-9+/_=-]/.test(payload)) return emptyDecode("Base64 contains characters outside the standard or URL-safe alphabet.");
  if (/[+\/]/.test(payload) && /[-_]/.test(payload)) return emptyDecode("Do not mix standard (+, /) and URL-safe (-, _) alphabets.");
  if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(payload)) return emptyDecode("Padding (=) is only allowed at the end, at most twice.");
  const withoutPadding = payload.replace(/=+$/, "");
  if (withoutPadding.length % 4 === 1) return emptyDecode("Base64 has an impossible length. Check for missing characters.");
  const variant: Base64Variant = /[-_]/.test(withoutPadding) ? "url" : "standard";
  const standard = withoutPadding.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = standard + "=".repeat((4 - standard.length % 4) % 4);
  try {
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const canonical = encodeBytes(bytes, variant, false);
    const comparable = variant === "url" ? withoutPadding : withoutPadding;
    if (canonical !== comparable) return emptyDecode("Base64 is not canonical; its final padding bits are invalid.");
    return { bytes, error: null, mimeType: parsed.mimeType, isDataUri: parsed.isDataUri, variant, normalized: encodeBytes(bytes, variant, true) };
  } catch {
    return emptyDecode("Invalid Base64 encoding.");
  }
}

export function decodeText(input: string): { text: string; error: string | null; details: Base64DecodeResult } {
  const details = decodeBase64(input);
  if (details.error) return { text: "", error: details.error, details };
  try {
    return { text: new TextDecoder("utf-8", { fatal: true }).decode(details.bytes), error: null, details };
  } catch {
    return { text: "", error: "Decoded bytes are not valid UTF-8 text. Use File decode to download the binary data.", details };
  }
}

export function toDataUri(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`;
}

export function getBase64Stats(input: string) {
  const decoded = decodeBase64(input);
  return {
    encodedCharacters: input.replace(/\s/g, "").length,
    decodedBytes: decoded.error ? null : decoded.bytes.length,
    formattedDecodedSize: decoded.error ? "Unknown" : formatBytes(decoded.bytes.length),
    error: decoded.error,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${Number((bytes / 1024 ** index).toFixed(2))} ${units[index]}`;
}
