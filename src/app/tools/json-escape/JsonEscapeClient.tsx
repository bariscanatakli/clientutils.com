"use client";

import { useState, useMemo } from "react";
import { escapeJson, EscapeMode } from "@/lib/tools/json-escape";
import { CopyButton } from "@/components/ui/CopyButton";

export function JsonEscapeClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("escape");

  const result = useMemo(() => escapeJson(input, mode), [input, mode]);

  const placeholderIn = mode === "escape" 
    ? '{\n  "hello": "world",\n  "test": "this \\"quote\\""\n}' 
    : '{\\n  \\"hello\\": \\"world\\",\\n  \\"test\\": \\"this \\\\\\"quote\\\\\\"\\"\\n}';
    
  const placeholderOut = mode === "escape" 
    ? '{\\n  \\"hello\\": \\"world\\",\\n  \\"test\\": \\"this \\\\\\"quote\\\\\\"\\"\\n}'
    : '{\n  "hello": "world",\n  "test": "this \\"quote\\""\n}';

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JSON Escape / Unescape</h1>
          <p className="text-sm text-muted mt-2">
            Escape JSON strings to be safely embedded inside other JSON payloads or code blocks.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-input border border-border rounded-lg p-1">
             <button
               onClick={() => setMode("escape")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "escape" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               Escape
             </button>
             <button
               onClick={() => setMode("unescape")}
               className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === "unescape" ? "bg-card shadow-sm text-foreground" : "text-muted hover:text-foreground"}`}
             >
               Unescape
             </button>
          </div>
          
          <button 
            onClick={() => setInput("")} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[500px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Input ({mode === 'escape' ? 'Raw JSON' : 'Escaped String'})</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder={placeholderIn}
          />
          {!result.data && input && result.error && (
             <div className="absolute bottom-0 left-0 right-0 bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20 backdrop-blur-md">
               Error: {result.error}
             </div>
          )}
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-primary font-semibold">Output ({mode === 'escape' ? 'Escaped String' : 'Raw JSON'})</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-primary leading-relaxed break-all"
             spellCheck={false}
             placeholder={placeholderOut}
          />
        </div>
      </div>
    </div>
  );
}
