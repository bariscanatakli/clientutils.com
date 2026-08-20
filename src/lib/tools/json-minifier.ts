export interface JsonMinifyResult {
  data: string;
  error: string | null;
}

export function minifyJson(input: string): JsonMinifyResult {
  if (!input.trim()) return { data: "", error: null };

  try {
    const parsed = JSON.parse(input);
    return { data: JSON.stringify(parsed), error: null };
  } catch (error: unknown) {
    return { data: "", error: error instanceof Error ? error.message : "Invalid JSON" };
  }
}
