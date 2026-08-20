import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

export type DigestAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
export type HashFormat = "hex" | "base64";

export interface HashResult {
  algorithm: DigestAlgorithm | "bcrypt";
  hash: string;
  bits: number | null;
  warning?: string;
}

export interface VerifyResult {
  validInput: boolean;
  match: boolean;
  algorithm: DigestAlgorithm | "bcrypt" | null;
  error?: string;
}

const ALL_DIGESTS: DigestAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

function bytesToWordArray(bytes: Uint8Array): CryptoJS.lib.WordArray {
  const words: number[] = [];
  for (let index = 0; index < bytes.length; index += 1) {
    words[index >>> 2] = (words[index >>> 2] ?? 0) | (bytes[index] << (24 - (index % 4) * 8));
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

function formatBuffer(buffer: ArrayBuffer, format: HashFormat): string {
  return format === "hex" ? arrayBufferToHex(buffer) : arrayBufferToBase64(buffer);
}

function digestBits(algorithm: DigestAlgorithm): number {
  return { MD5: 128, "SHA-1": 160, "SHA-256": 256, "SHA-512": 512 }[algorithm];
}

export async function hashData(data: ArrayBuffer, algorithms: DigestAlgorithm[] = ALL_DIGESTS, format: HashFormat = "hex"): Promise<HashResult[]> {
  const bytes = new Uint8Array(data);
  const results = await Promise.all(algorithms.map(async (algorithm): Promise<HashResult> => {
    if (algorithm === "MD5") {
      const wordArray = bytesToWordArray(bytes);
      const hash = CryptoJS.MD5(wordArray).toString(format === "hex" ? CryptoJS.enc.Hex : CryptoJS.enc.Base64);
      return { algorithm, hash, bits: 128, warning: "Legacy checksum only" };
    }
    const digest = await crypto.subtle.digest(algorithm, data);
    return {
      algorithm,
      hash: formatBuffer(digest, format),
      bits: digestBits(algorithm),
      ...(algorithm === "SHA-1" ? { warning: "Legacy checksum only" } : {}),
    };
  }));
  return results;
}

export async function generateTextHashes(input: string, format: HashFormat = "hex", bcryptRounds = 10, includeBcrypt = true): Promise<HashResult[]> {
  const data = new TextEncoder().encode(input).buffer;
  const digests = await hashData(data, ALL_DIGESTS, format);
  if (!includeBcrypt) return digests;
  const rounds = Math.min(12, Math.max(8, Math.floor(bcryptRounds)));
  const hash = await bcrypt.hash(input, rounds);
  return [...digests, { algorithm: "bcrypt", hash, bits: null }];
}

export async function generateHashes(input: string, bcryptRounds = 10): Promise<HashResult[]> {
  return generateTextHashes(input, "hex", bcryptRounds, true);
}

export function detectHashAlgorithm(expectedHash: string): DigestAlgorithm | "bcrypt" | null {
  const hash = expectedHash.trim();
  if (/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash)) return "bcrypt";
  if (!/^[0-9a-f]+$/i.test(hash)) return null;
  return ({ 32: "MD5", 40: "SHA-1", 64: "SHA-256", 128: "SHA-512" } as Record<number, DigestAlgorithm>)[hash.length] ?? null;
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function verifyData(data: ArrayBuffer, expectedHash: string): Promise<VerifyResult> {
  const expected = expectedHash.trim();
  const algorithm = detectHashAlgorithm(expected);
  if (!expected) return { validInput: false, match: false, algorithm: null, error: "Paste an expected hexadecimal digest." };
  if (!algorithm) return { validInput: false, match: false, algorithm: null, error: "Expected digest must be hexadecimal MD5, SHA-1, SHA-256, SHA-512, or a valid bcrypt string." };
  if (algorithm === "bcrypt") return { validInput: false, match: false, algorithm, error: "bcrypt verifies text passwords, not file bytes." };
  const [result] = await hashData(data, [algorithm], "hex");
  return { validInput: true, match: constantTimeEqual(result.hash.toLowerCase(), expected.toLowerCase()), algorithm };
}

export async function verifyTextHash(input: string, expectedHash: string): Promise<VerifyResult> {
  const expected = expectedHash.trim();
  const algorithm = detectHashAlgorithm(expected);
  if (!expected) return { validInput: false, match: false, algorithm: null, error: "Paste an expected hexadecimal digest or bcrypt hash." };
  if (!algorithm) return { validInput: false, match: false, algorithm: null, error: "Could not identify this hash. Use hexadecimal MD5/SHA or a complete bcrypt string." };
  if (algorithm === "bcrypt") {
    try {
      return { validInput: true, match: await bcrypt.compare(input, expected), algorithm };
    } catch {
      return { validInput: false, match: false, algorithm, error: "The bcrypt hash is malformed." };
    }
  }
  return verifyData(new TextEncoder().encode(input).buffer, expected);
}

export async function verifyHash(input: string, knownHash: string): Promise<boolean> {
  return (await verifyTextHash(input, knownHash)).match;
}
