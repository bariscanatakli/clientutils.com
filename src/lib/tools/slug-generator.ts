export interface SlugConfig {
  separator: "-" | "_";
  lowercase: boolean;
  removeStopWords: boolean;
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", 
  "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", 
  "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"
]);

export function generateSlug(text: string, config: SlugConfig): string {
  if (!text) return "";

  let result = text;

  // 1. Lowercase if needed (do it early to simplify stop-words check)
  if (config.lowercase) {
    result = result.toLowerCase();
  }

  // 2. Remove stop words if needed
  if (config.removeStopWords) {
    // Split by non-word chars, filter, rejoin with spaces temporarily
    const words = result.split(/[\s\W]+/);
    const filtered = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
    result = filtered.join(" ");
  }

  // 3. Normalize to separate accented characters (e.g., é -> e)
  result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 4. Replace spaces and non-alphanumeric chars with separator
  const separatorChar = config.separator;
  
  result = result
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars except spaces and dashes
    .trim()
    .replace(/[\s_-]+/g, separatorChar); // Replace spaces, underscores, multiple dashes with chosen separator

  // 5. Final lowercase safety check if the user wanted lowercase (accents might have introduced uppercase depending on locale)
  if (config.lowercase) {
     result = result.toLowerCase();
  }

  return result;
}
