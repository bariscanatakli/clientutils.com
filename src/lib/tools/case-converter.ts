export type CaseFormat = 
  | "lowercase" 
  | "uppercase" 
  | "camelCase" 
  | "snake_case" 
  | "PascalCase" 
  | "kebab-case" 
  | "Title Case" 
  | "CONSTANT_CASE";

export function convertCase(text: string, format: CaseFormat): string {
  if (!text) return "";

  // Helper to split text into words, treating existing camelCase, punctuation, and spaces as separators
  const getWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Split existing camelCase
      .replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumeric with space
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
  };

  const words = getWords(text);
  if (words.length === 0) return text;

  switch (format) {
    case "lowercase":
      return text.toLowerCase();
    
    case "uppercase":
      return text.toUpperCase();

    case "camelCase":
      return words.map((w, i) => {
        const lower = w.toLowerCase();
        if (i === 0) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join('');

    case "PascalCase":
      return words.map(w => {
        const lower = w.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join('');

    case "snake_case":
      return words.map(w => w.toLowerCase()).join('_');

    case "kebab-case":
      return words.map(w => w.toLowerCase()).join('-');

    case "CONSTANT_CASE":
      return words.map(w => w.toUpperCase()).join('_');

    case "Title Case":
      return words.map(w => {
        const lower = w.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join(' ');

    default:
      return text;
  }
}
