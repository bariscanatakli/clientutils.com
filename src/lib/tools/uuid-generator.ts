import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7, validate, version } from "uuid";
import { decodeTime, isValid as isValidUlid, ulid } from "ulidx";

export type IdentifierType = "uuid-v4" | "uuid-v1" | "uuid-v7" | "ulid";

export interface GenerateOptions {
  type: IdentifierType;
  count: number;
  uppercase: boolean;
  hyphens: boolean;
}

export interface IdentifierInspection {
  input: string;
  normalized: string;
  valid: boolean;
  family: "uuid" | "ulid" | null;
  typeLabel: string;
  version: number | null;
  variant: string | null;
  timestamp: string | null;
  error: string | null;
}

function uuidVariant(value: string): string {
  const nibble = Number.parseInt(value[19], 16);
  if (nibble < 8) return "NCS legacy";
  if (nibble < 12) return "RFC 9562";
  if (nibble < 14) return "Microsoft legacy";
  return "Reserved";
}

function normalizeUuid(value: string): string {
  const compact = value.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(compact)) return value;
  return `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
}

export function generateIdentifiers(options: GenerateOptions): string[] {
  const count = Math.min(100, Math.max(1, Math.floor(Number.isFinite(options.count) ? options.count : 1)));

  return Array.from({ length: count }, () => {
    let id: string;
    switch (options.type) {
      case "uuid-v1": id = uuidv1(); break;
      case "uuid-v7": id = uuidv7(); break;
      case "ulid": id = ulid(); break;
      default: id = uuidv4();
    }

    if (!options.hyphens && options.type !== "ulid") id = id.replace(/-/g, "");
    return options.uppercase ? id.toUpperCase() : id;
  });
}

export function inspectIdentifier(rawInput: string): IdentifierInspection {
  const input = rawInput.trim();
  const ulidCandidate = input.toUpperCase();

  if (isValidUlid(ulidCandidate)) {
    try {
      return {
        input,
        normalized: ulidCandidate,
        valid: true,
        family: "ulid",
        typeLabel: "ULID",
        version: null,
        variant: "Crockford Base32",
        timestamp: new Date(decodeTime(ulidCandidate)).toISOString(),
        error: null,
      };
    } catch {
      // Fall through to the actionable invalid result below.
    }
  }

  const normalized = normalizeUuid(input);
  if (validate(normalized)) {
    const detectedVersion = version(normalized);
    const typeLabel = detectedVersion === 0 ? "Nil UUID" : detectedVersion === 15 ? "Max UUID" : `UUID v${detectedVersion}`;
    return {
      input,
      normalized,
      valid: true,
      family: "uuid",
      typeLabel,
      version: detectedVersion,
      variant: detectedVersion === 0 || detectedVersion === 15 ? "Special value" : uuidVariant(normalized),
      timestamp: null,
      error: null,
    };
  }

  let error = "Not a valid RFC UUID or ULID.";
  if (!input) error = "Enter an identifier.";
  else if (/^[0-9a-f-]+$/i.test(input) && input.replace(/-/g, "").length !== 32) error = "A UUID needs exactly 32 hexadecimal digits.";
  else if (input.length === 26) error = "A ULID must use valid Crockford Base32 characters and a valid timestamp range.";

  return { input, normalized: input, valid: false, family: null, typeLabel: "Invalid", version: null, variant: null, timestamp: null, error };
}

export function inspectIdentifierList(input: string): IdentifierInspection[] {
  return input
    .split(/[\s,;]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 500)
    .map(inspectIdentifier);
}

export function validateIdentifier(input: string): { valid: boolean; type: string | null } {
  const result = inspectIdentifier(input);
  return { valid: result.valid, type: result.valid ? result.typeLabel : null };
}
