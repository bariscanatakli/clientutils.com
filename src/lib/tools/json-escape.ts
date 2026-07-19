export type EscapeMode = "escape" | "unescape";

export interface JsonEscapeResult {
  data: string;
  error: string | null;
}

export function escapeJson(input: string, mode: EscapeMode): JsonEscapeResult {
  if (!input) return { data: "", error: null };

  try {
    if (mode === "escape") {
      // Stringify escapes newlines, quotes, backslashes. 
      // But it wraps the string in quotes. We strip the first and last quote.
      const stringified = JSON.stringify(input);
      const escaped = stringified.substring(1, stringified.length - 1);
      return { data: escaped, error: null };
    } else {
      // Unescape by parsing a synthetic JSON string
      const parsed = JSON.parse(`"${input}"`);
      return { data: parsed, error: null };
    }
  } catch (err: any) {
    return { data: "", error: err.message || "Invalid syntax" };
  }
}
