export interface LineSortConfig {
  sortOrder: "none" | "asc" | "desc";
  removeDuplicates: boolean;
  removeEmptyLines: boolean;
  caseSensitive: boolean;
  reverseLines: boolean;
}

export function processLines(input: string, config: LineSortConfig): string {
  if (!input) return "";

  // Split by newlines (handles both \n and \r\n)
  let lines = input.split(/\r?\n/);

  if (config.removeEmptyLines) {
    lines = lines.filter(line => line.trim().length > 0);
  }

  if (config.removeDuplicates) {
    if (config.caseSensitive) {
      lines = Array.from(new Set(lines));
    } else {
      const seen = new Set<string>();
      lines = lines.filter(line => {
        const lower = line.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });
    }
  }

  if (config.sortOrder !== "none") {
    lines.sort((a, b) => {
      const compareA = config.caseSensitive ? a : a.toLowerCase();
      const compareB = config.caseSensitive ? b : b.toLowerCase();
      
      if (compareA < compareB) return config.sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return config.sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  if (config.reverseLines && config.sortOrder === "none") {
    lines.reverse();
  }

  return lines.join("\n");
}
