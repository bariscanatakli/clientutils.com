import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

export interface HashResult {
  algorithm: string;
  hash: string;
}

// Convert string to ArrayBuffer for Web Crypto API
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

// Convert ArrayBuffer to Hex String
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHashes(input: string, bcryptRounds: number = 10): Promise<HashResult[]> {
  if (!input) {
    return [
      { algorithm: "MD5", hash: "" },
      { algorithm: "SHA-1", hash: "" },
      { algorithm: "SHA-256", hash: "" },
      { algorithm: "SHA-512", hash: "" },
      { algorithm: "bcrypt", hash: "" },
    ];
  }

  // Calculate MD5 synchronously
  const md5Hash = CryptoJS.MD5(input).toString();

  // Calculate SHA hashes using Web Crypto API (fast & native)
  const buffer = stringToArrayBuffer(input);
  const [sha1Buffer, sha256Buffer, sha512Buffer] = await Promise.all([
    crypto.subtle.digest("SHA-1", buffer),
    crypto.subtle.digest("SHA-256", buffer),
    crypto.subtle.digest("SHA-512", buffer)
  ]);

  const sha1Hash = arrayBufferToHex(sha1Buffer);
  const sha256Hash = arrayBufferToHex(sha256Buffer);
  const sha512Hash = arrayBufferToHex(sha512Buffer);

  // Calculate bcrypt synchronously (or rather, we yield via a promise to not block UI if it's slow)
  // Generating bcrypt on the main thread can be slow for rounds > 12, but we keep default to 10.
  const bcryptHash = await new Promise<string>((resolve) => {
    // Small timeout to allow UI to render the fast hashes first
    setTimeout(() => {
      const salt = bcrypt.genSaltSync(bcryptRounds);
      resolve(bcrypt.hashSync(input, salt));
    }, 10);
  });

  return [
    { algorithm: "MD5", hash: md5Hash },
    { algorithm: "SHA-1", hash: sha1Hash },
    { algorithm: "SHA-256", hash: sha256Hash },
    { algorithm: "SHA-512", hash: sha512Hash },
    { algorithm: "bcrypt", hash: bcryptHash },
  ];
}

export async function verifyHash(input: string, knownHash: string, isBcrypt: boolean): Promise<boolean> {
  if (!input || !knownHash) return false;

  if (isBcrypt) {
    try {
      return bcrypt.compareSync(input, knownHash);
    } catch {
      return false;
    }
  } else {
    // For normal hashes, we just generate all and check if any match
    const hashes = await generateHashes(input, 10); // bcrypt round doesn't matter here
    // Exclude bcrypt from direct equality check
    const normalHashes = hashes.filter(h => h.algorithm !== "bcrypt").map(h => h.hash.toLowerCase());
    return normalHashes.includes(knownHash.toLowerCase());
  }
}
