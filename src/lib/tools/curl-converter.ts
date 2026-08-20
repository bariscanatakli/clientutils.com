export type TargetLanguage = "axios" | "fetch" | "node-fetch";

export interface CurlResult {
  code: string;
  error?: string;
}

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  auth?: { username: string; password: string };
}

const IGNORED_FLAGS = new Set([
  "-L",
  "--location",
  "-s",
  "--silent",
  "-S",
  "--show-error",
  "--compressed",
  "-k",
  "--insecure",
  "-f",
  "--fail",
]);

const IGNORED_OPTIONS = new Set([
  "-m",
  "--max-time",
  "-o",
  "--output",
  "-x",
  "--proxy",
  "--cert",
  "--key",
  "--cacert",
]);

function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;

  for (let index = 0; index < command.length; index += 1) {
    const character = command[index];

    if (escaped) {
      if (character !== "\n" && character !== "\r") current += character;
      escaped = false;
      continue;
    }

    if (character === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }

    if (quote) {
      if (character === quote) quote = null;
      else current += character;
      continue;
    }

    if (character === "'" || character === '"') {
      quote = character;
    } else if (/\s/.test(character)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += character;
    }
  }

  if (quote) throw new Error("The cURL command has an unmatched quote.");
  if (escaped) current += "\\";
  if (current) tokens.push(current);
  return tokens;
}

function optionValue(tokens: string[], index: number, option: string): string {
  const value = tokens[index + 1];
  if (value === undefined) throw new Error(`${option} requires a value.`);
  return value;
}

function splitHeader(header: string): [string, string] {
  const separator = header.indexOf(":");
  if (separator < 1) throw new Error(`Invalid header "${header}". Use "Name: value".`);
  return [header.slice(0, separator).trim(), header.slice(separator + 1).trim()];
}

function parseCurl(command: string): ParsedCurl {
  const tokens = tokenize(command.trim());
  if (tokens[0]?.toLowerCase() !== "curl") {
    throw new Error("Start the command with curl.");
  }

  let url = "";
  let method = "";
  let data: string | undefined;
  let useQuery = false;
  let auth: ParsedCurl["auth"];
  const headers: Record<string, string> = {};

  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (IGNORED_FLAGS.has(token)) continue;
    if (IGNORED_OPTIONS.has(token)) {
      optionValue(tokens, index, token);
      index += 1;
      continue;
    }
    if (token === "-F" || token === "--form" || token.startsWith("--form=")) {
      throw new Error("Multipart form conversion is not supported yet. Convert file and FormData fields manually.");
    }
    if (token === "-G" || token === "--get") {
      useQuery = true;
      continue;
    }
    if (token === "-X" || token === "--request") {
      method = optionValue(tokens, index, token).toUpperCase();
      index += 1;
      continue;
    }
    if (token.startsWith("-X") && token.length > 2) {
      method = token.slice(2).toUpperCase();
      continue;
    }
    if (token === "-H" || token === "--header") {
      const [name, value] = splitHeader(optionValue(tokens, index, token));
      headers[name] = value;
      index += 1;
      continue;
    }
    if (token.startsWith("-H") && token.length > 2) {
      const [name, value] = splitHeader(token.slice(2));
      headers[name] = value;
      continue;
    }
    if (token === "-d" || token === "--data" || token === "--data-raw" || token === "--data-binary" || token === "--data-urlencode") {
      const value = optionValue(tokens, index, token);
      if (value.startsWith("@")) throw new Error("Local @file request bodies cannot be read in the browser. Paste the file content instead.");
      data = data ? `${data}&${value}` : value;
      index += 1;
      continue;
    }
    if (token.startsWith("--data=") || token.startsWith("--data-raw=") || token.startsWith("--data-binary=") || token.startsWith("--data-urlencode=")) {
      const value = token.slice(token.indexOf("=") + 1);
      if (value.startsWith("@")) throw new Error("Local @file request bodies cannot be read in the browser. Paste the file content instead.");
      data = data ? `${data}&${value}` : value;
      continue;
    }
    if (token.startsWith("-d") && token.length > 2) {
      const value = token.slice(2);
      if (value.startsWith("@")) throw new Error("Local @file request bodies cannot be read in the browser. Paste the file content instead.");
      data = data ? `${data}&${value}` : value;
      continue;
    }
    if (token === "--json") {
      data = optionValue(tokens, index, token);
      headers["Content-Type"] ??= "application/json";
      headers.Accept ??= "application/json";
      index += 1;
      continue;
    }
    if (token === "-u" || token === "--user") {
      const value = optionValue(tokens, index, token);
      const separator = value.indexOf(":");
      auth = { username: separator === -1 ? value : value.slice(0, separator), password: separator === -1 ? "" : value.slice(separator + 1) };
      index += 1;
      continue;
    }
    if (token.startsWith("-u") && token.length > 2) {
      const value = token.slice(2);
      const separator = value.indexOf(":");
      auth = { username: separator === -1 ? value : value.slice(0, separator), password: separator === -1 ? "" : value.slice(separator + 1) };
      continue;
    }
    if (token === "-A" || token === "--user-agent" || token === "-e" || token === "--referer" || token === "-b" || token === "--cookie") {
      const value = optionValue(tokens, index, token);
      const name = token === "-A" || token === "--user-agent" ? "User-Agent" : token === "-e" || token === "--referer" ? "Referer" : "Cookie";
      headers[name] = value;
      index += 1;
      continue;
    }
    if (token === "--url") {
      url = optionValue(tokens, index, token);
      index += 1;
      continue;
    }
    if (token.startsWith("--url=")) {
      url = token.slice(6);
      continue;
    }
    if (token.startsWith("-")) throw new Error(`Unsupported cURL option: ${token}`);
    if (!url) url = token;
  }

  if (!url) throw new Error("Add a request URL to the cURL command.");
  if (!/^https?:\/\//i.test(url)) throw new Error("Use a complete http:// or https:// URL.");

  if (useQuery && data) {
    url += `${url.includes("?") ? "&" : "?"}${data}`;
    data = undefined;
  }

  return { url, method: method || (data ? "POST" : "GET"), headers, data, auth };
}

