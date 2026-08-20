"use client";

import { useState, useRef, useMemo } from "react";
import { testRegex } from "@/lib/tools/regex-tester";

const INITIAL_TEXT = `Welcome to the Regex Tester!
Here is a sample email: user@example.com
Here is a phone number: +1-555-123-4567

Try modifying the regex above to match these patterns.`;

const COMMON_REGEXES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { label: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
  { label: "Phone", pattern: "\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}" },
  { label: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b" },
];

export function RegexTesterClient() {
  const [pattern, setPattern] = useState<string>("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState<string>("gm");
  const [text, setText] = useState<string>(INITIAL_TEXT);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and overlay
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop;
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const result = useMemo(() => testRegex(pattern, flags, text), [pattern, flags, text]);

  // Toggle flags
  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  // Generate highlighted text elements
  const highlightedElements = useMemo(() => {
    if (!result.isValid || result.matches.length === 0 || !pattern) {
      return text;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    result.matches.forEach((match, i) => {
      // Add unmatched text before the match
      if (match.index > lastIndex) {
        elements.push(<span key={`text-${i}`}>{text.substring(lastIndex, match.index)}</span>);
      }

      // Add the matched text with highlighting
      const colorClass = i % 2 === 0 ? "bg-primary/30 text-primary-foreground rounded-sm" : "bg-accent/30 text-accent-foreground rounded-sm";
      elements.push(
        <mark key={`match-${i}`} className={`transparent text-transparent px-[1px] ${colorClass}`}>
          {match.text}
        </mark>
      );

      lastIndex = match.index + match.length;
    });

    // Add remaining unmatched text
    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return elements;
  }, [result, text, pattern]);

  return (
    <div className="stagger-children max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Regex Tester</h1>
          <p className="text-sm text-muted mt-2">
            Test and debug regular expressions with live highlights and execution stats.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Editor Area */}
        <div className="space-y-4">
          
          {/* Regex Input & Flags */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 flex items-center rounded-xl border border-input-border bg-input transition-colors focus-within:border-input-focus focus-within:ring-2 focus-within:ring-primary/20">
              <span className="pl-4 font-mono text-muted text-lg">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 bg-transparent px-2 py-3 font-mono text-lg text-foreground outline-none w-full"
                placeholder="regex pattern"
                spellCheck={false}
              />
              <span className="pr-2 font-mono text-muted text-lg">/</span>
            </div>
            
            {/* Flags */}
            <div className="flex items-center rounded-xl border border-border bg-card p-1">
              {[
                { id: "g", label: "global" },
                { id: "i", label: "ignore case" },
                { id: "m", label: "multiline" },
                { id: "s", label: "dotAll" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleFlag(f.id)}
                  title={f.label}
                  className={`w-9 h-9 rounded-lg font-mono text-sm font-semibold transition-all pressable
                    ${flags.includes(f.id) ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}
                  `}
                >
                  {f.id}
                </button>
              ))}
            </div>
          </div>
          
          {!result.isValid && result.error && (
            <p className="text-sm text-danger animate-in slide-in-from-top-1 px-1">
              Hata: {result.error}
            </p>
          )}

          {/* Textarea with Highlight Overlay */}
          <div className="relative rounded-xl border border-border overflow-hidden bg-code-bg h-[400px]">
             {/* Overlay for highlights */}
             <div 
               ref={overlayRef}
               className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-words overflow-auto pointer-events-none text-transparent leading-[24px]"
               aria-hidden="true"
             >
               {highlightedElements}
             </div>
             
             {/* Actual textarea */}
             <textarea
               ref={textareaRef}
               value={text}
               onChange={(e) => setText(e.target.value)}
               onScroll={handleScroll}
               className="absolute inset-0 p-4 font-mono text-sm text-code-foreground whitespace-pre-wrap break-words bg-transparent outline-none resize-none leading-[24px] z-10"
               spellCheck={false}
               placeholder="Enter text to test your regex against..."
             />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Box */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Sonuçlar</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-input rounded-lg p-3 border border-border">
                <div className="text-[10px] uppercase font-bold text-muted mb-1">Eşleşmeler</div>
                <div className="text-xl font-bold text-primary">{result.matches.length}</div>
              </div>
              <div className="bg-input rounded-lg p-3 border border-border">
                <div className="text-[10px] uppercase font-bold text-muted mb-1">Süre</div>
                <div className="text-xl font-bold text-foreground">{result.execTimeMs} <span className="text-xs text-muted font-normal">ms</span></div>
              </div>
            </div>
          </div>

          {/* Common Patterns */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
             <h3 className="text-sm font-semibold text-foreground">Hazır Şablonlar</h3>
             <div className="space-y-2">
               {COMMON_REGEXES.map((r, idx) => (
                 <button
                   key={idx}
                   onClick={() => setPattern(r.pattern)}
                   className="w-full text-left bg-input hover:bg-black/5 dark:hover:bg-white/5 border border-border rounded-lg p-3 transition-colors group"
                 >
                   <div className="text-xs font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{r.label}</div>
                   <div className="font-mono text-[10px] text-muted truncate">{r.pattern}</div>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
