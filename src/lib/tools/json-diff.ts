import * as Diff from "diff";

export interface JsonDiffResult {
  value: string;
  count?: number;
  added?: boolean;
  removed?: boolean;
}

export function compareJson(oldJsonStr: string, newJsonStr: string): JsonDiffResult[] {
  if (!oldJsonStr.trim() && !newJsonStr.trim()) return [];

  try {
    const oldObj = oldJsonStr.trim() ? JSON.parse(oldJsonStr) : {};
    const newObj = newJsonStr.trim() ? JSON.parse(newJsonStr) : {};
    
    return Diff.diffJson(oldObj, newObj);
  } catch {
    // If invalid JSON, fallback to line diff
    return Diff.diffLines(oldJsonStr, newJsonStr);
  }
}
