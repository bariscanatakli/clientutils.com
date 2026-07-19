"use client";

import { useState, useMemo } from "react";
import { parseColor } from "@/lib/tools/color-converter";
import { CopyButton } from "@/components/ui/CopyButton";

export function ColorConverterClient() {
  const [input, setInput] = useState("#4f46e5");
  
  const result = useMemo(() => parseColor(input), [input]);

  // Use the parsed hex color as background, or fallback to transparent
  const previewColor = result ? result.hex : "transparent";

  return (
    <div className="stagger-children max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Color Converter</h1>
        <p className="text-sm text-muted">
          Convert seamlessly between HEX, RGB, and HSL color formats.
        </p>
      </div>

      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
         {/* Live Preview Area */}
         <div 
           className="h-48 w-full transition-colors duration-300 relative"
           style={{ backgroundColor: previewColor }}
         >
            {!result && input && (
              <div className="absolute inset-0 flex items-center justify-center bg-danger/10 text-danger text-sm font-semibold backdrop-blur-sm">
                Invalid Color Format
              </div>
            )}
            
            {/* Color picker overlay button */}
            {result && (
              <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20 shadow-lg">
                <input 
                  type="color" 
                  value={result.hex} 
                  onChange={(e) => setInput(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer opacity-0 absolute inset-0"
                />
                <div className="w-8 h-8 rounded-md border border-white/40 shadow-inner" style={{ backgroundColor: result.hex }} />
              </div>
            )}
         </div>

         {/* Input Area */}
         <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Enter Color (Hex, RGB, HSL)</label>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. #FF5733, rgb(255, 87, 51), hsl(10, 100%, 60%)"
                  className="w-full bg-input border border-input-border rounded-xl px-4 py-3 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-lg"
                  spellCheck={false}
                />
                {input && (
                  <button 
                    onClick={() => setInput("")} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="grid gap-3">
              <ResultRow label="HEX" value={result?.hex || ""} />
              <ResultRow label="RGB" value={result?.rgb || ""} />
              <ResultRow label="HSL" value={result?.hsl || ""} />
            </div>
         </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string, value: string }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${value ? 'bg-code-bg border-border' : 'bg-sidebar border-border/50 opacity-50'} transition-colors`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted w-12">{label}</span>
      <span className="font-mono text-sm text-foreground flex-1 px-4">{value || "-"}</span>
      <div className={value ? "opacity-100" : "opacity-0 pointer-events-none"}>
        <CopyButton text={value} size="sm" />
      </div>
    </div>
  );
}
