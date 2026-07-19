import YAML from 'yaml';

export type YamlFormatMode = 'yaml-to-yaml' | 'json-to-yaml' | 'yaml-to-json';

export interface YamlResult {
  data: string;
  isValid: boolean;
  error: string | null;
}

export function formatYaml(input: string, mode: YamlFormatMode, indent: number = 2): YamlResult {
  if (!input.trim()) return { data: "", isValid: true, error: null };

  try {
    switch (mode) {
      case 'yaml-to-yaml': {
        // Parse YAML to AST, then stringify back
        const parsed = YAML.parse(input);
        return { 
          data: YAML.stringify(parsed, { indent }), 
          isValid: true, 
          error: null 
        };
      }
      case 'json-to-yaml': {
        // Parse JSON to JS object, stringify to YAML
        const parsedJson = JSON.parse(input);
        return { 
          data: YAML.stringify(parsedJson, { indent }), 
          isValid: true, 
          error: null 
        };
      }
      case 'yaml-to-json': {
        // Parse YAML to JS object, stringify to JSON
        const parsedYaml = YAML.parse(input);
        return { 
          data: JSON.stringify(parsedYaml, null, indent), 
          isValid: true, 
          error: null 
        };
      }
      default:
        return { data: input, isValid: false, error: "Invalid mode" };
    }
  } catch (err: any) {
    return {
      data: "",
      isValid: false,
      error: err.message || "Geçersiz format"
    };
  }
}
