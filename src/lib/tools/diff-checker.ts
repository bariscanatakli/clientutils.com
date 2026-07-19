import * as Diff from "diff";

export type DiffMode = "lines" | "words" | "chars" | "json";

export interface DiffResult {
  value: string;
  count?: number;
  added?: boolean;
  removed?: boolean;
}

export function compareText(oldText: string, newText: string, mode: DiffMode): DiffResult[] {
  if (!oldText && !newText) return [];

  try {
    switch (mode) {
      case "lines":
        return Diff.diffLines(oldText, newText);
      case "words":
        return Diff.diffWords(oldText, newText);
      case "chars":
        return Diff.diffChars(oldText, newText);
      case "json":
        // diffJson requires objects as inputs. Try parsing strings to objects first.
        try {
          const oldJson = JSON.parse(oldText);
          const newJson = JSON.parse(newText);
          return Diff.diffJson(oldJson, newJson);
        } catch {
          // Fallback to lines if it's invalid JSON
          return Diff.diffLines(oldText, newText);
        }
      default:
        return Diff.diffLines(oldText, newText);
    }
  } catch (err) {
    return [];
  }
}
