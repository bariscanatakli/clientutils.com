import * as toml from "@iarna/toml";

export type TomlJsonMode = "toml-to-json" | "json-to-toml";

export interface TomlJsonResult {
  data: string;
  error: string | null;
}

export function convertTomlJson(input: string, mode: TomlJsonMode): TomlJsonResult {
  if (!input.trim()) return { data: "", error: null };

  try {
    if (mode === "toml-to-json") {
      const parsed = toml.parse(input);
      return { data: JSON.stringify(parsed, null, 2), error: null };
    } else {
      // JSON to TOML
      const parsedJson = JSON.parse(input);
      if (typeof parsedJson !== "object" || Array.isArray(parsedJson) || parsedJson === null) {
        return { data: "", error: "JSON must be an object at the root level to convert to TOML." };
      }
      const tomlString = toml.stringify(parsedJson);
      return { data: tomlString, error: null };
    }
  } catch (err: any) {
    return { data: "", error: err.message || "Invalid format" };
  }
}
