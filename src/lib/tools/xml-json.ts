import { json2xml, xml2json } from "xml-js";

export type XmlJsonIndent = 0 | 2 | 4 | "tab";

export interface XmlToJsonOptions {
  compact: boolean;
  indent: XmlJsonIndent;
  trim: boolean;
  nativeType: boolean;
  alwaysArray: boolean;
  ignoreDeclaration: boolean;
  ignoreComment: boolean;
}

export interface ConversionResult {
  data: string;
  isValid: boolean;
  error: string | null;
  errorLine: number | null;
  errorColumn: number | null;
}

export const DEFAULT_XML_OPTIONS: XmlToJsonOptions = {
  compact: true,
  indent: 2,
  trim: false,
  nativeType: false,
  alwaysArray: false,
  ignoreDeclaration: false,
  ignoreComment: false,
};

function emptyResult(): ConversionResult {
  return { data: "", isValid: true, error: null, errorLine: null, errorColumn: null };
}

function errorResult(error: unknown, fallback: string): ConversionResult {
  const message = error instanceof Error ? error.message : fallback;
  const line = message.match(/Line:\s*(\d+)/i);
  const column = message.match(/Column:\s*(\d+)/i);
  const summary = message.split("\n")[0] || fallback;
  return {
    data: "", isValid: false, error: summary,
    // sax (used by xml-js) reports zero-based line numbers and one-based columns.
    errorLine: line ? Number(line[1]) + 1 : null,
    errorColumn: column ? Number(column[1]) : null,
  };
}

function spaces(indent: XmlJsonIndent): number | string {
  return indent === "tab" ? "\t" : indent;
}

export function convertXmlToJson(
  xml: string,
  options: XmlToJsonOptions | boolean = DEFAULT_XML_OPTIONS,
): ConversionResult {
  if (!xml.trim()) return emptyResult();
  const resolved = typeof options === "boolean"
    ? { ...DEFAULT_XML_OPTIONS, compact: options }
    : options;
  try {
    return {
      data: xml2json(xml, {
        compact: resolved.compact,
        spaces: spaces(resolved.indent),
        trim: resolved.trim,
        nativeType: resolved.nativeType,
        alwaysArray: resolved.compact && resolved.alwaysArray,
        ignoreDeclaration: resolved.ignoreDeclaration,
        ignoreComment: resolved.ignoreComment,
      }),
      isValid: true, error: null, errorLine: null, errorColumn: null,
    };
  } catch (error) {
    return errorResult(error, "Invalid XML");
  }
}

export function convertJsonToXml(
  json: string,
  compact: boolean = true,
  indent: XmlJsonIndent = 2,
): ConversionResult {
  if (!json.trim()) return emptyResult();
  try {
    JSON.parse(json);
    return {
      data: json2xml(json, { compact, spaces: spaces(indent) }),
      isValid: true, error: null, errorLine: null, errorColumn: null,
    };
  } catch (error) {
    const result = errorResult(error, "Invalid JSON");
    const position = result.error?.match(/position\s+(\d+)/i);
    if (!position) return result;
    const offset = Number(position[1]);
    const prefix = json.slice(0, offset);
    return { ...result, errorLine: prefix.split("\n").length, errorColumn: offset - prefix.lastIndexOf("\n") };
  }
}

export function sanitizeJavaScriptIdentifier(value: string): string {
  const cleaned = value.trim().replace(/[^A-Za-z0-9_$]+/g, "_");
  const prefixed = /^[A-Za-z_$]/.test(cleaned) ? cleaned : `_${cleaned}`;
  return prefixed || "parsedXml";
}

export function createJavaScriptOutput(json: string, variableName: string, includeExport: boolean): string {
  if (!json) return "";
  const name = sanitizeJavaScriptIdentifier(variableName);
  return `const ${name} = ${json};${includeExport ? `\n\nexport default ${name};` : ""}`;
}
