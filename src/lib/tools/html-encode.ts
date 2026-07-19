import he from "he";

export type HtmlEncodeMode = "encode" | "decode";

export function processHtmlString(input: string, mode: HtmlEncodeMode): string {
  if (!input) return "";

  try {
    if (mode === "encode") {
      return he.encode(input, { useNamedReferences: true });
    } else {
      return he.decode(input);
    }
  } catch (err) {
    return "";
  }
}
