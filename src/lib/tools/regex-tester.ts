export interface RegexMatch {
  index: number;
  length: number;
  text: string;
  groups: (string | undefined)[];
}

export interface RegexTestResult {
  isValid: boolean;
  error: string | null;
  matches: RegexMatch[];
  execTimeMs: number;
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  if (!pattern) {
    return { isValid: true, error: null, matches: [], execTimeMs: 0 };
  }

  const start = performance.now();
  try {
    // Re-create regex to avoid state mutation
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    // If global flag is not set, matchAll will throw, so we handle it
    if (regex.global) {
      let match;
      // Prevent infinite loops from bad regex or zero-length matches
      let iterations = 0;
      const MAX_ITERATIONS = 10000;

      while ((match = regex.exec(text)) !== null) {
        if (iterations++ > MAX_ITERATIONS) break;
        
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          groups: match.slice(1),
        });

        // Prevent infinite loop if regex matches empty string
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          groups: match.slice(1),
        });
      }
    }

    const end = performance.now();
    return {
      isValid: true,
      error: null,
      matches,
      execTimeMs: Math.round((end - start) * 100) / 100,
    };
  } catch (err) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : "Geçersiz Regex",
      matches: [],
      execTimeMs: 0,
    };
  }
}