function parsedBody(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function objectLiteral(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent);
}

function base64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function toAxios(request: ParsedCurl): string {
  const options: string[] = [
    `  method: ${JSON.stringify(request.method)},`,
    `  url: ${JSON.stringify(request.url)},`,
  ];
  if (Object.keys(request.headers).length) options.push(`  headers: ${objectLiteral(request.headers).replace(/\n/g, "\n  ")},`);
  if (request.auth) options.push(`  auth: ${objectLiteral(request.auth).replace(/\n/g, "\n  ")},`);
  if (request.data !== undefined) options.push(`  data: ${objectLiteral(parsedBody(request.data)).replace(/\n/g, "\n  ")},`);

  return `import axios from "axios";\n\nconst response = await axios({\n${options.join("\n")}\n});\n\nconsole.log(response.data);`;
}

function toFetch(request: ParsedCurl, node: boolean): string {
  const headers = { ...request.headers };
  if (request.auth) headers.Authorization = `Basic ${base64(`${request.auth.username}:${request.auth.password}`)}`;
  const options: string[] = [`  method: ${JSON.stringify(request.method)},`];
  if (Object.keys(headers).length) options.push(`  headers: ${objectLiteral(headers).replace(/\n/g, "\n  ")},`);
  if (request.data !== undefined) options.push(`  body: ${JSON.stringify(request.data)},`);
  const importLine = node ? 'import fetch from "node-fetch";\n\n' : "";

  return `${importLine}const response = await fetch(${JSON.stringify(request.url)}, {\n${options.join("\n")}\n});\n\nif (!response.ok) {\n  throw new Error(\`Request failed: \${response.status} \${response.statusText}\`);\n}\n\nconst data = await response.json();\nconsole.log(data);`;
}

export function convertCurl(command: string, target: TargetLanguage): CurlResult {
  if (!command.trim()) return { code: "" };
  try {
    const request = parseCurl(command);
    return { code: target === "axios" ? toAxios(request) : toFetch(request, target === "node-fetch") };
  } catch (error) {
    return { code: "", error: error instanceof Error ? error.message : "Unable to parse this cURL command." };
  }
}
