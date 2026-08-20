export interface RegexMatch {
  index: number;
  length: number;
  text: string;
  groups: (string | undefined)[];
  namedGroups: Record<string, string | undefined>;
}

export interface RegexTestResult {
  isValid: boolean;
  error: string | null;
  matches: RegexMatch[];
  replacement: string;
  execTimeMs: number;
  truncated: boolean;
}

export interface RegexWorkerRequest {
  pattern: string;
  flags: string;
  text: string;
  replacement: string;
}

export const MAX_REGEX_INPUT_BYTES = 200_000;
export const MAX_REGEX_MATCHES = 500;
export const REGEX_TIMEOUT_MS = 300;

function invalid(error: string): RegexTestResult {
  return { isValid: false, error, matches: [], replacement: "", execTimeMs: 0, truncated: false };
}

export function validateRegexFlags(flags: string): string | null {
  if (!/^[gimsu]*$/.test(flags)) return "Supported flags are g, i, m, s and u.";
  if (new Set(flags).size !== flags.length) return "Each flag can appear only once.";
  return null;
}

export function evaluateRegex({ pattern, flags, text, replacement }: RegexWorkerRequest): RegexTestResult {
  if (!pattern) return invalid("Enter a regular expression pattern.");
  const flagError = validateRegexFlags(flags);
  if (flagError) return invalid(flagError);
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_REGEX_INPUT_BYTES) return invalid(`Test text is ${bytes.toLocaleString()} bytes. Keep it under ${MAX_REGEX_INPUT_BYTES.toLocaleString()} bytes.`);

  const start = performance.now();
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let truncated = false;

    if (regex.global) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        if (matches.length >= MAX_REGEX_MATCHES) {
          truncated = true;
          break;
        }
        matches.push({ index: match.index, length: match[0].length, text: match[0], groups: match.slice(1), namedGroups: { ...(match.groups ?? {}) } });
        if (match[0].length === 0) {
          const codePoint = text.codePointAt(regex.lastIndex);
          regex.lastIndex += codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) matches.push({ index: match.index, length: match[0].length, text: match[0], groups: match.slice(1), namedGroups: { ...(match.groups ?? {}) } });
    }

    const output = text.replace(new RegExp(pattern, flags), replacement);
    return { isValid: true, error: null, matches, replacement: output, execTimeMs: Math.round((performance.now() - start) * 100) / 100, truncated };
  } catch (error) {
    return invalid(error instanceof Error ? error.message : "Invalid regular expression.");
  }
}

const WORKER_SOURCE = `
const MAX_BYTES = ${MAX_REGEX_INPUT_BYTES};
const MAX_MATCHES = ${MAX_REGEX_MATCHES};
const invalid = (error) => ({ isValid: false, error, matches: [], replacement: "", execTimeMs: 0, truncated: false });
self.onmessage = (event) => {
  const { pattern, flags, text, replacement } = event.data;
  if (!pattern) return self.postMessage(invalid("Enter a regular expression pattern."));
  if (!/^[gimsu]*$/.test(flags)) return self.postMessage(invalid("Supported flags are g, i, m, s and u."));
  if (new Set(flags).size !== flags.length) return self.postMessage(invalid("Each flag can appear only once."));
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_BYTES) return self.postMessage(invalid("Test text is " + bytes.toLocaleString() + " bytes. Keep it under " + MAX_BYTES.toLocaleString() + " bytes."));
  const start = performance.now();
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let truncated = false;
    if (regex.global) {
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (matches.length >= MAX_MATCHES) { truncated = true; break; }
        matches.push({ index: match.index, length: match[0].length, text: match[0], groups: match.slice(1), namedGroups: { ...(match.groups || {}) } });
        if (match[0].length === 0) {
          const codePoint = text.codePointAt(regex.lastIndex);
          regex.lastIndex += codePoint !== undefined && codePoint > 0xffff ? 2 : 1;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) matches.push({ index: match.index, length: match[0].length, text: match[0], groups: match.slice(1), namedGroups: { ...(match.groups || {}) } });
    }
    const output = text.replace(new RegExp(pattern, flags), replacement);
    self.postMessage({ isValid: true, error: null, matches, replacement: output, execTimeMs: Math.round((performance.now() - start) * 100) / 100, truncated });
  } catch (error) {
    self.postMessage(invalid(error instanceof Error ? error.message : "Invalid regular expression."));
  }
};`;

export function runRegexSafely(request: RegexWorkerRequest): { promise: Promise<RegexTestResult>; cancel: () => void } {
  const workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);
  let settled = false;
  let resolvePromise: (result: RegexTestResult) => void = () => undefined;
  const promise = new Promise<RegexTestResult>((resolve) => { resolvePromise = resolve; });
  const finish = (result: RegexTestResult) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    worker.terminate();
    resolvePromise(result);
  };
  const timer = window.setTimeout(() => finish(invalid(`Execution exceeded ${REGEX_TIMEOUT_MS} ms and was stopped. Simplify nested or ambiguous quantifiers.`)), REGEX_TIMEOUT_MS);
  worker.onmessage = (event: MessageEvent<RegexTestResult>) => finish(event.data);
  worker.onerror = () => finish(invalid("The regex worker failed. Try a smaller input or simpler pattern."));
  worker.postMessage(request);
  return { promise, cancel: () => { if (!settled) { settled = true; clearTimeout(timer); worker.terminate(); } } };
}
