"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, RefreshCw, Type, AlignLeft, List } from "lucide-react";
import { CopyState } from "@/types/tools";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim",
  "id", "est", "laborum", "curabitur", "pretium", "tincidunt", "vivamus", "elementum", "semper",
  "nisi", "aenean", "vulputate", "eleifend", "tellus", "aenean", "leo", "ligula", "porttitor",
  "eu", "consequat", "vitae", "eleifend", "ac", "enim", "aliquam", "lorem", "ante", "dapibus", "in"
];

const STANDARD_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

type UnitType = "paragraphs" | "sentences" | "words";

const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function LoremClient() {
  const [unit, setUnit] = useState<UnitType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [htmlFormat, setHtmlFormat] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [copyState, setCopyState] = useState<CopyState>({ copied: false, text: "" });

  const generateSentence = useCallback((isFirst: boolean) => {
    // 5 to 15 words per sentence
    const wordCount = Math.floor(Math.random() * 10) + 5;
    let sentence = "";
    
    if (isFirst && startWithLorem) {
      sentence = STANDARD_START;
      // Add a few more words
      for (let i = 0; i < wordCount - 8; i++) {
        sentence += " " + getRandomWord();
      }
    } else {
      const words = Array.from({ length: wordCount }, () => getRandomWord());
      sentence = capitalize(words.join(" "));
    }
    
    // Sometimes add commas
    if (wordCount > 8 && Math.random() > 0.5 && !isFirst) {
      const commaPos = Math.floor(wordCount / 2);
      const wordsArr = sentence.split(" ");
      wordsArr[commaPos] += ",";
      sentence = wordsArr.join(" ");
    }
    
    return sentence + ".";
  }, [startWithLorem]);

  const generateParagraph = useCallback((isFirst: boolean) => {
    // 3 to 7 sentences per paragraph
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    const sentences = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence(isFirst && i === 0));
    }
    
    return sentences.join(" ");
  }, [generateSentence]);

  const generateContent = useCallback(() => {
    let result = "";

    if (unit === "words") {
      const words = [];
      if (startWithLorem) {
        const standardWords = STANDARD_START.replace(",", "").split(" ");
        words.push(...standardWords.slice(0, Math.min(count, standardWords.length)));
        for (let i = words.length; i < count; i++) {
          words.push(getRandomWord());
        }
      } else {
        for (let i = 0; i < count; i++) {
          words.push(getRandomWord());
        }
        if (words.length > 0) {
          words[0] = capitalize(words[0]);
        }
      }
      result = words.join(" ") + (count > 0 ? "." : "");
      if (htmlFormat) result = `<p>${result}</p>`;
    } 
    
    else if (unit === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(i === 0));
      }
      result = sentences.join(" ");
      if (htmlFormat) result = `<p>${result}</p>`;
    } 
    
    else if (unit === "paragraphs") {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        const p = generateParagraph(i === 0);
        paragraphs.push(htmlFormat ? `<p>${p}</p>` : p);
      }
      result = paragraphs.join(htmlFormat ? "\n" : "\n\n");
    }

    setGeneratedText(result);
  }, [unit, count, startWithLorem, htmlFormat, generateParagraph, generateSentence]);

  // Generate on initial load or when settings change
  useEffect(() => {
    const timer = window.setTimeout(generateContent, 0);
    return () => window.clearTimeout(timer);
  }, [generateContent]);

  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopyState({ copied: true, text: generatedText });
      setTimeout(() => setCopyState({ copied: false, text: "" }), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Settings Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-6">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Settings</h3>
          
          {/* Unit Tabs */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Type</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setUnit("paragraphs")}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  unit === "paragraphs" ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:bg-muted"
                }`}
              >
                <AlignLeft className="w-4 h-4" /> Paragraphs
              </button>
              <button
                onClick={() => setUnit("sentences")}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  unit === "sentences" ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:bg-muted"
                }`}
              >
                <List className="w-4 h-4" /> Sentences
              </button>
              <button
                onClick={() => setUnit("words")}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm font-medium transition-all ${
                  unit === "words" ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:bg-muted"
                }`}
              >
                <Type className="w-4 h-4" /> Words
              </button>
            </div>
          </div>

          {/* Count Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Count</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max={unit === "words" ? 500 : 100}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="number"
                min="1"
                max={unit === "words" ? 500 : 100}
                value={count}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  const max = unit === "words" ? 500 : 100;
                  if (val > max) val = max;
                  setCount(val);
                }}
                className="w-16 rounded-md border border-input bg-transparent px-2 py-1 text-sm font-mono text-center"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-4 border-t border-border">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${startWithLorem ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${startWithLorem ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-medium">Start with &quot;Lorem ipsum...&quot;</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={htmlFormat}
                  onChange={(e) => setHtmlFormat(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${htmlFormat ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${htmlFormat ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-medium">Wrap in &lt;p&gt; tags</span>
            </label>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-3 rounded-xl border border-border bg-card shadow-sm flex flex-col h-[600px]">
        {/* Header Actions */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="text-sm font-medium text-muted-foreground">
            {count} {unit} generated
          </div>
          <div className="flex gap-2">
            <button 
              onClick={generateContent}
              className="flex items-center gap-2 px-3 py-1.5 bg-background hover:bg-muted text-foreground border border-input rounded-md text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Regenerate
            </button>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
            >
              {copyState.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copyState.copied ? "Copied" : "Copy All"}
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 p-0 overflow-hidden relative">
          <textarea
            readOnly
            value={generatedText}
            className="w-full h-full resize-none bg-transparent p-6 text-base leading-relaxed focus-visible:outline-none placeholder:text-muted-foreground"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
