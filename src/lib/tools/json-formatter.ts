export interface JsonParseResult {
  data: unknown;
  isValid: boolean;
  error: string | null;
  errorLine: number | null;
}

export function parseJSON(input: string): JsonParseResult {
  if (!input.trim()) {
    return { data: null, isValid: false, error: null, errorLine: null };
  }

  try {
    const data = JSON.parse(input);
    return { data, isValid: true, error: null, errorLine: null };
  } catch (err: unknown) {
    let errorMsg = "Geçersiz JSON formatı";
    let errorLine = null;

    if (err instanceof Error) {
      errorMsg = err.message;
      // Try to extract line number from typical JSON.parse error messages
      // e.g., "Unexpected token } in JSON at position 123" or "at line 5 column 4"
      const lineMatch = errorMsg.match(/line (\d+)/i);
      if (lineMatch && lineMatch[1]) {
        errorLine = parseInt(lineMatch[1], 10);
      } else {
        const posMatch = errorMsg.match(/position (\d+)/i);
        if (posMatch && posMatch[1]) {
          const position = parseInt(posMatch[1], 10);
          // Calculate line number by counting newlines up to the position
          const lines = input.substring(0, position).split('\n');
          errorLine = lines.length;
        }
      }
    }

    return { data: null, isValid: false, error: errorMsg, errorLine };
  }
}

export function formatJSON(data: unknown, indent: number | 'tab' = 2): string {
  if (data === null || data === undefined) return "";
  const space = indent === 'tab' ? '\t' : indent;
  try {
    return JSON.stringify(data, null, space);
  } catch {
    return "";
  }
}

export function minifyJSON(input: string): string {
  const parsed = parseJSON(input);
  if (parsed.isValid) {
    return JSON.stringify(parsed.data);
  }
  return input; // Return original if invalid
}
