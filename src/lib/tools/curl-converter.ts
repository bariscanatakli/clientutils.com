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

type Literal = string | number | boolean | null | Literal[] | { [key: string]: Literal };

function isLiteralObject(value: Literal | undefined): value is { [key: string]: Literal } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class AxiosLiteralParser {
  private index = 0;
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  parseArguments(): Literal[] {
    const values: Literal[] = [];
    this.skipWhitespace();
    if (this.index === this.source.length) return values;
    while (this.index < this.source.length) {
      values.push(this.parseValue());
      this.skipWhitespace();
      if (this.source[this.index] !== ",") break;
      this.index += 1;
      this.skipWhitespace();
    }
    this.skipWhitespace();
    if (this.index !== this.source.length) this.fail("Only literal Axios arguments are supported");
    return values;
  }

  private parseValue(): Literal {
    this.skipWhitespace();
    const character = this.source[this.index];
    if (character === '"' || character === "'" || character === "`") return this.parseString(character);
    if (character === "{") return this.parseObject();
    if (character === "[") return this.parseArray();
    if (this.source.startsWith("true", this.index)) return this.consumeKeyword("true", true);
    if (this.source.startsWith("false", this.index)) return this.consumeKeyword("false", false);
    if (this.source.startsWith("null", this.index)) return this.consumeKeyword("null", null);

    const number = this.source.slice(this.index).match(/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i)?.[0];
    if (number) {
      this.index += number.length;
      return Number(number);
    }
    this.fail("Variables, functions, spreads, and computed expressions cannot be converted safely");
  }

  private parseString(quote: string): string {
    this.index += 1;
    let value = "";
    while (this.index < this.source.length) {
      const character = this.source[this.index];
      this.index += 1;
      if (character === quote) return value;
      if (quote === "`" && character === "$" && this.source[this.index] === "{") {
        this.fail("Template literal interpolation is not supported; replace it with a concrete value");
      }
      if (character !== "\\") {
        value += character;
        continue;
      }
      if (this.index >= this.source.length) this.fail("Unterminated escape sequence");
      const escaped = this.source[this.index];
      this.index += 1;
      const escapes: Record<string, string> = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", "0": "\0" };
      if (escaped === "u" || escaped === "x") {
        const length = escaped === "u" ? 4 : 2;
        const hex = this.source.slice(this.index, this.index + length);
        if (!new RegExp(`^[0-9a-fA-F]{${length}}$`).test(hex)) this.fail("Invalid hexadecimal string escape");
        value += String.fromCharCode(Number.parseInt(hex, 16));
        this.index += length;
      } else {
        value += escapes[escaped] ?? escaped;
      }
    }
    this.fail("Unterminated string literal");
  }

  private parseObject(): { [key: string]: Literal } {
    const result: { [key: string]: Literal } = {};
    this.index += 1;
    this.skipWhitespace();
    while (this.source[this.index] !== "}") {
      if (this.index >= this.source.length) this.fail("Unterminated object literal");
      const keyCharacter = this.source[this.index];
      let key: string;
      if (keyCharacter === '"' || keyCharacter === "'") {
        key = this.parseString(keyCharacter);
      } else {
        const match = this.source.slice(this.index).match(/^[A-Za-z_$][\w$-]*/)?.[0];
        if (!match) this.fail("Object keys must be plain identifiers or strings");
        key = match;
        this.index += match.length;
      }
      this.skipWhitespace();
      if (this.source[this.index] !== ":") this.fail(`Expected a colon after ${key}`);
      this.index += 1;
      result[key] = this.parseValue();
      this.skipWhitespace();
      if (this.source[this.index] === ",") {
        this.index += 1;
        this.skipWhitespace();
        if (this.source[this.index] === "}") break;
      } else if (this.source[this.index] !== "}") {
        this.fail("Expected a comma between object properties");
      }
    }
    this.index += 1;
    return result;
  }

  private parseArray(): Literal[] {
    const result: Literal[] = [];
    this.index += 1;
    this.skipWhitespace();
    while (this.source[this.index] !== "]") {
      if (this.index >= this.source.length) this.fail("Unterminated array literal");
      result.push(this.parseValue());
      this.skipWhitespace();
      if (this.source[this.index] === ",") {
        this.index += 1;
        this.skipWhitespace();
        if (this.source[this.index] === "]") break;
      } else if (this.source[this.index] !== "]") {
        this.fail("Expected a comma between array items");
      }
    }
    this.index += 1;
    return result;
  }

  private consumeKeyword<T extends boolean | null>(keyword: string, value: T): T {
    this.index += keyword.length;
    return value;
  }

  private skipWhitespace() {
    while (/\s/.test(this.source[this.index] ?? "")) this.index += 1;
  }

  private fail(message: string): never {
    throw new Error(`${message} near character ${this.index + 1}.`);
  }
}

