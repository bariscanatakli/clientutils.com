export interface JsonParseResult {
  data: unknown;
  isValid: boolean;
  error: string | null;
  errorLine: number | null;
  errorColumn: number | null;
}

function locationFromPosition(input: string, position: number): { line: number; column: number } {
  const beforeError = input.slice(0, Math.max(0, position));
  const lines = beforeError.split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

export function parseJSON(input: string): JsonParseResult {
  if (!input.trim()) return { data: null, isValid: false, error: null, errorLine: null, errorColumn: null };

  try {
    return { data: JSON.parse(input), isValid: true, error: null, errorLine: null, errorColumn: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid JSON syntax";
    const lineColumn = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
    if (lineColumn) {
      return { data: null, isValid: false, error: message, errorLine: Number(lineColumn[1]), errorColumn: Number(lineColumn[2]) };
    }

    const position = message.match(/position\s+(\d+)/i)?.[1];
    if (position !== undefined) {
      const location = locationFromPosition(input, Number(position));
      return { data: null, isValid: false, error: message, errorLine: location.line, errorColumn: location.column };
    }

    return { data: null, isValid: false, error: message, errorLine: null, errorColumn: null };
  }
}

export function formatJSON(data: unknown, indent: number | "tab" = 2): string {
  const space = indent === "tab" ? "\t" : indent;
  try {
    return JSON.stringify(data, null, space) ?? "";
  } catch {
    return "";
  }
}

export function minifyJSON(data: unknown): string {
  try {
    return JSON.stringify(data) ?? "";
  } catch {
    return "";
  }
}

export function jsonByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}
