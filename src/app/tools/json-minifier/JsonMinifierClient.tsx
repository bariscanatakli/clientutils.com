"use client";

import { useState, useMemo } from "react";
import { minifyJson } from "@/lib/tools/json-minifier";
import { CopyButton } from "@/components/ui/CopyButton";

export function JsonMinifierClient() {
  const [input, setInput] = useState("");

  const result = useMemo(() => minifyJson(input), [input]);

  const originalSize = input.length;
  const minifiedSize = result.data.length;
  const savedBytes = originalSize - minifiedSize;
  const savedPercent = originalSize ? ((savedBytes / originalSize) * 100).toFixed(1) : "0";

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JSON Minifier & Compressor</h1>
          <p className="text-sm text-muted mt-2">
            Remove whitespace, newlines, and shrink your JSON payload instantly.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setInput("")} 
            className="text-xs font-semibold bg-card border border-border text-foreground px-4 py-2 rounded-lg hover:bg-card-hover active:scale-97 pressable transition-all"
          >
            Clear
          </button>
        </div>
      </div>

      {originalSize > 0 && !result.error && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex gap-6 text-sm">
          <div><span className="text-muted">Original Size:</span> <strong className="text-foreground">{originalSize} bytes</strong></div>
          <div><span className="text-muted">Minified Size:</span> <strong className="text-foreground">{minifiedSize} bytes</strong></div>
          <div><span className="text-muted">Space Saved:</span> <strong className="text-success">{savedBytes} bytes ({savedPercent}%)</strong></div>
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:h-[500px]">
        {/* Input Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted">Formatted JSON (Input)</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder='{\n  "key": "value"\n}'
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
             <span className="text-xs font-mono text-muted">Minified JSON (Output)</span>
             <CopyButton text={result.data} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.data}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground leading-relaxed break-all"
             spellCheck={false}
             placeholder='{"key":"value"}'
          />
        </div>
      </div>
    </div>
  );
}
