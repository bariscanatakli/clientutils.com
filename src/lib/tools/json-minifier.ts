export interface JsonMinifyResult {
  data: string;
  error: string | null;
}

export function minifyJson(input: string): JsonMinifyResult {
  if (!input.trim()) return { data: "", error: null };

  try {
    const parsed = JSON.parse(input);
    return { data: JSON.stringify(parsed), error: null };
  } catch (err: any) {
    return { data: "", error: err.message || "Invalid JSON" };
  }
}
