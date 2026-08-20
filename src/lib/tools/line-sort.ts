export type TrimMode = "none" | "both" | "start" | "end";
export type SortMode = "none" | "alphabetical" | "natural" | "numeric";
export type SortDirection = "asc" | "desc";
export type LineEnding = "lf" | "crlf";

export interface LineSortConfig {
  trimMode: TrimMode;
  removeDuplicates: boolean;
  removeEmptyLines: boolean;
  caseSensitive: boolean;
  sortMode: SortMode;
  sortDirection: SortDirection;
  reverseLines: boolean;
  lineEnding: LineEnding;
}

export interface LineProcessStats {
  inputLines: number;
  outputLines: number;
  trimmedLines: number;
  emptyLinesRemoved: number;
  duplicatesRemoved: number;
  numericLines: number;
  nonNumericLines: number;
}

export interface LineProcessResult {
  output: string;
  stats: LineProcessStats;
}

export const DEFAULT_LINE_SORT_CONFIG: LineSortConfig = {
  trimMode: "both",
  removeDuplicates: true,
  removeEmptyLines: true,
  caseSensitive: false,
  sortMode: "natural",
  sortDirection: "asc",
  reverseLines: false,
  lineEnding: "lf",
};

function trimLine(line: string, mode: TrimMode): string {
  if (mode === "both") return line.trim();
  if (mode === "start") return line.trimStart();
  if (mode === "end") return line.trimEnd();
  return line;
}

function numericValue(line: string): number | null {
  const value = line.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function processLines(input: string, config: LineSortConfig): LineProcessResult {
  if (input === "") {
    return {
      output: "",
      stats: { inputLines: 0, outputLines: 0, trimmedLines: 0, emptyLinesRemoved: 0, duplicatesRemoved: 0, numericLines: 0, nonNumericLines: 0 },
    };
  }

  const sourceLines = input.split(/\r\n|\r|\n/);
  let trimmedLines = 0;
  let emptyLinesRemoved = 0;
  let duplicatesRemoved = 0;
  let lines = sourceLines.map((line) => {
    const transformed = trimLine(line, config.trimMode);
    if (transformed !== line) trimmedLines += 1;
    return transformed;
  });

  if (config.removeEmptyLines) {
    lines = lines.filter((line) => {
      if (line.trim().length > 0) return true;
      emptyLinesRemoved += 1;
      return false;
    });
  }

  if (config.removeDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      const key = config.caseSensitive ? line : line.toLocaleLowerCase("en-US");
      if (!seen.has(key)) {
        seen.add(key);
        return true;
      }
      duplicatesRemoved += 1;
      return false;
    });
  }

  const numericLines = lines.filter((line) => numericValue(line) !== null).length;
  const nonNumericLines = lines.length - numericLines;

  if (config.sortMode !== "none") {
    const collator = new Intl.Collator("en", {
      numeric: config.sortMode === "natural",
      sensitivity: config.caseSensitive ? "variant" : "base",
    });
    const direction = config.sortDirection === "asc" ? 1 : -1;
    lines = lines
      .map((line, index) => ({ line, index }))
      .sort((left, right) => {
        let comparison: number;
        if (config.sortMode === "numeric") {
          const leftNumber = numericValue(left.line);
          const rightNumber = numericValue(right.line);
          if (leftNumber !== null && rightNumber !== null) return (leftNumber - rightNumber) * direction || left.index - right.index;
          if (leftNumber !== null) return -1;
          if (rightNumber !== null) return 1;
          return left.index - right.index;
        } else {
          comparison = collator.compare(left.line, right.line);
        }
        return comparison === 0 ? left.index - right.index : comparison * direction;
      })
      .map(({ line }) => line);
  } else if (config.reverseLines) {
    lines = [...lines].reverse();
  }

  return {
    output: lines.join(config.lineEnding === "crlf" ? "\r\n" : "\n"),
    stats: {
      inputLines: sourceLines.length,
      outputLines: lines.length,
      trimmedLines,
      emptyLinesRemoved,
      duplicatesRemoved,
      numericLines,
      nonNumericLines,
    },
  };
}
