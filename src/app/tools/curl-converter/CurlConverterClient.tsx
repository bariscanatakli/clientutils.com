"use client";

import { useState, useMemo } from "react";
import { convertCurl, TargetLanguage } from "@/lib/tools/curl-converter";
import { CopyButton } from "@/components/ui/CopyButton";

const DEFAULT_CURL = `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'`;

export function CurlConverterClient() {
  const [input, setInput] = useState(DEFAULT_CURL);
  const [target, setTarget] = useState<TargetLanguage>("fetch");

  const result = useMemo(() => convertCurl(input, target), [input, target]);

  return (
    <div className="stagger-children max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">cURL to Fetch / Axios Converter</h1>
          <p className="text-sm text-muted mt-2">
            Paste a cURL command to instantly generate JavaScript Fetch or Axios code.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 bg-input rounded-lg p-1 border border-border w-max">
            <button
              onClick={() => setTarget("fetch")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                target === "fetch" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              Browser Fetch
            </button>
            <button
              onClick={() => setTarget("node-fetch")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                target === "node-fetch" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              Node Fetch
            </button>
            <button
              onClick={() => setTarget("axios")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                target === "axios" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              Axios
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
             <span className="text-xs font-mono text-muted">Bash cURL</span>
          </div>
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-code-foreground whitespace-pre leading-relaxed"
             spellCheck={false}
             placeholder="Paste your cURL command here..."
          />
          {result.error && input && (
             <div className="absolute bottom-0 left-0 right-0 bg-danger/10 text-danger text-xs px-4 py-2 border-t border-danger/20 backdrop-blur-md">
               Error: {result.error}
             </div>
          )}
        </div>

        {/* Output Pane */}
        <div className="flex flex-col border border-border rounded-xl bg-code-bg overflow-hidden h-[300px] lg:h-full relative">
          <div className="bg-sidebar border-b border-border px-4 py-2 flex items-center justify-between">
             <span className="text-xs font-mono text-muted capitalize">{target.replace('-', ' ')} Code</span>
             <CopyButton text={result.code} size="sm" label="Kopyala" />
          </div>
          <textarea
             value={result.code}
             readOnly
             className="flex-1 resize-none bg-transparent outline-none p-4 text-sm font-mono text-primary leading-relaxed"
             spellCheck={false}
             placeholder="Generated code will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
