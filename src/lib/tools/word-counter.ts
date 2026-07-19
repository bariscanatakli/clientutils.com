export interface WordCountResult {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export function analyzeText(text: string): WordCountResult {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Words: match alphanumeric and common word chars (like dashes/apostrophes in words)
  const wordsArray = text.match(/\S+/g);
  const words = wordsArray ? wordsArray.length : 0;
  
  const lines = text.split(/\r\n|\r|\n/).length;
  
  // Paragraphs: split by multiple newlines
  const paragraphsArray = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphs = paragraphsArray.length;

  // Reading time: Average adult reads ~225 words per minute
  const WORDS_PER_MINUTE = 225;
  const readingTimeMinutes = Math.ceil(words / WORDS_PER_MINUTE);

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    readingTimeMinutes
  };
}
