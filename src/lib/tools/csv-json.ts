import Papa from "papaparse";

export type CsvJsonMode = "csv-to-json" | "json-to-csv";

export interface CsvJsonResult {
  data: string;
  error: string | null;
}

export function convertCsvJson(input: string, mode: CsvJsonMode): CsvJsonResult {
  if (!input.trim()) return { data: "", error: null };

  try {
    if (mode === "csv-to-json") {
      const parsed = Papa.parse(input, { header: true, skipEmptyLines: true });
      if (parsed.errors.length > 0) {
        return { data: "", error: parsed.errors[0].message };
      }
      return { data: JSON.stringify(parsed.data, null, 2), error: null };
    } else {
      // JSON to CSV
      const parsedJson = JSON.parse(input);
      if (!Array.isArray(parsedJson)) {
        return { data: "", error: "JSON must be an array of objects to convert to CSV." };
      }
      const csv = Papa.unparse(parsedJson);
      return { data: csv, error: null };
    }
  } catch (err: any) {
    return { data: "", error: err.message || "Invalid format" };
  }
}