function axiosCall(source: string): { method?: string; argumentsSource: string } {
  const match = /\baxios(?:\.(get|post|put|patch|delete|head|options|request))?\s*\(/i.exec(source);
  if (!match) throw new Error("Add an axios(...), axios.request(...), or axios.get/post/... call.");
  const start = match.index + match[0].length;
  let quote: string | null = null;
  let escaped = false;
  let depth = 1;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\" && quote) {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") quote = character;
    else if (character === "(") depth += 1;
    else if (character === ")") {
      depth -= 1;
      if (depth === 0) return { method: match[1]?.toUpperCase(), argumentsSource: source.slice(start, index) };
    }
  }
  throw new Error("The Axios call has an unmatched parenthesis.");
}

function textValue(value: Literal | undefined, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  throw new Error(`${field} must be a literal string, number, or boolean.`);
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function requestFromAxios(source: string): ParsedCurl {
  const call = axiosCall(source);
  const args = new AxiosLiteralParser(call.argumentsSource).parseArguments();
  let config: { [key: string]: Literal } = {};
  let data: Literal | undefined;
  let url: string | undefined;

  if (call.method && call.method !== "REQUEST") {
    url = textValue(args[0], "URL");
    if (["POST", "PUT", "PATCH"].includes(call.method)) {
      data = args[1];
      if (isLiteralObject(args[2])) config = args[2];
    } else if (isLiteralObject(args[1])) config = args[1];
  } else if (isLiteralObject(args[0])) {
    config = args[0];
  } else {
    url = textValue(args[0], "URL");
    if (isLiteralObject(args[1])) config = args[1];
  }

  url ??= textValue(config.url, "config.url");
  const baseUrl = textValue(config.baseURL, "config.baseURL");
  if (url && baseUrl && !/^https?:\/\//i.test(url)) url = new URL(url, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`).toString();
  if (!url) throw new Error("Add a literal URL as the first argument or config.url.");
  if (!/^https?:\/\//i.test(url)) throw new Error("Use a complete http:// or https:// URL, or provide config.baseURL.");

  if (isLiteralObject(config.params)) {
    const parsedUrl = new URL(url);
    for (const [key, value] of Object.entries(config.params)) {
      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        const text = textValue(item, `params.${key}`);
        if (text !== undefined) parsedUrl.searchParams.append(key, text);
      }
    }
    url = parsedUrl.toString();
  } else if (config.params !== undefined) {
    throw new Error("config.params must be a literal object.");
  }

  const headers: Record<string, string> = {};
  if (isLiteralObject(config.headers)) {
    for (const [name, value] of Object.entries(config.headers)) {
      const text = textValue(value, `headers.${name}`);
      if (text !== undefined) headers[name] = text;
    }
  } else if (config.headers !== undefined) {
    throw new Error("config.headers must be a literal object.");
  }

  let auth: ParsedCurl["auth"];
  if (isLiteralObject(config.auth)) {
    const username = textValue(config.auth.username, "auth.username");
    const password = textValue(config.auth.password, "auth.password");
    if (username === undefined) throw new Error("auth.username is required when auth is present.");
    auth = { username, password: password ?? "" };
  } else if (config.auth !== undefined) {
    throw new Error("config.auth must be a literal object.");
  }

  data ??= config.data;
  const method = call.method && call.method !== "REQUEST" ? call.method : textValue(config.method, "config.method")?.toUpperCase() ?? (data === undefined ? "GET" : "POST");
  return { url, method, headers, data: data === undefined ? undefined : typeof data === "string" ? data : JSON.stringify(data), auth };
}

function toCurl(request: ParsedCurl): string {
  const parts = [`curl --request ${request.method} ${shellQuote(request.url)}`];
  for (const [name, value] of Object.entries(request.headers)) parts.push(`--header ${shellQuote(`${name}: ${value}`)}`);
  if (request.auth) parts.push(`--user ${shellQuote(`${request.auth.username}:${request.auth.password}`)}`);
  if (request.data !== undefined) {
    if (!Object.keys(request.headers).some((name) => name.toLowerCase() === "content-type") && /^[\[{]/.test(request.data.trim())) {
      parts.push(`--header ${shellQuote("Content-Type: application/json")}`);
    }
    parts.push(`--data-raw ${shellQuote(request.data)}`);
  }
  return parts.join(" \\\n  ");
}

export function convertAxiosToCurl(source: string): CurlResult {
  if (!source.trim()) return { code: "" };
  try {
    return { code: toCurl(requestFromAxios(source)) };
  } catch (error) {
    return { code: "", error: error instanceof Error ? error.message : "Unable to parse this Axios call." };
  }
}
