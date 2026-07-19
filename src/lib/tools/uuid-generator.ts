import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7, validate } from "uuid";
import { ulid } from "ulidx";

export type IdentifierType = "uuid-v4" | "uuid-v1" | "uuid-v7" | "ulid";

export interface GenerateOptions {
  type: IdentifierType;
  count: number;
  uppercase: boolean;
  hyphens: boolean; // only applies to UUID
}

export function generateIdentifiers(options: GenerateOptions): string[] {
  const { type, count, uppercase, hyphens } = options;
  const results: string[] = [];

  for (let i = 0; i < count; i++) {
    let id = "";

    switch (type) {
      case "uuid-v4":
        id = uuidv4();
        break;
      case "uuid-v1":
        id = uuidv1();
        break;
      case "uuid-v7":
        id = uuidv7();
        break;
      case "ulid":
        id = ulid();
        break;
    }

    if (!hyphens && type !== "ulid") {
      id = id.replace(/-/g, "");
    }

    if (uppercase) {
      id = id.toUpperCase();
    }

    results.push(id);
  }

  return results;
}

export function validateIdentifier(input: string): { valid: boolean; type: string | null } {
  // Simple check for ULID (26 chars, Base32 Crockford)
  const ulidRegex = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i;
  
  if (ulidRegex.test(input)) {
    return { valid: true, type: "ulid" };
  }

  // Use UUID validate for strict checks (supports hyphens)
  const uuidRegexNoHyphens = /^[0-9a-f]{32}$/i;
  
  if (validate(input)) {
    return { valid: true, type: "uuid" };
  } else if (uuidRegexNoHyphens.test(input)) {
    // Add hyphens back to validate with the library just in case
    const withHyphens = `${input.slice(0, 8)}-${input.slice(8, 12)}-${input.slice(12, 16)}-${input.slice(16, 20)}-${input.slice(20)}`;
    if (validate(withHyphens)) {
       return { valid: true, type: "uuid (no hyphens)" };
    }
  }

  return { valid: false, type: null };
}
